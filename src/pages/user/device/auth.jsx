/**
 * 
 * Manage the content of the device auth page
 * 
 **/

// import styles from './../assets/styles/pages/device.auth.module.css';

import { Title } from './../../../assets/components/Title.jsx';
import { Button, Mark, FlexContainer, Notice } from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { checkCreditential, checkPlatformSupport } from './../../../assets/scripts/deviceCredential.jsx';

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
        setTimeout(function(){
            checkCreditential("", undefined, function(error, assertion){
                //
            });
        }, 1000);
    });
    return (<>
        <Title>Device Auth</Title>
        <h1>Device <Mark>authentication</Mark>!</h1>
        <br/>
        <h3>Authenticate your session using your device!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <Notice style={{"text-align": "center"}}>You will be prompted with an authentication dialogue in a moment!</Notice>
        </FlexContainer>
    </>);
}