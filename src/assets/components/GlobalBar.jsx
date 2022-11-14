/**
 * 
 * The global bar, and its relative elements
 * 
 **/

import { createSignal } from "solid-js";
import { isSignedIn, signOut } from "./../scripts/user.jsx";
import styles from './../styles/globalBar.module.css';
import LoadingSpinner from './LoadingSpinner.jsx';

import SignOutIcon from './../icons/sign_out.svg';
import BellIcon from './../icons/bell.svg';
import BellPinIcon from './../icons/bell_pin.svg';
import HelpIcon from './../icons/help.svg';
import BackArrowIcon from './../icons/arrow_back.svg';

function UserProfile(props){
    const [showImage, setShowImage] = createSignal(false);
    return (
        <div class={styles.userprofile} unselectable>
            <LoadingSpinner style={{display: !showImage() ? null : 'none'}}/>
            <img alt={"Profile Icon"} draggable={false} class={styles.userProfileImage} width={70} height={70} style={{display: showImage() ? null : 'none'}} onLoad={function(e){ setShowImage(true); props.report(); }} src={props.picture}/>
        </div>
    );
}

function LeftControls(props){
    return (
        <div class={styles.leftControls}>
            <div class={styles.navControl}>
                <BackArrowIcon onClick={() => history.back()} unselectable/>
            </div>
            <div class={styles.otherControl} style={{display: (isSignedIn()) ? "inline-block" : "none"}}>
                <HelpIcon  onClick={() => alert(":|")} unselectable/>
            </div>
        </div>
    );
}

function RightControls(props){
    return (
        <div class={styles.rightControls} data-signed-in={isSignedIn()}>
            <div class={styles.bellContainer} data-pin={false} onClick={() => alert(":|")}>
                <BellIcon class={styles.bell} unselectable/>
                <BellPinIcon class={styles.bellPin} unselectable/>
            </div>
            <SignOutIcon onClick={signOut} unselectable/>
        </div>
    );
}

function GlobalBar(props){
    return (
        <div id="global-bar" class={styles.globalbar} data-show-content={props.showContent} data-show-content-finished={props.showAnimationFinished}
            data-processing={false}>
            <LeftControls/>
            <UserProfile picture={props.userProfile} report={props.report}/>
            <RightControls/>
        </div>
    );
}

export default GlobalBar;
