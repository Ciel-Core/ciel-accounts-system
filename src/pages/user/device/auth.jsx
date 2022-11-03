/**
 * 
 * Manage the content of the device auth page
 * 
 **/

// import styles from './../assets/styles/pages/device.auth.module.css';

import { Title } from './../../../assets/components/Title.jsx';
import { Button, Mark, FlexContainer, Notice } from './../../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';

export default function New(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
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