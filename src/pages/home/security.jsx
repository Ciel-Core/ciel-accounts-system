/**
 * 
 * Manage the content of the home page (personal section)
 * 
 **/

// import styles from './../assets/styles/pages/new.module.css';

import { Button, Mark, FlexContainer } from './../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { Option, OptionsGroup, PanelGroup, PanelOption } from './main.jsx';
import { removeSessionPOST } from './../../assets/scripts/communication/settings.jsx';

export function ImportantFeed(){
    return (<>
        <PanelOption title={"Security title!"}>
            Security content!
        </PanelOption>
    </>);
}

export default function HomeMain(props){
    onCleanup(() => {
        // 
    });
    onMount(() => {
        // 
    });
    // removeSessionPOST;
    return (<>
        <ImportantFeed />
        <PanelOption title={"Account access"}>
            <OptionsGroup>
                <Option title={"Password"} description={"Last changed XX days ago"} />
                <Option title={"2-Step Verification"} description={"Off"} />
                <Option title={"Emergency keys"} description={"0 active keys"} />
            </OptionsGroup>
        </PanelOption>
        <PanelGroup>
            <PanelOption title={"Trusted devices"}>
                ?
            </PanelOption>
            <PanelOption title={"Active sessions"}>
                <OptionsGroup attachments={[(props) => (<div>Test</div>)]}>
                    <Option title={"[title_1]"} description={"[description]"} />
                    <Option title={"[title_2]"} description={"[description]"} />
                    <Option title={"[title_3]"} description={"[description]"} />
                </OptionsGroup>
            </PanelOption>
        </PanelGroup>
    </>);
}