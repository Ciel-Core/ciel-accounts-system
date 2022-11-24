/**
 * 
 * Manage the content of the sign up page (password section)
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Help } from './../../../assets/components/Help.jsx';
import { Input, Button, Notice, Mark, FlexContainer, CheckBox, setInputState } from './../../../assets/components/CustomElements.jsx';
import { InputFieldsContainer, clientDataCheck, nextCheck, redoRegister, ButtonsContainer } from './../register.jsx';
import { onCleanup, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { registerData, checkDataByOrder, hash, loadAES } from './../../../assets/scripts/pages/registerData.jsx';
import { getSalts } from './../../../assets/scripts/communication/accounts.jsx';

export default function RegisterPassword(props){
    let navigate = useNavigate(),
        updateButton,
        nextButton, password, passwordConfirm, usernameHiddenInput,
        emptyPassword = () => {
            password.children[0].children[0].value = "";
            passwordConfirm.children[0].children[0].value = "";
            usernameHiddenInput.value = "";
        };
    onMount(() => {
        updateButton = clientDataCheck(nextButton, "password", "password_confirm");
        usernameHiddenInput.value = registerData.username;
        checkDataByOrder(2, function(error){
            if(error){
                redoRegister(navigate);
            }else{
                props.pageLoaded();
            }
        });
    });
    onCleanup(() => {
        props.pageUnloading();
    });
    return <>
        <Title>Sign Up</Title>
        <Help feed={"register"}/>
        <h1>Choose a password!</h1>
        <br/>
        <h3>Choose a <Mark>secure password</Mark> for your account!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <input ref={usernameHiddenInput} id={"username-hidden"} type={"username"} style={"display: none;"} value={"TestUsername"}/>
            <InputFieldsContainer>
                <Input ref={password} id={"password"} type={"password"} label={"Password"} autocomplete={"new-password"}
                        style={{width: "calc(100% - 8px)"}} onSumbit={() => nextButton}/>
                <Input ref={passwordConfirm} id={"password_confirm"} type={"password"} label={"Confirmation"} autocomplete={"new-password"}
                        style={{width: "calc(100% - 8px)"}} onSumbit={() => nextButton}/>
                <CheckBox id={"showPassword"} label={"Show password"}
                            style={{"margin": "8px", "margin-right": "auto"}}
                            checked={false}
                            onActive={function(){
                                document.getElementById("password").type = "text";
                                document.getElementById("password_confirm").type = "text";
                            }}
                            onInactive={function(){
                                document.getElementById("password").type = "password";
                                document.getElementById("password_confirm").type = "password";
                            }}
                        />
            </InputFieldsContainer>
            <Notice>The password must be at least 10 characters long, with a mix of letters and numbers! (Note that it's recommended to mix in a few special characters)</Notice>
            <ButtonsContainer>
                <Button type={"action"} function={function(){emptyPassword(); setTimeout(function(){history.back()}, 1);}}>Go back</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                    nextCheck(nextButton, function(setError, isDone){
                        let passwordInput = password.children[0].children[0],
                            passwordConfirmInput = passwordConfirm.children[0].children[0];
                        
                        if(passwordInput.value.length < 10 || passwordInput.value.length > 128){
                            setInputState(password, false, "Must be from 10 up to 128 characters long!");
                            passwordConfirmInput.value = "";
                            setTimeout(updateButton, 1);
                            setError();
                        }else if(!/[a-zA-Z]/.test(passwordInput.value) && !/[0-9]/.test(passwordInput.value)){
                            setInputState(password, false, "Must contain letters and numbers!");
                            passwordConfirmInput.value = "";
                            setTimeout(updateButton, 1);
                            setError();
                        }else if(!/[a-zA-Z]/.test(passwordInput.value)){
                            setInputState(password, false, "Must contain at least one letter!");
                            passwordConfirmInput.value = "";
                            setTimeout(updateButton, 1);
                            setError();
                        }else if(!/[0-9]/.test(passwordInput.value)){
                            setInputState(password, false, "Must contain at least one number!");
                            passwordConfirmInput.value = "";
                            setTimeout(updateButton, 1);
                            setError();
                        }else if(passwordConfirmInput.value != passwordInput.value){
                            setInputState(passwordConfirm, false, "Does not match the password!");
                            passwordConfirmInput.value = "";
                            setTimeout(updateButton, 1);
                            passwordConfirmInput.focus();
                            setError();
                        }else{
                            loadAES(function(){
                                getSalts(function(error, data){
                                    if(error){
                                        setError();
                                    }else{
                                        isDone(data);
                                    }
                                });
                            });    
                        }
                    }, function(salts){
                        registerData.passwordHash = hash(salts[0] + password.children[0].children[0].value + salts[1]);
                        checkDataByOrder(3, function(error){
                            if(error){
                                emptyPassword();
                                setTimeout(function(){redoRegister(navigate, true)}, 1);
                            }else{
                                navigate("/user/register/personal");
                            }
                        });
                    });
                }} primary>Next</Button>
            </ButtonsContainer>
        </FlexContainer>
    </>;
}