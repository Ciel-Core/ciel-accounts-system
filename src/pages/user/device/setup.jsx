/**
 * 
 * Manage the content of the device auth setup page
 * 
 **/

import { Title } from './../../../assets/components/Title.jsx';
import { Button, Mark, FlexContainer, Notice, showDialog } from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { createPublicKey } from './../../../assets/scripts/deviceCredential.jsx';

export default function New(props){
    let setupButton,
        localContent = document.getElementById("local-content");
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
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
                    createPublicKey("KEY_" + Math.round(Math.random()*100000000), props.userData, "USER_ID", function(error, credential){
                        localContent.dataset.processing = false;
                        setupButton.removeAttribute("disabled");
                        if(error){
                            showDialog("Something went wrong!", "We couldn't get a valid response from your device!");
                        }else{
                            alert(credential);
                        }
                    });
                }} primary>Setup Auth</Button>
            </FlexContainer>
        </FlexContainer>
    </>);
}