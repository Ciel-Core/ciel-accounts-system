/**
 * 
 * The custom <Help> element
 * 
 **/

import { createSignal } from "solid-js";

export const [helpFeed, setHelpFeed] = createSignal("");
export const [needHelp, setNeedHelp] = createSignal(false);

export function Help(props){
    if(props.feed){
        setHelpFeed(props.feed);
        setNeedHelp(true);
    }else{
        setHelpFeed("");
        setNeedHelp(false);
    }
    return <></>;
}

export default Help;