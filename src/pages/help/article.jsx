/**
 * 
 * Manage the content of the help article page
 * 
 **/

import style from './../../assets/styles/general.module.css';
import helpStyle from './../../assets/styles/pages/help.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';
import { userData } from './../../assets/scripts/user.jsx';
import { Mark } from './../../assets/components/CustomElements.jsx';

export default function HelpArticle(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return <>
        <Title>Help</Title>
        <h2 class={style.pageTitle}><Mark>Help</Mark> center!</h2>
        <h4 class={style.pageDescription}>Need help? No problem!</h4>
    </>;
}