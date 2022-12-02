/**
 * 
 * Manage the connection-related functions
 * 
 **/

import style from './../styles/connection.module.css';
import SadIcon from './../icons/sad.svg';

import { render } from "solid-js/web";
import { createSignal, onMount } from 'solid-js';

export const [isOnline, setOnlineStatus] = createSignal(navigator.onLine);

let onlineCallbackList = [];
export function awaitConnection(callback){
    onlineCallbackList.push(callback);
}

function disableInteractions(){
    //
}
function enableInteractions(){
    //
}

let dialog;

function online(){
    setOnlineStatus(true);
    enableInteractions();
    dialog.remove();
    window._theme.updateColorGroup();
    while(onlineCallbackList.length != 0){
        (onlineCallbackList.pop())();
    }
}
function offline(){
    setOnlineStatus(false);
    disableInteractions();
    render(() => {
        onMount(() => {
            window._theme.updateColorGroup(window.getComputedStyle(dialog , null).getPropertyValue("background-color"));
        });
        return <>
            <div ref={dialog} class={style.box} unselectable>
                <SadIcon class={style.icon}/>
                <text class={style.text}>You're offline!</text>
            </div>
        </>
        }, document.getElementById("body-top"));
}

export function checkConnection(){
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    if(!navigator.onLine){
        offline();
    }
}