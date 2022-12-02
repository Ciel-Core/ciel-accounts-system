/**
 * 
 * Manage the content of the home page
 * 
 **/

// import styles from './../assets/styles/pages/new.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { Help } from './../../assets/components/Help.jsx';
import { Button, FlexContainer, UserMessage } from './../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';

import { Alerts as PersonalAlerts } from './personal.jsx';

export function Alerts(props){
    return (<>
        <PersonalAlerts/>
        <UserMessage type="warning">
            The accounts system is still incomplete. Your account/data could
            get deleted at any time!
        </UserMessage>
    </>);
}

export default function HomeMain(props){
    onCleanup(() => {
        // 
    });
    onMount(() => {
        // 
    });
    return (<>
       <Title></Title>
        <Help feed={"control-panel"}/>
       <Alerts />
        TEST
    </>);
}