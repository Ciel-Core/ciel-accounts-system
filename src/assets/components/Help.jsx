/**
 * 
 * The custom <Help> element
 * 
 **/

import { createSignal } from "solid-js";

export const [helpFeed, setHelpFeed] = createSignal("");
export const [needHelp, setNeedHelp] = createSignal(false);
export let blockReset = false;

export function setHelp(feed){
    setTimeout(() => {
        if(feed){
            blockReset = location.pathname.replace(/[#?].*$/g, "");
            setHelpFeed(feed);
            setNeedHelp(true);
        }else{
            blockReset = undefined;
            setHelpFeed("");
            setNeedHelp(false);
        }
    }, 1);
}

export function Help(props){
    setHelp(props.feed);
    return <></>;
}

export default Help;