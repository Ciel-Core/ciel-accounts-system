/**
 * 
 * The custom <Select> element
 * 
 **/

import generalStyles from './../styles/general.module.css';

import { processProps } from './_custom.jsx';

import ArrowDownIcon from './../icons/arrow_down.svg';

export function Select(props){
    let basicProps = processProps(props, generalStyles.selectContainer),
        hint = (props.hint != undefined) ? (
                    <div class={`${generalStyles.selectHint} text`}>{props.hint}</div>
                ) : "",
        select = (<select id={props.id} placeholder={" "} onChange={props.onChange}
                            autocomplete={(props.autocomplete) ? props.autocomplete : "off"}
                            class={generalStyles.selectField} required>
                                <option value="" disabled selected></option>
                                {props.children}
                    </select>);
    if(props.selectedIndex){
        select.selectedIndex = props.selectedIndex;
    }
    if(typeof props.id != "string"){
        throw new Error("<Select> element must always have an ID!");
    }else if(typeof props.label != "string"){
        throw new Error("<Select> element must always have a label!");
    }
    return (
        <div ref={props.ref} class={basicProps.class} style={basicProps.style}>
            <div class={generalStyles.selectDataContainer}>
                {select}
                <ArrowDownIcon class={generalStyles.selectFieldArrow}/>
                <label class={generalStyles.selectLabel} for={props.id}>{props.label}</label>
            </div>
            {hint}
        </div>
    );
}

export default Select;