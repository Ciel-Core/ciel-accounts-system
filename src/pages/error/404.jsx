/**
 * 
 * Manage the content of the 404 error page
 * 
 **/

import { Title } from './../../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';

export default function Error(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return <>
        <Title>Not Found</Title>
        Page Not Found!
    </>;
}