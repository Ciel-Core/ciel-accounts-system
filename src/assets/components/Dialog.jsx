/**
 * 
 * The custom <Dialog> element
 * 
 **/

import { onMount } from 'solid-js';
import { render } from "solid-js/web";
import generalStyles from './../styles/general.module.css';
import { Button } from './Button.jsx';
import { For } from "solid-js/web";

export function setDialogState(dialog, show, remove = false){
    // Keep it as a function in case you need to do something additional later
    if(show){
        dialog.style.display = null;
        document.documentElement.style.overflow = "hidden";
        [
            document.getElementById("local-content").children[1],
            document.getElementById("global-bar"),
            document.getElementById("global-footer")
        ].forEach(elm => elm.setAttribute("inert", ""));
    }else{
        document.documentElement.style.overflow = null;
        [
            document.getElementById("local-content").children[1],
            document.getElementById("global-bar"),
            document.getElementById("global-footer")
        ].forEach(elm => elm.removeAttribute("inert"));
        if(remove){
            dialog.remove();
        }else{
            dialog.style.display = "none";
        }
    }
}

export function showDialog(title, description, actions = [["Ok",function(d,r){r()}]]){
    render(() => (<Dialog title={title} description={description} actions={actions} show></Dialog>), document.body);
}

export function Dialog(props){
    let dialog =  (<div ref={props.ref} class={generalStyles.dialogContainer}>
        <div class={generalStyles.dialogBox}>
            <div class={generalStyles.dialogText}>
                <text class={generalStyles.dialogTitle}>{props.title}</text>
                <text class={generalStyles.dialogDescription}>{props.description}</text>
            </div>
            <div class={generalStyles.dialogContent}>
                <For each={props.actions}>{(action) => {
                    return <Button type={"action"} function={function(){
                        action[1](dialog, function(){
                            setDialogState(dialog, false, true);
                        });
                    }} light small>{action[0]}</Button>
                }}</For>
            </div>
        </div>
    </div>);
    onMount(() => {
        setDialogState(dialog, props.show);
    });
    return dialog;
}

export default Dialog;