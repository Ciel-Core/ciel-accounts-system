/**
 * 
 * Manage the user's data and state
 * 
 **/

import { createSignal } from "solid-js";
import { showDialog } from "./../components/Dialog.jsx";
import { signOutPOST, userDataPOST } from "./communication/accounts.jsx";
import { afterURLChange } from "./traffic.jsx";
import { closeConnection, listenTo, openConnection } from './communication/serverEvents.jsx';
import { isOnline } from "./internetConnection.jsx";
// import { openSocket } from "./communication/sockets.jsx";

// user data module (default data)
function defaultUserProfile(){
    return {
        visual: {
            preferredColorScheme: 0, // 0 - system, 1 - light, 2 - dark
            accentColor: "COLOR"
        },
        personal: {
            profilePicture: "/images/icons/default_user.svg", // <String> - URL to profile
                                            // picture, /images/users/XXXXXXXXXXXXXXXXXXXXXXXXXX/...
            firstName: "[First]", // <String> - user's first name
            lastName: "[Last]", // <String> - user's last name
        },
        content: {
            language: "en-GB"
        },
        system: {
            customizationComplete: false
        },
        id: 0, // User ID
        username: "username", // Public username (small letters)
        displayUsername: "USERNAME", // Public username
    };
}

export const [isSignedIn, setSI] = createSignal(null); // Must replace this value with a condition
export const [isUpdatingUserState, setUUS] = createSignal(null);
export const [userData, setUD] = createSignal(defaultUserProfile());
function setUserData(value){
    // For offline use!
    localStorage.setItem("last-user-data", JSON.stringify(value));
    setUD(value);
}
function setSignedIn(value){
    // For offline use!
    localStorage.setItem("last-user-state", Number(value));
    setSI(value);
}

function convertUserData(userData){
    let profile = defaultUserProfile();

    profile.id                                  = userData.UID;
    profile.username                            = userData.Username;
    profile.displayUsername                     = userData.DisplayUsername;

    profile.personal.firstName                  = userData.FirstName;
    profile.personal.lastName                   = userData.LastName;
    profile.personal.profilePicture             = (userData.ProfilePicutre == "DEFAULT") ?
                                                        profile.personal.profilePicture :
                                                        "/images/users/" +
                                                        userData.ProfilePicutre + ".png";

    profile.visual.preferredColorScheme         = userData.ColorScheme;
    profile.visual.accentColor                  = userData.AccentColor;

    profile.content.language                    = userData.Lang;

    profile.system.customizationComplete        = userData.CustomizationComplete;

    return profile;
}

function listenToUserUpdates(){
    // Open a Server Events connection
    openConnection(function(){
        // Listen to data updates
        listenTo("server-data-update", function(e){
            // Detect if the update relates to the USERS database!
            if(e.data.indexOf("CORE_ACCOUNTS.") == 0){
                updateUserState(undefined, false);
            }
        });
    });
}

export function updateUserState(callback = undefined, expectURLChange = false){
    if(!isOnline()){
        setUserData(JSON.parse(localStorage.getItem("last-user-data")));
        setSignedIn(!!Number(localStorage.getItem("last-user-state")));
        listenToUserUpdates();
        if(typeof callback == "function"){
            callback();
        }
        return;
    }
    // Share user data with iframes!
    else if(window.sharedUserData != undefined){
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
                // Listen to any data updates
                listenToUserUpdates();
            }else{
                // Set user state to signed out and switch to the default profile
                setUserData(defaultUserProfile());
                setSignedIn(false);
                // In case the connection wasn't closed properly
                closeConnection();
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
            // Close server events connection
            closeConnection();
            // Update user data
            setUserData(defaultUserProfile());
            setSignedIn(false);
        }
        setUUS(false);
    });
}