/**
 * 
 * The custom <CheckBox> element
 * 
 **/

import { onMount } from 'solid-js';
import generalStyles from './../styles/general.module.css';

import { processProps } from './_custom.jsx';
 
export function CheckBox(props){
    let basicProps = processProps(props, generalStyles.checkBoxContainer);
    let checkbox;
    if(typeof props.id != "string"){
        throw new Error("<CheckBox> must always have an ID!");
    }else if(typeof props.onInactive != "function" || typeof props.onActive != "function"){
        throw new Error("<CheckBox> must have 'active' and 'inactive' functions!");
    }
    let rtr = (<div ref={props.ref} class={basicProps.class} style={basicProps.style}>
        <input ref={checkbox} type="checkbox" id={props.id} class={generalStyles.checkBox} checked={props.checked} />
        <label for={props.id}>{props.label}</label>
    </div>);
    onMount(() => {
        // Check if the checkbox is checked
        if(checkbox.checked){
            props.onActive();
        }else{
            props.onInactive();
        }
    });
    checkbox.addEventListener("change", function(){
        (checkbox.checked) ? props.onActive() : props.onInactive();
    });
    return rtr;
}
   
export default CheckBox;