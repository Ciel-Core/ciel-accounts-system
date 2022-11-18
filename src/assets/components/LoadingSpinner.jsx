/**
 * 
 * The loading animation elements
 * 
 **/

import styles from './../styles/loading.module.css';

import { processProps } from './_custom.jsx';

export function LoadingSpinner(props){
    let basicProps = processProps(props, styles.spinner);
    return (
        <div style={basicProps.style} class={basicProps.class}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
 
export default LoadingSpinner;
 