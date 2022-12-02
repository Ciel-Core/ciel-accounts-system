/**
 * 
 * Manage the content of the sign up page (username section)
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Help } from './../../../assets/components/Help.jsx';
import {
    Input, Button, Notice, Mark, FlexContainer, setInputState, showDialog
} from './../../../assets/components/CustomElements.jsx';
import { InputFieldsContainer, nextCheck, redoRegister, ButtonsContainer } from './../register.jsx';
import {
    onCleanup,
    onMount
} from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { registerData, checkDataByOrder} from './../../../assets/scripts/pages/registerData.jsx';
import { textProfanity } from './../../../assets/scripts/filter.jsx';
import { usernameCheckPOST } from './../../../assets/scripts/communication/accounts.jsx';

export default function RegisterUsername(props){
    let navigate = useNavigate(),
        nextButton, username;
    onMount(() => {
        let usernameInput = username.children[0].children[0];
        if(registerData.username != undefined){
            usernameInput.value = registerData.username;
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
        checkDataByOrder(1, function(error){
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
        <h1>Choose a username!</h1>
        <br/>
        <h3>Choose your own <Mark>username</Mark>!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <InputFieldsContainer>
                <Input ref={username} id={"username"} type={"text"} label={"Username"}
                        autocomplete={"off"} style={{width: "calc(100% - 8px)"}}
                        maxlength={20} onSumbit={() => nextButton}/>
            </InputFieldsContainer>
            <Notice>
                Your username is public, make sure it does not contain any sensitive or
                personal information!
            </Notice>
            <ButtonsContainer>
                <Button type={"action"} function={function(){history.back()}}>Go back</Button>
                <Button ref={nextButton} type={"action"} function={function(){
                    nextCheck(nextButton, function(setError, isDone){
                        let usernameInput = username.children[0].children[0],
                            userValue = usernameInput.value.toLowerCase();
                        if(!/^[A-Za-z0-9_]*$/.test(userValue)){
                            setInputState(username, false,
                                            "Can only contain letters, numbers, and underscores!");
                            setError();
                        }else if(!/[a-zA-Z]/.test(userValue)){
                            setInputState(username, false, "Must at least contain one letter!");
                            setError();
                        }else if(userValue.length < 3 || userValue.length > 20){
                            setInputState(username, false,
                                            `Must be at least 3 characters long, and cannot
                                            exceed 20 characters!`);
                            setError();
                        }else{
                            // Advanced checks
                            var request = new XMLHttpRequest();
                            request.open('GET', '/lists/reserved_usernames.txt');
                            request.send(null);
                            request.onloadend = function(){
                                if(request.status === 200){
                                    let reservedUsernames = request.responseText;
                                    if(reservedUsernames.includes(userValue)){
                                        setInputState(username, false,
                                                        "Username is reserved by the system!");
                                        setError();
                                    }else{
                                        // Profanity Check
                                        textProfanity(usernameInput.value).then(function(status){
                                            if(status){
                                                setInputState(username, false,
                                                                "Profanity not allow!");
                                                setError();
                                            }else{
                                                // Username status (taken or not)
                                                usernameCheckPOST(usernameInput.value,
                                                    function(isSuccessful, response){
                                                        if(isSuccessful){
                                                            if(response.usernameExists){
                                                                setInputState(username, false,
                                                                    "Username is already taken!");
                                                                setError();
                                                            }else if(response.usernameOnCooldown){
                                                                setInputState(username, false,
                                                                    `Username on cooldown, try
                                                                    again later!`);
                                                                setError();
                                                            }
                                                        }else{
                                                            showDialog("Error!",
                                                                `We couldn't get a valid response
                                                                from the server!`, [
                                                                ["Ok", function(dialog, remove){
                                                                    remove();
                                                                }]
                                                            ]);
                                                            setError();
                                                        }
                                                        isDone();
                                                    }, false, true, true);
                                            }
                                        });
                                    }
                                }else{
                                    setInputState(username, false,
                                                    "An error occured, please try again later!");
                                    setError();
                                }
                            };
                        }
                    }, function(){
                        registerData.username = username.children[0].children[0].value;
                        checkDataByOrder(2, function(error){
                            if(error){
                                redoRegister(navigate, true);
                            }else{
                                navigate("/user/register/password");
                            }
                        });
                    });
                }} primary>Next</Button>
            </ButtonsContainer>
        </FlexContainer>
    </>;
}