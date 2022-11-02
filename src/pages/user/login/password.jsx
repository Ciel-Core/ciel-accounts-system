/**
 * 
 * Manage the content of the sign in page (password page)
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Input, Button, Mark, FlexContainer, CheckBox, Link, showDialog, setInputState } from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { InputFieldsContainer, redoLogin, nextCheck } from './../login.jsx';
import { loginData, loadAES, hash } from './../../../assets/scripts/pages/loginData.jsx';
import { useNavigate } from '@solidjs/router';
import { getSalts, signInPOST } from './../../../assets/scripts/communication/accounts.jsx';

export default function LoginPassword(props){
    let nextButton,
        password, passwordInput,
        navigate = useNavigate();
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
        }
        props.pageLoaded();
    });
    onCleanup(() => {
        props.pageUnloading();
    });
    return <>
        <Title>Sign In</Title>
        <h1>Welcome back, {loginData.username}!</h1>
        <br/>
        <h3>Please enter <Mark>your password</Mark> to verify your identity!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <input type={"username"} style={"display: none;"} value={loginData.username}/>
            <InputFieldsContainer>
                <Input ref={password} id={"password"} type={"password"} label={"Password"}
                        autocomplete={"current-password"}
                        style={{width: "calc(100% - 8px)"}}/>
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
                <Link href={"/user/recovery/password"}
                        style={{
                            width: "fit-content",
                            "text-align": "left",
                            display: "block",
                            padding: "0px 6px",
                            "font-size": "14px",
                            margin: "18px 0px"
                            }}>Forgot password?</Link>
            </InputFieldsContainer>
            <FlexContainer space={"between"} horozontal no-grow>
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
                                        signInPOST(loginData.username, hash(data[0] + passwordInput.value + data[1]), function(isSuccessful, data){
                                            if(isSuccessful){
                                                isDone(data);
                                            }else{
                                                setError();
                                                showDialog("Error!", "We couldn't sign you in, please try again later!");
                                            }
                                        });
                                    }
                                });
                            });
                        }else{
                            setError();
                            redoLogin(navigate, true);
                        }
                    }, function(data){
                        if(data.validUser){
                            if(data.require2FA){
                                navigate("/user/login/trust");
                            }else{
                                showDialog("Notice", "You have the correct login credentials, but you can't access your account now. We're still working on this!");
                            }
                        }else{
                            setInputState(password, false, "Incorrect password!");
                        }
                    });
                }} href={"/user/challenge"} primary>Next</Button>
            </FlexContainer>
        </FlexContainer>
    </>;
}