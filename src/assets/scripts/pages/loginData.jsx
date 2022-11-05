/**
 * 
 * Manage the process of saving the login data locally
 * 
 **/

import { hash } from './registerData.jsx';
import { loadAES } from './../loader.jsx';

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