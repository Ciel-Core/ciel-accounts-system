/**
 * 
 * Manage the content of the sign in page (password page)
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Input, Button, Mark, FlexContainer, CheckBox, Notice, Link } from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { InputFieldsContainer, redoLogin } from './../login.jsx';
import { loginData } from './../../../assets/scripts/pages/loginData.jsx';
import { useNavigate } from '@solidjs/router';

export default function LoginPassword(props){
    let nextButton,
        navigate = useNavigate();
    onMount(() => {
        let passwordInput = document.getElementById("password"), check = () => {
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
                <Input id={"password"} type={"password"} label={"Password"}
                        autocomplete={"current-password"}
                        hint={<CheckBox id={"showPassword"} label={"Show password"}
                                        style={{margin: "12px 0px 0px 0px"}}
                                        checked={false}
                                        onActive={function(){
                                            document.getElementById("password").type = "text";
                                        }}
                                        onInactive={function(){
                                            document.getElementById("password").type = "password";
                                        }}
                            />}
                        style={{width: "calc(100% - 8px)"}}/>
                <Link href={"/user/recovery/password"}
                        style={{
                            "text-align": "left",
                            display: "block",
                            padding: "0px 5px",
                            "font-size": "14px"
                            }}>Forgot password?</Link>
            </InputFieldsContainer>
            <FlexContainer space={"between"} horozontal no-grow>
                <Button type={"action"} function={function(){history.back()}}>Go back</Button>
                <Button ref={nextButton} type={"link"} href={"/user/challenge"} primary>Next</Button>
            </FlexContainer>
        </FlexContainer>
    </>;
}