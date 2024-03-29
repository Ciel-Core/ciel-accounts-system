/**
 * 
 * The custom <UserMessage> element
 * 
 **/

import generalStyles from './../styles/general.module.css';

import Link from './Link.jsx';
import { processProps } from './_custom.jsx';

import FireIcon from './../icons/fire.svg';
import InfoIcon from './../icons/info.svg';
import ShieldIcon from './../icons/shield.svg';
import CloseIcon from './../icons/close.svg';
import { isOnline } from './../scripts/internetConnection.jsx';

function Icon(props){
    if(props.type == "message"){
        return <FireIcon class={props.class} />
    }else if(props.type == "warning" || props.type == "urgent"){
        return <InfoIcon class={props.class} />
    }else if(props.type == "security"){
        return <ShieldIcon class={props.class} />
    }
    return <></>;
}

export function UserMessage(props){
    let basicProps = processProps(props, generalStyles.mark, generalStyles.userMessage,
                                    generalStyles[props.type]);
    if(!["message", "warning", "urgent", "security"].includes(props.type)){
        throw new Error("Invalid <UserMessage> type!");
    }
    let message = (<div class={basicProps.class} style={basicProps.style}>
        <Icon class={generalStyles.icon} type={props.type} />
        <div class={generalStyles.content}>
            <text class={generalStyles.text}>{props.children} </text>
            <div class={generalStyles.links}>
                <For each={props.links}>{(link) => {
                    if(link != undefined){
                        return <Link href={link[1]} disable={!isOnline()}>{link[0]}</Link>
                    }
                }}</For>
            </div>
        </div>
        {
            (props.closeable) ?
                <CloseIcon class={generalStyles.closeIcon} onClick={() => {
                    message.remove();
                    if(typeof props.onClose == "function"){
                        props.onClose();
                    }
                }} disable={!isOnline()} />
            :
                undefined
        }
    </div>);
    return message;
}

export default UserMessage;