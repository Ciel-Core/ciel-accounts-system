/**
 * 
 * Manage the content of the page "/new"
 * 
 **/

import { Title } from './../assets/components/Title.jsx';
import { Button, Mark, FlexContainer } from './../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';

export default function New(props){
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
    });
    return (<>
        <Title>Welcome</Title>
        <h1>Track your internets,<br/>with a <Mark>{import.meta.env.VITE_NAME} account</Mark>!</h1>
        <br/>
        <h3>
            Use one account for all supported websites and services and keep track of all your
            important activities in one place!
        </h3>
        <FlexContainer>
            <Button type={"link"} href={"/user/login"} primary>Sign In to your Account</Button>
            <br/>
            <Button type={"link"} href={"/user/register"}>Create a new account</Button>
        </FlexContainer>
    </>);
}