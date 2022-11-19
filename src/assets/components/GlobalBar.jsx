/**
 * 
 * The global bar, and its relative elements
 * 
 **/

import { createSignal, onCleanup, onMount } from "solid-js";
import { isSignedIn, signOut } from "./../scripts/user.jsx";
import styles from './../styles/globalBar.module.css';
import LoadingSpinner from './LoadingSpinner.jsx';

import SignOutIcon from './../icons/sign_out.svg';
import BellIcon from './../icons/bell.svg';
import BellPinIcon from './../icons/bell_pin.svg';
import HelpIcon from './../icons/help.svg';
import BackArrowIcon from './../icons/arrow_back.svg';
import { render } from "solid-js/web";
import { useNavigate } from "@solidjs/router";

function UserProfile(props){
    const [showImage, setShowImage] = createSignal(false);
    return (
        <div class={styles.userprofile} unselectable>
            <LoadingSpinner style={{display: !showImage() ? null : 'none'}}/>
            <img alt={"Profile Icon"} draggable={false} class={styles.userProfileImage} width={70} height={70} style={{display: showImage() ? null : 'none'}} onLoad={function(e){ setShowImage(true); props.report(); }} src={props.picture}/>
        </div>
    );
}

function showNavContent(navigate, pathname, container, spinner, mainTimeout, bar){
    if(!window.mobileView.matches){
        bar.dataset.prioritize = true;
        container.dataset.show = true;
        clearTimeout(mainTimeout[0]);
        mainTimeout[0] = setTimeout(function(){
            render(() =>{
                let iframe,
                    timeout;
                onMount(() => {
                    iframe.contentWindow.focus();
                    window.contentLoaded = function(){
                        spinner.style.display = "none";
                        iframe.dataset.loaded = true;
                        window.contentLoaded = undefined;
                    };
                    document.body.onfocus = () => {
                        bar.dataset.prioritize = false;
                        iframe.remove();
                        container.dataset.show = false;
                        spinner.style.display = null;
                    };
                });
                onCleanup(() => {
                    clearTimeout(timeout);
                });
                return (<iframe ref={iframe} src={`${pathname}/#in-frame`} title={"Help"} data-loaded={false}></iframe>);
            }, container);
        }, 400);
    }else{
        navigate(pathname);
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
            <div class={styles.otherControl} style={{display: (isSignedIn()) ? "inline-block" : "none"}}>
                <HelpIcon id="help-icon" onClick={function(){
                    showNavContent(navigate, "/help", helpContainer, helpLoadingSpinner, helpTimeout, props.bar);
                }} unselectable/>
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
                    showNavContent(navigate, "/notifications", alertsContainer, alertsLoadingSpinner, alertsTimeout, props.bar);
                }}>
                <BellIcon class={styles.bell} unselectable/>
                <BellPinIcon class={styles.bellPin} unselectable/>
            </div>
            <div ref={alertsContainer} class={styles.alertsContainer} data-show={false}>
                <LoadingSpinner ref={alertsLoadingSpinner} style={{margin: "60px"}} />
            </div>
            <SignOutIcon onClick={signOut} unselectable/>
        </div>
    );
}

function GlobalBar(props){
    let globalBar;
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
