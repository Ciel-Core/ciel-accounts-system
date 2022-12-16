/**
 * 
 * The global bar, and its relative elements
 * 
 **/

import styles from './../styles/globalBar.module.css';
 
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { isSignedIn, signOut, userData } from "./../scripts/user.jsx";
import LoadingSpinner from './LoadingSpinner.jsx';

import SignOutIcon from './../icons/sign_out.svg';
import BellIcon from './../icons/bell.svg';
import BellPinIcon from './../icons/bell_pin.svg';
import HelpIcon from './../icons/help.svg';
import BackArrowIcon from './../icons/arrow_back.svg';
import { render } from "solid-js/web";
import { useNavigate } from "@solidjs/router";
import { helpFeed, needHelp } from './Help.jsx';
import { isOnline } from './../scripts/internetConnection.jsx';
import { watchSticky } from './_custom.jsx';

// Keep track of the state of the user's data!
let userDataUpdated = false;
createEffect(() => {
    userData();
    isSignedIn();
    userDataUpdated = true;
});
function requestSharedData(callback){
    if(userDataUpdated){
        userDataUpdated = false;
        callback({
            userData: userData(),
            userState: isSignedIn()    
        });
    }else{
        setTimeout(() => requestSharedData(callback), 10);
    }
}

function showNavContent(navigate, pathname, container, spinner, mainTimeout, bar, external){
    if(!window.mobileView.matches){
        // Show dialog above global bar
        bar.dataset.prioritize = true;
        container.dataset.show = true;
        container.style.height = null;
        // Cancel loading process if user clicks anywhere again
        document.body.onclick = function(){
            document.body.onclick = undefined;
            clearTimeout(mainTimeout[0]);
            bar.dataset.prioritize = false;
            container.dataset.show = false;
        };
        clearTimeout(mainTimeout[0]);
        // Cooldown the loading process to prevent server-overload
        mainTimeout[0] = setTimeout(function(){
            document.body.onclick = undefined;
            // Render the iframe
            render(() =>{
                let iframe,
                    timeout;
                onMount(() => {
                    // Allow iframe to get user data
                    userDataUpdated = true;
                    // Focus iframe
                    iframe.contentWindow.focus();
                    iframe.contentWindow.childProcess = true;
                    iframe.contentWindow.restrictEventSource = true;
                    iframe.contentWindow.noDevToolsDetect = true;
                    iframe.contentWindow.requestSharedData = requestSharedData;
                    window.closeNavContent = function(){
                        bar.dataset.prioritize = false;
                        iframe.remove();
                        container.dataset.show = false;
                        spinner.style.display = null;
                        // Remove related functions!
                        window.sizeChange = undefined;
                        window.closeNavContent = undefined;
                        document.body.onfocus = undefined;
                        window.contentLoaded = undefined;
                    };
                    // Wait for the signal from the iframe
                    window.contentLoaded = function(){
                        spinner.style.display = "none";
                        iframe.dataset.loaded = true;
                        window.contentLoaded = undefined;
                    };
                    // Detect size updates
                    window.sizeChange = function(){
                        container.style.height =
                                iframe.contentWindow.document.documentElement.scrollHeight + "px";
                    };
                    // Remove iframe when the body is focused
                    document.body.onfocus = window.closeNavContent;
                    iframe.contentWindow.onblur = window.closeNavContent;
                });
                onCleanup(() => {
                    clearTimeout(timeout);
                });
                return (<iframe ref={iframe} src={`${pathname}/#in-frame`} title={"Help"}
                            data-loaded={false}></iframe>);
            }, container);
        }, 400);
    }else{
        if(external){
            window.open(pathname, '_blank').focus();
        }else{
            navigate(pathname);
        }
    }
}

function LeftControls(props){
    let navigate = useNavigate(),
        helpContainer,
        helpLoadingSpinner,
        helpTimeout = [undefined];
    return (
        <div class={styles.leftControls}>
            <div class={styles.navControl}>
                <BackArrowIcon onClick={() => history.back()} unselectable/>
            </div>
            <div class={styles.otherControl}
                    style={{display: (isSignedIn() || needHelp()) ? "inline-block" : "none"}}>
                <HelpIcon id="help-icon" onClick={function(){
                    showNavContent(navigate, `/help/feed/${helpFeed()}`, helpContainer,
                                        helpLoadingSpinner, helpTimeout, props.bar, true);
                }} unselectable disable={!isOnline()}/>
            </div>
            <div ref={helpContainer} class={styles.helpContainer} data-show={false}>
                <LoadingSpinner ref={helpLoadingSpinner} style={{margin: "60px"}} />
            </div>
        </div>
    );
}

function RightControls(props){
    let navigate = useNavigate(),
        alertsContainer,
        alertsLoadingSpinner,
        alertsTimeout = [undefined];
    return (
        <div class={styles.rightControls} data-signed-in={isSignedIn()}>
            <div id="alerts-icon" class={styles.bellContainer} data-pin={false} onClick={function(){
                    showNavContent(navigate, "/notifications", alertsContainer,
                                        alertsLoadingSpinner, alertsTimeout, props.bar, false);
                }} disable={!isOnline()}>
                <BellIcon class={styles.bell} unselectable/>
                <BellPinIcon class={styles.bellPin} unselectable/>
            </div>
            <div ref={alertsContainer} class={styles.alertsContainer} data-show={false}>
                <LoadingSpinner ref={alertsLoadingSpinner} style={{margin: "60px"}} />
            </div>
            <SignOutIcon onClick={signOut} unselectable disable={!isOnline()}/>
        </div>
    );
}

function UserProfile(props){
    const [showImage, setShowImage] = createSignal(false);
    return (
        <div class={styles.userprofile} unselectable>
            <LoadingSpinner style={{display: !showImage() ? null : 'none'}}/>
            <img alt={"Profile Icon"} draggable={false} class={styles.userProfileImage} width={70}
                    height={70} style={{display: showImage() ? null : 'none'}}
                    onLoad={function(e){ setShowImage(true); props.report(); }}
                    src={props.picture}/>
        </div>
    );
}

function GlobalBar(props){
    let globalBar;
    onMount(() => {
        watchSticky(globalBar);
    });
    return (
        <div id="global-bar" ref={globalBar} class={styles.globalbar}
            data-show-content={props.showContent}
            data-show-content-finished={props.showAnimationFinished}
            data-processing={false}>
            <LeftControls bar={globalBar}/>
            <UserProfile picture={props.userProfile} report={props.report}/>
            <RightControls bar={globalBar}/>
        </div>
    );
}

export default GlobalBar;
