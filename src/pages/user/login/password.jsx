/**
 * 
 * Manage the content of the sign in page (password page)
 * 
 **/

import generalStyles from './../../../assets/styles/general.module.css';

import { Title } from './../../../assets/components/Title.jsx';
import { Help } from './../../../assets/components/Help.jsx';
import {
    Input, Button, Mark, FlexContainer, CheckBox, Link, showDialog, setInputState
} from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { InputFieldsContainer, redoLogin, nextCheck, loginSuccessful } from './../login.jsx';
import { loginData, loadAES, hash } from './../../../assets/scripts/pages/loginData.jsx';
import { useLocation, useNavigate } from '@solidjs/router';
import { getSalts, signInPOST } from './../../../assets/scripts/communication/accounts.jsx';
import { updateUserState } from './../../../assets/scripts/user.jsx';
import { checkPlatformSupport } from './../../../assets/scripts/deviceCredential.jsx';

export function sessionsLimit(nav){
    showDialog("Sessions limit exceeded!",
                "We couldn't sign you in because your account's sessions limit has been exceeded!",
                [
                    ["Ok", function(dialog, remove){
                        remove();
                        nav("/user/login");
                    }]
                ]);
}

export default function LoginPassword(props){
    let nextButton,
        password, passwordInput,
        navigate = useNavigate(),
        location = useLocation();
    onMount(() => {
        passwordInput = document.getElementById("password");
        let check = () => {
            if(passwordInput.value.length < 10 || passwordInput.value.length > 128){
                nextButton.setAttribute("disabled", "");
            }else{
                nextButton.removeAttribute("disabled");
            }
        };
        check();
        passwordInput.oninput = check;
        if(loginData.username == undefined){
            redoLogin(navigate);
        }else{
            props.pageLoaded();
        }
    });
    onCleanup(() => {
        props.pageUnloading();
    });
    return <>
        <Title>Sign In</Title>
        <Help feed={"login"}/>
        <h1>Welcome back, {loginData.username}!</h1>
        <br/>
        <h3>Please enter <Mark>your password</Mark> to verify your identity!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <input type={"username"} style={"display: none;"} value={loginData.username}/>
            <InputFieldsContainer>
                <Input ref={password} id={"password"} type={"password"} label={"Password"}
                        autocomplete={"current-password"}
                        style={{width: "calc(100% - 8px)"}} onSumbit={() => nextButton}/>
                <CheckBox id={"showPassword"} label={"Show password"}
                            style={{margin: "8px auto 8px 8px"}}
                            checked={false}
                            onActive={function(){
                                document.getElementById("password").type = "text";
                            }}
                            onInactive={function(){
                                document.getElementById("password").type = "password";
                            }}
                        />
            </InputFieldsContainer>
            <FlexContainer space={"between"} horizontal no-grow>
                <Button type={"action"} function={function(){history.back()}}>Go back</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                    nextCheck(nextButton, function(setError, isDone){
                        if(loginData.username != undefined &&
                            passwordInput.value.length >= 10 && passwordInput.value.length <= 128){
                            loadAES(function(){
                                getSalts(function(error, data){
                                    if(error){
                                        setError();
                                    }else{
                                        signInPOST({
                                            username: loginData.username,
                                            passwordHash: hash(
                                                data[0] +
                                                passwordInput.value +
                                                data[1]),
                                            timezoneOffset: (new Date()).getTimezoneOffset()
                                        }, function(isSuccessful, data){
                                            if(data != undefined && data.sessionsLimitExceeded){
                                                setError();
                                                sessionsLimit(navigate);
                                            }else if(isSuccessful && data.validUser){
                                                checkPlatformSupport(function(error, supported){
                                                    isDone(data, supported);
                                                });
                                            }else if(data != undefined && !data.validUser){
                                                if(data.onCooldown){
                                                    setInputState(password, false,
                                                                    `Account on login cooldown!
                                                                    Try again in 10 minutes!`);
                                                }else{
                                                    // For some reason, using the <Link> element
                                                    // breaks the render function!
                                                    setInputState(password, false, () => <>
                                                        Incorrect password! Try again or try
                                                        to <a class={generalStyles.link}
                                                                href={"/user/recovery/password"}>
                                                                reset the password
                                                            </a>!
                                                    </>);
                                                }
                                                setError();
                                            }else{
                                                setError();
                                                showDialog("Error!", `We couldn't sign you in,
                                                                        please try again later!`);
                                            }
                                        });
                                    }
                                });
                            });
                        }else{
                            setError();
                            redoLogin(navigate, true);
                        }
                    }, function(data, webAuthnSupport){
                        if(data.require2FA){
                            navigate("/user/challenge");
                        }else{
                            // Sign the user in!
                            updateUserState(function(){
                                let deviceID =
                                        localStorage.getItem(`DEVICE_TRUSTED_${loginData.UID}`);
                                if(deviceID == undefined && webAuthnSupport){
                                    navigate("/user/device/setup");
                                }else{
                                    loginSuccessful(navigate);
                                }
                            }, true);
                        }
                    });
                }} href={"/user/challenge"} primary>Next</Button>
            </FlexContainer>
        </FlexContainer>
    </>;
}