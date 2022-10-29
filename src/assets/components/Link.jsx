/**
 * 
 * The custom <Link> element
 * 
 **/

import generalStyles from './../styles/general.module.css';
import { Link as RouterLink } from "@solidjs/router";
import { processProps } from './_custom.jsx';

export function Link(props){
    let basicProps = processProps(props, generalStyles.link)
    return (<RouterLink ref={props.ref} href={props.href} class={basicProps.class} style={basicProps.style}>{props.children}</RouterLink>);
}

export default Link;