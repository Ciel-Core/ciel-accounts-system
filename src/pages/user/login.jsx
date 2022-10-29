/**
 * 
 * Manage the content of the sign in page
 * 
 **/

import { Title } from './../../assets/components/Title.jsx';
import { Input, Button, Notice, Mark, FlexContainer, showDialog, setInputState } from '../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { nextCheck } from './register.jsx';
import { useNavigate } from '@solidjs/router';
import { usernameCheckPOST } from './../../assets/scripts/communication/accounts.jsx';
import { loginData } from './../../assets/scripts/pages/loginData.jsx';

export function InputFieldsContainer(props){
    return (<div style={{width: "100%", position: "relative", overflow: "hidden"}}>{props.children}</div>);
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
        <h1>Sign in</h1>
        <br/>
        <h3>Use your <Mark>Ciel account</Mark> securely!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <InputFieldsContainer>
                <Input ref={username} id={"username"} type={"text"} label={"Username"} autocomplete={"username"}
                        style={{width: "calc(100% - 8px)"}} maxlength={20}/>
            </InputFieldsContainer>
            <Notice>Not using your own device? Use Guest mode or Incognito mode to sign in privately.</Notice>
            <FlexContainer space={"between"} horozontal no-grow>
                <Button type={"link"} href={"/user/register"}>Create account</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                    // usernameCheckPOST
                    nextCheck(nextButton, function(setError, isDone){
                        usernameCheckPOST(usernameInput.value, function(isSuccessful, response){
                            if(isSuccessful){
                                if(response.usernameExists){
                                    isDone();
                                    loginData.username = response.displayUsername;
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
                        });
                    }, function(){
                        navigate("/user/login/password");
                    });
                }} primary>Next</Button>
            </FlexContainer>
        </FlexContainer>
    </>;
}