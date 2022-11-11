/**
 * 
 * Manage the content of the device auth page
 * 
 **/

// import styles from './../assets/styles/pages/device.auth.module.css';

import { Title } from './../../../assets/components/Title.jsx';
import { Mark, FlexContainer, Notice, showDialog } from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { checkCreditential, checkPlatformSupport } from './../../../assets/scripts/deviceCredential.jsx';
import { useNavigate } from '@solidjs/router';
import { loginData } from './../../../assets/scripts/pages/loginData.jsx';
import { throwError } from './../../../assets/scripts/console.jsx';

export default function DeviceAuth(props){
    let navigate = useNavigate();
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
        if(loginData.UID == undefined){
            navigate("/user/login");
        }
        setTimeout(function(){
            // Get challenge reply
            //getAuthnLoginDataPOST
            checkCreditential(function(error, assertion){
                if(error){
                    throwError(error);
                    showDialog("Something went wrong!", "We couldn't verify your identity using this device!", [
                        ["Ok", function(dialog, remove){
                            remove();
                            navigate("/user/login");
                        }]
                    ]);
                }else{
                    // Check if the server accepted this challenge and logged the user in
                    alert(":)");

                    // Remember that this device is trusted
                    // localStorage.setItem(`DEVICE_TRUSTED_${loginData.UID}`, "DEVICE_ID?");
                }
            });
        }, 250);
    });
    return (<>
        <Title>Device Auth</Title>
        <h1>Welcome back, {loginData.username}!</h1>
        <br/>
        <h3>Verify your identity using <Mark>your device</Mark>!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <Notice style={{"text-align": "center"}}>You will be prompted with an authentication dialogue in a moment!</Notice>
        </FlexContainer>
    </>);
}