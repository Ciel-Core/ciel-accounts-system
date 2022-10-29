/**
 * 
 * The custom <Mark> element (for words highlighted with the accent colour)
 * 
 **/

import generalStyles from './../styles/general.module.css';
 
import { processProps } from './_custom.jsx';

export function Mark(props){
    let basicProps = processProps(props, generalStyles.mark);
    return (<div ref={props.ref} class={basicProps.class} style={basicProps.style}>{props.children}</div>);
}
  
export default Mark;