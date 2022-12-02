/**
 * 
 * Manage the content of the 404 error page
 * 
 **/

import errorStyle from './../../assets/styles/pages/error.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';
import { Button, Mark } from '../../assets/components/CustomElements.jsx';

export default function Error(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return <>
        <Title>Not Found</Title>
        <div class={errorStyle.container}>
            <h1 class={errorStyle.title}>Page <Mark>Not Found</Mark>!</h1>
            {
                (props.viewMode != "content-only") ? 
                    (<Button class={errorStyle.button} type={"link"} href={"/"} light>
                        Go Home
                    </Button>)
                :
                    undefined
            }
        </div>
    </>;
}