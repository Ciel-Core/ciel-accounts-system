/**
 * 
 * The custom <Await?> elements
 * 
 **/

import generalStyles from './../styles/general.module.css';

import { createSignal, onMount } from 'solid-js';
import { LoadingSpinner } from './LoadingSpinner';
import { render } from 'solid-js/web';

export function LoadingContainer(){
    return (<div>
        <LoadingSpinner />
    </div>);
}

export function Await(props){
    const [content, setContent] = createSignal(<LoadingContainer />);
    let contentCleared = false,
        contentElm,
        awaitCall = props.call,
        inject = (elmCall) => {
            // Clear loading animation
            if(!contentCleared){
                setContent(undefined);
                contentCleared = true;
            }
            // Inject element
            render(elmCall, contentElm);
        };
    onMount(() => {
        contentElm = props.target() ?? contentElm;
        if(awaitCall instanceof Function){
            awaitCall(inject);
            awaitCall = undefined;
        }else{
            throw new Error("Invalid <Await> call!");
        }
    });
    if(props.target != undefined){
        return (<>
            {content()}
        </>);
    }else{
        return (<div ref={contentElm}>
            {content()}
        </div>);
    }
}

export default Await;