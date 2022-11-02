/**
 * 
 * Manage the process of saving the login data locally
 * 
 **/

import { loadAES, hash } from './registerData.jsx';

function cleanLoginDataObject () {
    return {
        username: undefined
    };
}

export let loginData = cleanLoginDataObject();

export function resetLoginData(){
    loginData = cleanLoginDataObject();
}

export { loadAES, hash };