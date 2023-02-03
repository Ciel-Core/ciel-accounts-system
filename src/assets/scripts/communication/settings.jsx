/**
 * 
 * Manage the communication with the accounts system API to manage the user's settings
 * 
 **/

import { throwError } from './../console.jsx';
import { jsonPOST } from './post.jsx';

// Prevent callback errors from causing unintended callbacks!
function errorWrapper(callback, ...args){
    try{
        callback.apply(undefined, args);
    }catch{}
}

export function removeSessionPOST(localID, callback){
    jsonPOST("/APIs/accounts/settings/delete.session.json.php", {
        localID
    }).then(function(data){
        errorWrapper(callback, data.responseInfo.successful, data);
    }).catch(function(error){
        callback(false, undefined);
        throwError(error);
    });
}

export function getSessionsPOST(richData, callback){
    jsonPOST("/APIs/accounts/settings/get.sessions.json.php", {
        richData
    }).then(function(data){
        errorWrapper(callback, data.responseInfo.successful, data);
    }).catch(function(error){
        callback(false, undefined);
        throwError(error);
    });
}
