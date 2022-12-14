/**
 * 
 * Manage the content of the home page
 * 
 **/

// import styles from './../assets/styles/pages/new.module.css';
import homeStyle from './../../assets/styles/pages/home.module.css';

import { Button, FlexContainer, UserMessage } from './../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { Alerts as PersonalAlerts, ImportantFeed as PersonalFeed } from './personal.jsx';
import { ImportantFeed as FinancialFeed } from './financial.jsx';
import { ImportantFeed as PrivacyFeed } from './privacy.jsx';
import { ImportantFeed as SecurityFeed } from './security.jsx';
import { ImportantFeed as SharingFeed } from './sharing.jsx';

export function Alerts(props){
    return (<>
        <PersonalAlerts/>
        <UserMessage type="warning">
            The accounts system is still incomplete. Your account/data could
            get deleted at any time!
        </UserMessage>
    </>);
}

export function PanelOption(props){
    return (<div class={homeStyle.panelOption}>
        <div class={homeStyle.optionTitle}>
            <text>{props.title}</text>
        </div>
        <div class={homeStyle.optionContent}>
            {props.children}
        </div>
    </div>);
}

export function PanelGroup(props){
    return (<div class={homeStyle.panelGroup}>
        {props.children}
    </div>);
}

function Feed(){
    return (<>
        <FinancialFeed />
        <PanelGroup>
            <PrivacyFeed />
            <SecurityFeed />
        </PanelGroup>
        <SharingFeed />
        <PersonalFeed />
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
        <Alerts />
        <Feed />
    </>);
}