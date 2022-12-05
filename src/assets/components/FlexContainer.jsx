/**
 * 
 * The custom <FlexContainer> element
 * 
 **/

import generalStyles from './../styles/general.module.css';

import { processProps } from './_custom.jsx';

export function FlexContainer(props){
    let basicProps = processProps(props, generalStyles.flexContainer,
                                    (props.space == "around") ?
                                        generalStyles.spaceAround : undefined,
                                    (props.space == "between") ?
                                        generalStyles.spaceBetween : undefined,
                                    (props.horizontal) ? generalStyles.horizontal : undefined,
                                    (props["no-grow"]) ? generalStyles.noFlexGrow : undefined);
    return (
        <div ref={props.ref} class={basicProps.class} style={basicProps.style}
                tabindex={props.tabindex}>
            {props.children}
        </div>
    );
}
 
export default FlexContainer;