/**
 * 
 * Manage the process of saving the login data locally
 * 
 **/

function cleanLoginDataObject () {
    return {
        username: undefined
    };
}

export let loginData = cleanLoginDataObject();

export function resetLoginData(){
    loginData = cleanLoginDataObject();
}