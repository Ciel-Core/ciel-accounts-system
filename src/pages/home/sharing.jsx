/**
 * 
 * Manage the content of the home page (personal section)
 * 
 **/

// import styles from './../assets/styles/pages/new.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { Button, Mark, FlexContainer } from './../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { PanelOption } from './main.jsx';

export function ImportantFeed(){
    return (<>
        <PanelOption title={"Sharing title!"}>
            Sharing content!
        </PanelOption>
    </>);
}

export default function HomeMain(props){
    onCleanup(() => {
        // 
    });
    onMount(() => {
        // 
    });
    return (<>
        <Title>People and Sharing</Title>
        <ImportantFeed />
    </>);
}