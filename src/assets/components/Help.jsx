/**
 * 
 * The custom <Help> element
 * 
 **/

import { createSignal } from "solid-js";

export const [helpFeed, setHelpFeed] = createSignal("");

export function Help(props){
    setTimeout(function(){
        if(props.feed){
            setHelpFeed(props.feed);
        }else{
            setHelpFeed("");
        }
    }, 1);
    return <></>;
}

export default Help;