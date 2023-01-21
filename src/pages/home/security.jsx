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
import { useNavigate } from '@solidjs/router';

export function ImportantFeed(){
    return (<>
        <PanelOption title={"Security title!"}>
            Security content!
        </PanelOption>
    </>);
}

export default function HomeMain(props){
    let navigate = useNavigate();
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
                <Option title={"Password"} description={"Last changed XX days ago"}
                        action={() => navigate("/security/password")} />
                <Option title={"2-Step Verification"} description={"Off"}
                        action={() => navigate("/security/challenge")}/>
                <Option title={"Emergency keys"} description={"None"} />
            </OptionsGroup>
        </PanelOption>
        <PanelGroup>
            <PanelOption title={"Trusted devices"} navigate={["Manage all devices",
                                                            "/security/devices"]}>
                ?
            </PanelOption>
            <PanelOption title={"Active sessions"} navigate={["Manage all sessions",
                                                            "/security/sessions"]}>
                <OptionsGroup attachments={[]}>
                    <Option title={"[title_1]"} />
                    <Option title={"[title_2]"} />
                    <Option title={"[title_3]"} />
                </OptionsGroup>
            </PanelOption>
        </PanelGroup>
    </>);
}