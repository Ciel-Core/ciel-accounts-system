/**
 * 
 * Manage the content of the main page
 * 
 **/

import style from './../assets/styles/general.module.css';
import homeStyle from './../assets/styles/pages/home.module.css';

import { Title } from './../assets/components/Title.jsx';
import { Help } from './../assets/components/Help.jsx';
import { For, onCleanup, onMount } from 'solid-js';
import { userData } from './../assets/scripts/user.jsx';
import { FlexContainer, Link, Mark, SearchBox, UserMessage } from './../assets/components/CustomElements.jsx';

import { setAsCustomizedPOST } from '../assets/scripts/communication/accounts';


export function Messages(props){
    return (<>
        {   (!userData().system.customizationComplete) ?
                <UserMessage type={"message"} links={
                    [
                        ["Customise account", "/user/customization"]
                    ]
                    } closeable onClose={function(){
                        setAsCustomizedPOST(function(e){ });
                    }}
                >Want this account to feel more personal?</UserMessage>
            :
                undefined
        }
        <UserMessage type="warning">The accounts system is still incomplete. Your account/data could get deleted at any time!</UserMessage>
    </>);
}

export default function Home(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return <>
        <Title></Title>
        <Help feed={"control-panel"}/>
        <h2 class={style.pageTitle}>Welcome, <Mark>{userData().displayUsername}</Mark>!</h2>
        <h4 class={style.pageDescription}>Manage your profile, privacy preferences, and security across all connected services and devices.</h4>
        <SearchBox/>
        <Messages />
    </>;
}