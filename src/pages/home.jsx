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
import { FlexContainer, LoadingSpinner, Mark, NavBar, SearchBox } from './../assets/components/CustomElements.jsx';

import { useLocation } from '@solidjs/router';

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
    }else if(location == "/home/personal"){
        return lazy(() => {
            let r = import(`./home/personal.jsx`);
            done();
            return r;
        });
    }else if(location == "/home/privacy"){
        return lazy(() => {
            let r = import(`./home/privacy.jsx`);
            done();
            return r;
        });
    }else if(location == "/home/security"){
        return lazy(() => {
            let r = import(`./home/security.jsx`);
            done();
            return r;
        });
    }else if(location == "/home/sharing"){
        return lazy(() => {
            let r = import(`./home/sharing.jsx`);
            done();
            return r;
        });
    }else if(location == "/home/financial"){
        return lazy(() => {
            let r = import(`./home/financial.jsx`);
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
        <NavBar links={
            [
                ["Home", "/"],
                ["Personal info", "/home/personal"],
                ["Data and privacy", "/home/privacy"],
                ["Security", "/home/security"],
                ["People and sharing", "/home/sharing"],
                ["Payments and subscriptions", "/home/financial"]
            ]
        } />
        <FlexContainer ref={loading} style={{display: "none"}}>
            <LoadingSpinner />
        </FlexContainer>
        {content()}
    </>;
}