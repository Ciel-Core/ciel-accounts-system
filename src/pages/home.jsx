/**
 * 
 * Manage the content of the main page
 * 
 **/

import style from './../assets/styles/pages/home.module.css';

import { Title } from './../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';
import { userData } from './../assets/scripts/user.jsx';
import { Mark } from './../assets/components/CustomElements.jsx';

export default function Home(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return <>
        <Title></Title>
        <h2 class={style.userWelcome}>Welcome, <Mark>{userData().displayUsername}</Mark>!</h2>
        <h4 class={style.userMessage}>Manage your profile, privacy preferences, and security across all connected services.</h4>
    </>;
}