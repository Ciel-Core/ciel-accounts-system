/**
 * 
 * Manage the content of the main page
 * 
 **/

import { Title } from './../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';

export default function Home(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return <>
        <Title>Home</Title>
        "/"!
    </>;
}