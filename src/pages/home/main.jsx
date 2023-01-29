/**
 * 
 * Manage the content of the home page
 * 
 **/

// import styles from './../assets/styles/pages/new.module.css';
import homeStyle from './../../assets/styles/pages/home.module.css';

import { Button, FlexContainer, UserMessage } from './../../assets/components/CustomElements.jsx';
import { children, onCleanup, onMount } from 'solid-js';
import { Alerts as PersonalAlerts, ImportantFeed as PersonalFeed } from './personal.jsx';
import { ImportantFeed as FinancialFeed } from './financial.jsx';
import { ImportantFeed as PrivacyFeed } from './privacy.jsx';
import { ImportantFeed as SecurityFeed } from './security.jsx';
import { ImportantFeed as SharingFeed } from './sharing.jsx';
import { render } from 'solid-js/web';

import ArrowIcon from './../../assets/icons/arrow_forward.svg';

export function Alerts(props){
    return (<>
        <PersonalAlerts/>
        <UserMessage type="warning">
            The accounts system is still incomplete. Your account/data could
            get deleted at any time!
        </UserMessage>
    </>);
}

export function PanelOption(props){
    return (<div class={homeStyle.panelOption}>
        <div class={homeStyle.optionTitle}>
            <text>{props.title}</text>
        </div>
        <div class={homeStyle.optionContent}>
            {props.children}
        </div>
        {(() => {
            if(props.navigate instanceof Array){
                return (
                    <Button class={homeStyle.optionAction} type={"link"} href={props.navigate[1]}
                            light>
                        {props.navigate[0]}
                    </Button>
                );
            }
        })()}
    </div>);
}

export function PanelGroup(props){
    return (<div class={homeStyle.panelGroup}>
        {props.children}
    </div>);
}

export function OptionsGroup(props){
    const childrenList = children(() => props.children);
    if(props.children != undefined){
        for(let i = 0; i < childrenList().length; i++){
            // Add the shared attachment
            if(props.attachments instanceof Array){
                for(let c = 0; c < props.attachments.length; c++){
                    render(props.attachments[c], childrenList()[i]);
                }
            }
        }
    }
    return (<FlexContainer ref={props.ref} class={homeStyle.optionsGroup}>
        {childrenList()}
    </FlexContainer>);
}

export function Option(props){
    return (<div class={homeStyle.option} icon={(!!props.icon || props.action instanceof Function)}
                disable={props.disabled} onClick={props.action}>
        <text class={homeStyle.title}>{props.title}</text>
        <text class={homeStyle.description}>{props.description}</text>
        {props.children}
        {(() => {
            //
            if(props.icon == "arrow" || props.action instanceof Function){
                return (<ArrowIcon />);
            }else{
                return props.icon;
            }
        })}
    </div>);
}

export function RichOption(props){
    return (<Option {...props}/>);
}

function Feed(){
    return (<>
        <FinancialFeed />
        <PanelGroup>
            <PrivacyFeed />
            <SecurityFeed />
        </PanelGroup>
        <SharingFeed />
        <PersonalFeed />
    </>);
}

export default function HomeMain(props){
    onCleanup(() => {
        // 
    });
    onMount(() => {
        // 
    });
    return (<>
        <Alerts />
        <Feed />
    </>);
}