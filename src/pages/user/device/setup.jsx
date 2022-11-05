/**
 * 
 * Manage the content of the device auth setup page
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Button, Mark, FlexContainer, Notice, showDialog } from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { checkCreditential, checkPlatformSupport, createPublicKey } from './../../../assets/scripts/deviceCredential.jsx';
import { useNavigate } from '@solidjs/router';

export default function DeviceAuthSetup(props){
    let navigate = useNavigate(),
        setupButton,
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
        // Check if WebAuthn platform credential is supported
    });
    return (<>
        <Title>Device Auth</Title>
        <h1><Mark>Trust</Mark> this device?</h1>
        <br/>
        <h3>You could use this device as a trusted device to authenticate your logins!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <Notice>You can only set up devices with passwords or other similar security measures as trusted devices!</Notice>
            <FlexContainer space={"between"} horozontal no-grow>
                <Button type={"link"} href={"/"}>Skip</Button>
                <Button ref={setupButton} type={"action"} function={function(){
                    localContent.dataset.processing = true;
                    setupButton.setAttribute("disabled", "");
                    let challengeKey = "KEY_" + Math.round(Math.random()*100000000);
                    createPublicKey(challengeKey, {
                            ID: "dsadfgds" + props.userData.UID,
                            name: props.userData.displayUsername,
                            displayName: props.userData.FirstName + " " + props.userData.LastName
                        }, function(error, data){
                            localContent.dataset.processing = false;
                            setupButton.removeAttribute("disabled");
                            if(error){
                                showDialog("Something went wrong!", "We couldn't get a valid response from your device!");
                                throw error;
                            }else{
                                //window.DATA = data;
                                checkCreditential(challengeKey, data.credentialId, function(error, assertion){
                                    console.log([error, assertion]);
                                });
                            }
                        });
               }} primary>Setup Auth</Button>
            </FlexContainer>
        </FlexContainer>
    </>);
}