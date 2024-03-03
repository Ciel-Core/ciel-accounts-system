/**
 * 
 * -
 * 
 **/

import style from './../../assets/styles/general.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';
import { userData } from './../../assets/scripts/user.jsx';
import { Mark } from './../../assets/components/CustomElements.jsx';
                {/* https://www.freeprivacypolicy.com/free-privacy-policy-generator/ */}

export default function HelpArticle(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return <>
        <Title>Terms and Conditions</Title>
        <h2 class={style.pageTitle}><Mark>Terms</Mark> and Conditions!</h2>
        <h4 class={style.pageDescription}>...</h4>
    </>;
}