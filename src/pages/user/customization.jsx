/**
 * 
 * Manage the content of the first login page
 * 
 **/

// import style from './../../assets/styles/pages/user.customization.module.css';

import { Title } from './../../assets/components/Title.jsx';
import { Help } from './../../assets/components/Help.jsx';
import {
    Mark, Button, FlexContainer, showDialog
} from './../../assets/components/CustomElements.jsx';
import {
    onCleanup,
    onMount
} from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { setAsCustomizedPOST } from './../../assets/scripts/communication/accounts.jsx';

export default function Customization(props){
    let navigate = useNavigate(),
        skipButton;
    onCleanup(() => {
        props.pageUnloading();
    });
    onMount(() => {
        props.pageLoaded();
        let localContent = document.getElementById("local-content");
        localContent.dataset.processing = true;
        setAsCustomizedPOST(function(success, data){
            localContent.dataset.processing = false;
            if(!success){
                showDialog("Something went wrong!",
                            "We couldn't connect to the server to update your status!",
                            [
                                ["Ok", function(dialog, remove){
                                    remove();
                                }],
                                ["Retry", function(dialog, remove){
                                    location.reload();
                                    remove();
                                }]
                            ]);
            }
        });
    });
    return <>
        <Title>Set up</Title>
        <Help feed={"customization"}/>
        <h1>Personalise your account!</h1>
        <br/>
        <h3>
            Make this account feel more personal by <Mark>customising</Mark> it to fit you
            and your needs!
        </h3>
        <FlexContainer>
            <Button type={"action"} function={function(){}} primary disabled>Start!</Button>
            <br/>
            <Button ref={skipButton} type={"link"} href={"/"} light>No thanks</Button>
        </FlexContainer>
    </>;
}