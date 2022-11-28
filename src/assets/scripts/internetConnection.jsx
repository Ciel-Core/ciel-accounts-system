/**
 * 
 * Manage the connection-related functions
 * 
 **/

import style from './../styles/connection.module.css';
import SadIcon from './../icons/sad.svg';

import { render } from "solid-js/web";
import { createSignal } from 'solid-js';

export const [isOnline, setOnlineStatus] = createSignal(true);

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
    while(onlineCallbackList.length != 0){
        (onlineCallbackList.pop())();
    }
}
function offline(){
    setOnlineStatus(false);
    disableInteractions();
    render(() => <>
        <div ref={dialog} class={style.box}>
            <SadIcon class={style.icon}/>
            <text class={style.text}>You're offline!</text>
        </div>
    </>, document.getElementById("body-top"));
}

export function checkConnection(){
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    if(!navigator.onLine){
        offline();
    }
}