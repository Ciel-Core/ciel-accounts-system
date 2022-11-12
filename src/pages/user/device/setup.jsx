/**
 * 
 * Manage the content of the device auth setup page
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Button, Mark, FlexContainer, Notice, showDialog } from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { checkPlatformSupport, createPublicKey } from './../../../assets/scripts/deviceCredential.jsx';
import { useNavigate } from '@solidjs/router';
import { userData } from './../../../assets/scripts/user.jsx';

export default function DeviceAuthSetup(props){
    let navigate = useNavigate(),
        setupButton,
        localContent = document.getElementById("local-content");
    checkPlatformSupport(function(error, supported){
        if(!supported){
            navigate("/", {replace: true});
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
        <h1>Trust this device?</h1>
        <br/>
        <h3>You could use this device as a <Mark>trusted device</Mark> to authenticate your logins!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <Notice>You can only set up devices with passwords or other similar security measures as trusted devices!</Notice>
            <FlexContainer space={"between"} horozontal no-grow>
                <Button type={"link"} href={"/"}>Skip</Button>
                <Button ref={setupButton} type={"action"} function={function(){
                    localContent.dataset.processing = true;
                    setupButton.setAttribute("disabled", "");
                    createPublicKey(userData().username, function(error, data){
                        localContent.dataset.processing = false;
                        setupButton.removeAttribute("disabled");
                        if(error){
                            showDialog("Something went wrong!", "We couldn't verify this authentication!",
                                [
                                    ["Ok", function(dialog, remove){
                                        remove();
                                        navigate("/", {replace: true});
                                    }], ["Retry", function(dialog, remove){
                                        remove();
                                        setupButton.click();
                                    }]
                                ]);
                        }else{
                            // Success!
                            // Remember that this device is trusted
                            localStorage.setItem(`DEVICE_TRUSTED_${data.user.id}`, data.deviceID);
                            navigate("/", {replace: true});
                        }
                    });
               }} primary>Setup Auth</Button>
            </FlexContainer>
        </FlexContainer>
    </>);
}