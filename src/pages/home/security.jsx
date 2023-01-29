/**
 * 
 * Manage the content of the home page (personal section)
 * 
 **/

// import styles from './../assets/styles/pages/new.module.css';

import { Button, Mark, FlexContainer, showDialog, Await } from './../../assets/components/CustomElements.jsx';
import { onCleanup, onMount } from 'solid-js';
import { Option, RichOption, OptionsGroup, PanelGroup, PanelOption } from './main.jsx';
import { getSessionsPOST, removeSessionPOST } from './../../assets/scripts/communication/settings.jsx';
import { useNavigate } from '@solidjs/router';
import { loadPlatformJS } from '../../assets/scripts/loader.jsx';
import { render } from 'solid-js/web';

export function ImportantFeed(){
    return (<>
        <PanelOption title={"Security title!"}>
            Security content!
        </PanelOption>
    </>);
}

export default function HomeMain(props){
    let navigate = useNavigate(),
        activeSessionsList;
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
                <OptionsGroup ref={activeSessionsList} attachments={[]}>
            	    <Await target={() => activeSessionsList} call={function(inject){
                        loadPlatformJS(function(){
                            getSessionsPOST(false, function(success, data){
                                if(success){
                                    for(let i = 0; i < data.sessions.length; i++){
                                        // Ready session info
                                        let info = platform.parse(data.sessions[i].userAgent);
                                        // Render session items
                                        inject(() =>
                                            (<RichOption
                                                title=
                                                {`${info.name ?? "?"} on ${info.os.family ?? "?"}`}
                                                description={
                                                    (data.sessions[i].localID == data.localID) ?
                                                                    "This device!" :
                                                                    undefined} />)
                                                                    );
                                    }
                                }else{
                                    showDialog("Something went wrong!", "Couldn't fetch a list of active sessions!");
                                }
                            });    
                        });                
                    }} />
                </OptionsGroup>
            </PanelOption>
        </PanelGroup>
    </>);
}