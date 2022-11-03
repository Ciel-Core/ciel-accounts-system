/**
 * 
 * Manage the content of the device auth setup page
 * 
 **/

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
        <h1><Mark>Trust</Mark> this device?</h1>
        <br/>
        <h3>You could use this device as a trusted device to authenticate your logins!</h3>
        <FlexContainer space={"around"} style={{width: "400px"}}>
            <Notice>You can only set up devices with passwords or other similar security measures as trusted devices!</Notice>
            <FlexContainer space={"between"} horozontal no-grow>
                <Button type={"link"} href={"/"}>Skip</Button>
                <Button type={"action"} function={function(){
                    alert(":(");
                }} primary>Setup Auth</Button>
            </FlexContainer>
        </FlexContainer>
    </>);
}