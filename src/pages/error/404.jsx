/**
 * 
 * Manage the content of the 404 error page
 * 
 **/

import errorStyle from './../../assets/styles/pages/error.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { onCleanup, onMount } from 'solid-js';
import { Button, Mark } from '../../assets/components/CustomElements.jsx';
import { useNavigate } from '@solidjs/router';

export default function Error(props){
    let navigate = useNavigate(),
        button;
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
                    (<Button ref={button} class={errorStyle.button} type={"action"} function={() => {
                        // Note to self: make a custom "back" function based on this code for use
                        // across all pages!
                        button.setAttribute("disabled", "");
                        history.back();
                        let timeout = setTimeout(() => {
                            if(window.opener != null || window.history.length == 1){
                                window.close();
                            }else{
                                navigate("/");
                            }
                        }, 500);
                        window.addEventListener('popstate', () => clearTimeout(timeout));
                    }} light>
                        Go Back
                    </Button>)
                :
                    undefined
            }
        </div>
    </>;
}