/**
 * 
 * Manage the content of the home page (personal section)
 * 
 **/

// import styles from './../assets/styles/pages/new.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { Button, FlexContainer, UserMessage } from './../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { userData } from './../../assets/scripts/user.jsx';

import { setAsCustomizedPOST } from './../../assets/scripts/communication/accounts';

export function Alerts(){
    return (<>
        {
           (!userData().system.customizationComplete) ?
                <UserMessage type={"message"} links={
                    [
                        ["Customise account", "/user/customization"]
                    ]
                    } closeable onClose={function(){
                        setAsCustomizedPOST(function(e){ });
                    }}
                >Want this account to feel more personal?</UserMessage>
            :
                undefined
        }

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
       <Title>Personal</Title>
       <Alerts />
        TEST 1
    </>);
}