/**
 * 
 * The custom <Radio> element
 * 
 **/

import generalStyles from './../styles/general.module.css';

import { processProps } from './_custom.jsx';

export function onRadioGroupChange(name, callback){
    let radioGroup = document.getElementsByName(name);
    if(radioGroup.length < 2) {
        throw new Error("Insufficient radio group!");
    }
    radioGroup.forEach(function(elm){
        elm.addEventListener("change", callback);
    });
}

export function getRadioValueByNameGroup(name){
    try {
        return document.querySelector(`input[type="radio"][name="${name}"]:checked`).value;
    }catch{
        return undefined;
    }
}

export function Radio(props){
    let basicProps = processProps(props, generalStyles.radio);
    if(typeof props.id != "string"){
        throw new Error("<Radio> must always have an ID!");
    }
    if(typeof props.name != "string"){
        throw new Error("<Radio> must always have a name attribute!");
    }
    return (<div ref={props.ref} class={generalStyles.radioContainer}>
        <input type="radio" id={props.id} class={basicProps.class} name={props.name} value={props.value} style={basicProps.style} checked={props.checked} />
        <label class={generalStyles.radioLabel} for={props.id}>{props.children}</label>
    </div>);
}
   
export default Radio;