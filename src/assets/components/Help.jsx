/**
 * 
 * The custom <Help> element
 * 
 **/

import { createSignal } from "solid-js";

export const [helpFeed, setHelpFeed] = createSignal("");
export const [needHelp, setNeedHelp] = createSignal(false);
export let blockReset = false;

export function Help(props){
    setTimeout(() => {
        if(props.feed){
            blockReset = location.pathname.replace(/[#?].*$/g, "");
            setHelpFeed(props.feed);
            setNeedHelp(true);
        }else{
            blockReset = undefined;
            setHelpFeed("");
            setNeedHelp(false);
        }
    }, 1);
    return <></>;
}

export default Help;