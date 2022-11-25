/**
 * 
 * Manage the content of the sign in page
 * 
 **/

import { Title } from './../../assets/components/Title.jsx';
import { Help } from './../../assets/components/Help.jsx';
import { Input, Button, Notice, Mark, FlexContainer, showDialog, setInputState } from '../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { nextCheck } from './register.jsx';
import { useNavigate } from '@solidjs/router';
import { usernameCheckPOST } from './../../assets/scripts/communication/accounts.jsx';
import { loginData, resetLoginData } from './../../assets/scripts/pages/loginData.jsx';
import { userData } from './../../assets/scripts/user.jsx';

export { nextCheck };

export function InputFieldsContainer(props){
    return (<div style={{width: "100%", position: "relative", overflow: "hidden"}}>{props.children}</div>);
}

export function loginSuccessful(nav, replace = false){
    if(userData().system.customizationComplete){
        nav("/", {replace});
    }else{
        nav("/user/customization", {replace});
    }
}

export function redoLogin(navigate, prompt = false){
    resetLoginData();
    if(prompt){
        showDialog("Something went wrong!", "It looks like some of your login data went missing!", [
            ["Refill login details", function(dialog, remove){
                navigate("/user/login", { replace: true });
                remove();
            }]
        ]);
    }else{
        navigate("/user/login", { replace: true });
    }
}
export default function Login(props){
    let navigate = useNavigate(),
        nextButton,
        username,
        usernameInput;
    onMount(() => {
        usernameInput = document.getElementById("username");
        if(loginData.username != undefined){
            usernameInput.value = loginData.username;
        }
        let check = () => {
            if(usernameInput.value.length < 3 || usernameInput.value.length > 20){
                nextButton.setAttribute("disabled", "");
            }else{
                nextButton.removeAttribute("disabled");
            }
        };
        check();
        usernameInput.oninput = check;
        props.pageLoaded();
    });
    onCleanup(() => {
        props.pageUnloading();
    });
    return <>
        <Title>Sign In</Title>
        <Help feed={"login"}/>
        <h1>Sign in</h1>
        <br/>
        <h3>Use your <Mark>{import.meta.env.VITE_NAME} account</Mark> securely!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <InputFieldsContainer>
                <Input ref={username} id={"username"} type={"text"} label={"Username"} autocomplete={"username"}
                        style={{width: "calc(100% - 8px)"}} maxlength={20} onSumbit={() => nextButton}/>
            </InputFieldsContainer>
            <Notice>Not using your own device? Use Guest mode or Incognito mode to sign in privately.</Notice>
            <FlexContainer space={"between"} horozontal no-grow>
                <Button type={"link"} href={"/user/register"}>Create account</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                    // usernameCheckPOST
                    nextCheck(nextButton, function(setError, isDone){
                        if(!/^[A-Za-z0-9_]{3,20}$/.test(usernameInput.value) || !/[a-zA-Z]/.test(usernameInput.value)){
                            setInputState(username, false, "Invalid username!");
                            setError();
                        }else{
                            usernameCheckPOST(usernameInput.value, function(isSuccessful, response){
                                if(isSuccessful){
                                    if(response.usernameExists){
                                        isDone(response.UID, response.trustedDevices);
                                        loginData.username = response.displayUsername;
                                        loginData.UID = response.UID;
                                    }else{
                                        setInputState(username, false, "User doesn't exist!");
                                        setError();
                                    }
                                }else{
                                    showDialog("Error!", "We couldn't get a valid response from the server!", [
                                        ["Ok", function(dialog, remove){
                                            remove();
                                        }]
                                    ]);
                                    setError();
                                }
                            }, true, false, false, true);
                        }
                    }, function(UID, trustedDevices){
                        let deviceID = localStorage.getItem(`DEVICE_TRUSTED_${UID}`);
                        if(deviceID != undefined && trustedDevices.includes(deviceID)){
                            navigate("/user/device/auth");
                        }else{
                            localStorage.removeItem(`DEVICE_TRUSTED_${UID}`);
                            navigate("/user/login/password");
                        }
                    });
                }} primary>Next</Button>
            </FlexContainer>
        </FlexContainer>
    </>;
}