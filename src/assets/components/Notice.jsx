/**
 * 
 * The custom <Notice> element (for text notes)
 * 
 **/

import generalStyles from './../styles/general.module.css';

import { processProps } from './_custom.jsx';

export function Notice(props){
    let basicProps = processProps(props, generalStyles.notice, (props.smaller) ? generalStyles.smallerNotice : undefined);
    return (
        <div ref={props.ref} class={basicProps.class} style={basicProps.style}>
            <text>{props.children}</text>
        </div>
   );
}
 
export default Notice;