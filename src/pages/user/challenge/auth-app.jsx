/**
 * 
 * Manage the content of the main page
 * 
 **/

import style from './../../../assets/styles/pages/user.challenge.module.css';

import { Title } from './../../../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';
import { Mark } from './../../../assets/components/CustomElements.jsx';
import { checkFactorState } from './../challenge.jsx';
import { useNavigate } from '@solidjs/router';

export default function Home(props){
    let navigate = useNavigate();
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        checkFactorState(props.pageLoaded, navigate);
    });
    return <>
        <Title>Sign In</Title>
        <h2 class={style.userWelcome}>[Auth App Tittle]!</h2>
        <h4 class={style.userMessage}>[Auth App Descrip<Mark>tion</Mark>]</h4>
    </>;
}