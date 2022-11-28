/**
 * 
 * Manage the content of the main page
 * 
 **/

import style from './../assets/styles/general.module.css';
import homeStyle from './../assets/styles/pages/home.module.css';

import { Title } from './../assets/components/Title.jsx';
import { Help } from './../assets/components/Help.jsx';
import { createEffect, createSignal, For, lazy, onCleanup, onMount } from 'solid-js';
import { userData } from './../assets/scripts/user.jsx';
import { FlexContainer, Link, LoadingSpinner, Mark, NavBar, SearchBox, UserMessage } from './../assets/components/CustomElements.jsx';

import { setAsCustomizedPOST } from '../assets/scripts/communication/accounts';
import { useLocation } from '@solidjs/router';


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

function panelContent(location, loaded, loading, setContent){
    let done = () => {
        loading.style.display = "none";
        loaded();
    };
    setContent(undefined);
    loading.style.display = null;
    if(location == "/"){
        return lazy(() => {
            let r = import(`./home/main.jsx`);
            done();
            return r;
        });
    }else{
        done();
        return <div>Something went wrong!</div>;
    }
}

export default function Home(props){
    let location = useLocation(),
        loading;
    const [content, setContent] = createSignal(undefined);
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        createEffect(() => {
            setContent(panelContent(location.pathname.replace(/[#?].*$/g, ""), props.pageLoaded, loading, setContent));
        });
    });
    return <>
        <Title></Title>
        <Help feed={"control-panel"}/>
        <h2 class={style.pageTitle}>Welcome, <Mark>{userData().displayUsername}</Mark>!</h2>
        <h4 class={style.pageDescription}>Manage your profile, privacy preferences, and security across all connected services and devices.</h4>
        <SearchBox/>
        <NavBar />
        <Messages />
        <FlexContainer ref={loading} style={{display: "none"}}>
            <LoadingSpinner />
        </FlexContainer>
        {content()}
    </>;
}