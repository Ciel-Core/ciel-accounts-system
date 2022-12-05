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
import { isDevMode } from './../scripts/console.jsx';

export function setDialogState(dialog, show, remove = false){
    // Keep it as a function in case you need to do something additional later
    if(show){
        dialog.style.display = null;
        [
            document.getElementById("local-content").children[1],
            document.getElementById("global-bar"),
            document.getElementById("global-footer")
        ].forEach(elm => elm.setAttribute("inert", ""));
    }else{
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

export function showDialog(title, description, actions = [["Ok",function(d,r){r()}]], devAttachment = undefined){
    render(() => (<Dialog title={title} description={description} attachment={devAttachment} actions={actions} show></Dialog>)
            , document.body);
}

export function Dialog(props){
    let dialog = (<div ref={props.ref} class={generalStyles.dialogTrap}>
        <div class={generalStyles.dialogContainer}>
            <div class={generalStyles.dialogBox}>
                <div class={generalStyles.dialogText}>
                    <text class={generalStyles.dialogTitle}>{props.title}</text>
                    <text class={generalStyles.dialogDescription}>{props.description}{
                        (isDevMode &&
                        typeof props.attachment == "string" &&
                        props.attachment.replace(/\s/g, "") != "") ?
                            ` (${props.attachment})` :
                            ""
                    }</text>
                </div>
                <div class={generalStyles.dialogContent}>
                    <For each={props.actions}>{(action) => {
                        if(action != undefined){
                            return <Button type={"action"} function={function(){
                                action[1](dialog, function(){
                                    setDialogState(dialog, false, true);
                                });
                            }} light small>{action[0]}</Button>
                        }
                    }}</For>
                </div>
            </div>
        </div>
    </div>);
    onMount(() => {
        dialog.onscroll = () => dialog.scrollTo({top: 0, behavior: 'auto'});
        dialog.addEventListener('wheel', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, {
            passive: false
        });
        setDialogState(dialog, props.show);
    });
    return dialog;
}

export default Dialog;