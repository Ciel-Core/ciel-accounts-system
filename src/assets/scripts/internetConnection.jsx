/**
 * 
 * Manage the connection-related functions
 * 
 **/

import style from './../styles/connection.module.css';
import SadIcon from './../icons/sad.svg';

import { render } from "solid-js/web";

function disableInteractions(){
    let globalBar = document.getElementById("global-bar"),
        localContent = document.getElementById("local-content").children[1],
        globalFooter = document.getElementById("global-footer");
    globalBar.setAttribute("disabled", "");
    globalBar.setAttribute("inert", "");
    localContent.setAttribute("disabled", "");
    localContent.setAttribute("inert", "");
    globalFooter.setAttribute("disabled", "");
    globalFooter.setAttribute("inert", "");
}
function enableInteractions(){
    let globalBar = document.getElementById("global-bar"),
        localContent = document.getElementById("local-content").children[1],
        globalFooter = document.getElementById("global-footer");
    globalBar.removeAttribute("disabled");
    globalBar.removeAttribute("inert");
    localContent.removeAttribute("disabled");
    localContent.removeAttribute("inert");
    globalFooter.removeAttribute("disabled");
    globalFooter.removeAttribute("inert");
}

let dialog;

function online(){
    enableInteractions();
    dialog.remove();
}
function offline(){
    disableInteractions();
    render(() => <div ref={dialog}>
        <div class={style.cover}></div>
        <div class={style.box}>
            <SadIcon class={style.icon}/>
            <text class={style.text}>You're offline!</text>
        </div>
    </div>, document.body);
}

export function checkConnection(){
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    if(!navigator.onLine){
        offline();
    }
}