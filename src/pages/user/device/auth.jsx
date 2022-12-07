/**
 * 
 * Manage the content of the device auth page
 * 
 **/

// import styles from './../assets/styles/pages/device.auth.module.css';

import { Title } from './../../../assets/components/Title.jsx';
import { Help } from './../../../assets/components/Help.jsx';
import {
    Mark, FlexContainer, Notice, showDialog
} from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import {
    arrayBufferToBase64, checkCreditential, checkPlatformSupport
} from './../../../assets/scripts/deviceCredential.jsx';
import { useNavigate } from '@solidjs/router';
import { loginData } from './../../../assets/scripts/pages/loginData.jsx';
import { throwError } from './../../../assets/scripts/console.jsx';
import { authnSignInPOST } from './../../../assets/scripts/communication/accounts.jsx';
import { updateUserState } from './../../../assets/scripts/user.jsx';
import { loginSuccessful } from './../login.jsx';
import { sessionsLimit } from './../login/password.jsx';

export default function DeviceAuth(props){
    let navigate = useNavigate(),
        localContent = document.getElementById("local-content");
    checkPlatformSupport(function(error, supported){
        if(!supported){
            navigate("/");
        }
    });
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
        let attemptSignIn = function(){
            setTimeout(function(){
                let errorFunc = function(){
                    showDialog("Something went wrong!",
                                "We couldn't verify your identity using this device!", [
                                ["Use password", function(dialog, remove){
                                    remove();
                                    navigate("/user/login/password");
                                }], ["Retry", function(dialog, remove){
                                    remove();
                                    attemptSignIn();
                                }]
                            ]);
                };
                // Get challenge reply
                checkCreditential(function(error, challenge, assertion){
                    if(error){
                        errorFunc();
                        throwError(error);
                    }else{
                        localContent.dataset.processing = true;
                        // Check if the server accepted this challenge and logged the user in
                        authnSignInPOST({
                            deviceID: localStorage.getItem(`DEVICE_TRUSTED_${loginData.UID}`),
                            clientDataJSON: assertion.response.clientDataJSON ?
                                arrayBufferToBase64(assertion.response.clientDataJSON) : null,
                            authenticatorData: assertion.response.authenticatorData ?
                                arrayBufferToBase64(assertion.response.authenticatorData) : null,
                            signature: assertion.response.signature ?
                                arrayBufferToBase64(assertion.response.signature) : null,
                            challenge,
                            timezoneOffset: (new Date()).getTimezoneOffset()
                        }, function(success, data){
                            localContent.dataset.processing = false;
                            if(data != undefined && data.sessionsLimitExceeded){
                                sessionsLimit(navigate);
                            }else if(success && data.validUser){
                                // Sign the user in!
                                updateUserState(function(){
                                    loginSuccessful(navigate);
                                }, true);
                            }else if(!data.validUser){
                                errorFunc();
                            }else{
                                // Authn successful, couldn't log user in!
                                showDialog("Error!", `We couldn't sign you in,
                                                        please try again later!`, [
                                                            ["Ok", function(dialog, remove){
                                                                history.back();
                                                                remove();
                                                            }]
                                                        ]);
                            }
                        });
                    }
                });
            }, 250);
        };
        if(loginData.UID == undefined){
            navigate("/user/login");
        }else{
            attemptSignIn();
        }
    });
    return (<>
        <Title>Sign In</Title>
        <Help feed={"login"}/>
        <h1>Welcome back, {loginData.username}!</h1>
        <br/>
        <h3>Verify your identity using <Mark>your device</Mark>!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <Notice style={{"text-align": "center"}}>
                You will be prompted with an authentication dialogue in a moment!
            </Notice>
        </FlexContainer>
    </>);
}