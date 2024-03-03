/**
 * 
 * Manage the content of the home page (personal section)
 * 
 **/

// import styles from './../assets/styles/pages/new.module.css';

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

export default function HomeSharing(props){
    onCleanup(() => {
        // 
    });
    onMount(() => {
        // 
    });
    return (<>
        <ImportantFeed />
    </>);
}