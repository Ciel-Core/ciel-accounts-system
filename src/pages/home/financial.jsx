/**
 * 
 * Manage the content of the home page (personal section)
 * 
 **/

// import styles from './../assets/styles/pages/new.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { Button, Mark, FlexContainer } from './../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';

export default function HomeMain(props){
    onCleanup(() => {
        // 
    });
    onMount(() => {
        // 
    });
    return (<>
       <Title>Payments and subscriptions</Title>
        TEST 5
    </>);
}