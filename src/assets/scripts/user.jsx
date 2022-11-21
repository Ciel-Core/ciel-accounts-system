/**
 * 
 * Manage the user's data and state
 * 
 **/

import { createSignal } from "solid-js";
import { showDialog } from "./../components/Dialog.jsx";
import { signOutPOST, userDataPOST } from "./communication/accounts.jsx";
import { afterURLChange } from "./traffic.jsx";
import { openSocket } from "./communication/sockets.jsx";

// user data module (default data)
function defaultUserProfile(){
    return {
        visual: {
            preferredColorScheme: 0, // 0 - system, 1 - light, 2 - dark
        },
        personal: {
            profilePicture: "/images/icons/default_user.svg", // <String> - URL to profile picture, /images/users/XXXXXXXXXXXXXXXXXXXXXXXXXX/...
            firstName: "[First]", // <String> - user's first name
            lastName: "[Last]", // <String> - user's last name
        },
        id: 0, // User ID
        username: "username", // Public username (small letters)
        displayUsername: "USERNAME", // Public username
    };
}

export const [isSignedIn, setSignedIn] = createSignal(null); // Must replace this value with a condition
export const [isUpdatingUserState, setUUS] = createSignal(null);
export const [userData, setUserData] = createSignal(defaultUserProfile());

function convertUserData(userData){
    let profile = defaultUserProfile();

    profile.id                                  = userData.UID;
    profile.username                            = userData.Username;
    profile.displayUsername                     = userData.DisplayUsername;

    profile.personal.firstName                  = userData.FirstName;
    profile.personal.lastName                   = userData.LastName;
    profile.personal.profilePicture             = (userData.ProfilePicutre == "DEFAULT") ?
                                                        profile.personal.profilePicture :
                                                        "/images/users/" + userData.ProfilePicutre + ".png";

    profile.visual.preferredColorScheme         = userData.ColorScheme;

    return profile;
}

export function updateUserState(callback = undefined, expectURLChange = false){
    // Share user data with iframes!
    if(window.sharedUserData != undefined){
        setUserData(window.sharedUserData);
        setSignedIn(window.sharedUserState);
        if(typeof callback == "function"){
            callback();
        }
    }else{
    // Disable page interactions (only when callback is defined)
    let localContent = document.getElementById("local-content"),
        globalBar = document.getElementById("global-bar"),
        enable = false;
    if(localContent != undefined && callback != undefined){
        enable = (localContent.dataset.processing == "false");
        localContent.dataset.processing = true;
        globalBar.dataset.processing = true;
    }
    // Make a request for the user's data
    userDataPOST(function(isSuccessful, data){
        // Updating user state
        setUUS(true);
        if(isSuccessful){
            // Set user state to signed in and add the user's profile
            setUserData(convertUserData(data));
            setSignedIn(true);    

            // Open a WebSocket to keep communicating with the server and wait for any updates
            /*
            openSocket(function(success){
                if(!success){
                    showDialog("Warning!", "We can't sync your data on this device!");
                }
            });
            */
        }else{
            // Set user state to signed out and switch to the default profile
            setUserData(defaultUserProfile());
            setSignedIn(false);
        }
        // Enable page interactions
        if(enable){
            localContent.dataset.processing = false;
            globalBar.dataset.processing = false;
        }
        if(typeof callback == "function"){
            callback();
        }
        if(expectURLChange){
            afterURLChange(function(){
                setUUS(false);
            }, true);
        }else{
            setUUS(false);
        }
    });
    }
}

export function signOut(){
    // Disable page interactions
    let localContent = document.getElementById("local-content"),
        globalBar = document.getElementById("global-bar"),
        enable = false;
    if(localContent != undefined){
        enable = (localContent.dataset.processing == "false");
        localContent.dataset.processing = true;
        globalBar.dataset.processing = true;
    }
    signOutPOST(function(isSuccessful, data){
        // Enable page interactions
        if(enable){
            localContent.dataset.processing = false;
            globalBar.dataset.processing = false;
        }
        // Updating user state
        setUUS(true);
        if(!isSuccessful){
            showDialog("Something went wrong!", "We couldn't end this session!");
        }else{
            setUserData(defaultUserProfile());
            setSignedIn(false);
        }
        setUUS(false);
    });
}