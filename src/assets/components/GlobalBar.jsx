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
            <div class={styles.navControl}>Back</div>
            <div style={{display: (isSignedIn()) ? "block" : "none"}}>Other</div>
        </div>
    );
}

function RightControls(props){
    return (
        <div class={styles.rightControls} style={{display: (isSignedIn()) ? "block" : "none"}}>
            <div class={styles.bellContainer} data-pin={false}>
                <BellIcon class={styles.bell}/>
                <BellPinIcon class={styles.bellPin}/>
            </div>
            <SignOutIcon onClick={signOut}/>
        </div>
    );
}

function GlobalBar(props){
    return (
        <div id="global-bar" class={styles.globalbar} data-show-content={props.showContent}>
            <LeftControls/>
            <UserProfile picture={props.userProfile} report={props.report}/>
            <RightControls/>
        </div>
    );
}

export default GlobalBar;
