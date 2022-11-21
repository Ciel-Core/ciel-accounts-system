/**
 * 
 * Manage the content of the main page
 * 
 **/

import style from './../../../assets/styles/pages/user.challenge.module.css';

import { Title } from './../../../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';
import { Mark } from './../../../assets/components/CustomElements.jsx';

export default function Home(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return <>
        <Title>Sign In</Title>
        <h2 class={style.userWelcome}>[Prompt Tittle]!</h2>
        <h4 class={style.userMessage}>[Prompt Descrip<Mark>tion</Mark>]</h4>
    </>;
}