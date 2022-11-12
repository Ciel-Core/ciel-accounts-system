/**
 * 
 * The custom <Button> element
 * 
 **/

import generalStyles from './../styles/general.module.css';

import { Link } from "@solidjs/router";
import { processProps } from './_custom.jsx';
import { createEffect, createSignal } from 'solid-js';

// <Button type="link" href="/"></Button>
// <Button type="action" function={<function>}></Button>
// <Button ... primary></Button>
export function Button(props){
    let basicProps = processProps(props, generalStyles.button,
                                        (props.primary) ? generalStyles.primarybutton : undefined,
                                        (props.light) ? generalStyles.lightButton : undefined,
                                        (props.icon) ? generalStyles.iconButton : undefined,
                                        (props.small) ? generalStyles.smallButton : undefined),
        icon = (props.icon) ? (<div class={generalStyles.buttonIcon}>{props.icon}</div>) : "";
    const [content, setContent] = createSignal((props.icon) ? (<div class={generalStyles.iconButtonText}>{props.children}</div>) : props.children);
    createEffect(() => {
        setContent((props.icon) ? (<div class={generalStyles.iconButtonText}>{props.children}</div>) : props.children);
    });
    if(props.type == "link"){
        return (<Link ref={props.ref} href={props.href} class={basicProps.class} id={props.id} style={basicProps.style} disabled={props.disabled}>{icon}{content()}</Link>);
    }else if(props.type == "action"){
        if(typeof props.function != "function")
            throw new Error("Invalid <Button> action!");
        return (<button ref={props.ref} onClick={props.function} class={basicProps.class} id={props.id} style={basicProps.style} disabled={props.disabled}>{icon}{content()}</button>);
    }else if(props.type != undefined){
        throw new Error("Invalid <Button> type!");
    }else{
        // return "action-less" button
        // Replace this with an error later...
        console.warn("It's always better to attach an action to a button!");
        return (<button ref={props.ref} class={basicProps.class} id={props.id} style={basicProps.style} disabled={props.disabled}>{icon}{content()}</button>);
    }
}

export default Button;