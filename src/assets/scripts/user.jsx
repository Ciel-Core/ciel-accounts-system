/**
 * 
 * Manage the user's data and state
 * 
 **/

import { createSignal } from "solid-js";
import { showDialog } from "./../components/Dialog.jsx";
import { signOutPOST, userDataPOST } from "./communication/accounts.jsx";

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

export function updateUserState(callback = function(){}){
    // Make a request for the user's data
    userDataPOST(function(isSuccessful, data){
        if(isSuccessful){
            // Set user state to signed in and add the user's profile
            setUserData(convertUserData(data));
            setSignedIn(true);
        }else{
            // Set user state to signed out and switch to the default profile
            setUserData(defaultUserProfile());
            setSignedIn(false);
        }
        callback();
    });
}

export function signOut(){
    signOutPOST(function(isSuccessful, data){
        if(!isSuccessful){
            showDialog("Something went wrong!", "We couldn't end this session!");
        }else{
            setUserData(defaultUserProfile());
            setSignedIn(false);
        }
    });
}