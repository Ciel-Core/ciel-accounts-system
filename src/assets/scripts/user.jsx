/**
 * 
 * Manage the user's data and state
 * 
 **/

import { createSignal } from "solid-js";

// user data module
let userDataModule = {
    visual: {
        preferredColorScheme: 0, // 0 - system, 1 - light, 2 - dark
    },
    personal: {
        profilePicture: "/images/icons/default_user.svg", // <String> - URL to profile picture
        firstName: "First", // <String> - user's first name
        lastName: "Last", // <String> - user's last name
    },
    id: "0000000000", // User ID (cannot be changed)
    username: "USERNAME", // Public username
};

export const [isSignedIn, setSignedIn] = createSignal(false); // Must replace this value with a condition
export const [userData, setUserData] = createSignal(null);

export function updateUserState(){

    // Update the "isSignedIn" variable
    // setSignedIn(false);

    // Update the "userData" variable
    if(isSignedIn() == true){
        setUserData(0);
    }else{
        setUserData(userDataModule);
    }

}