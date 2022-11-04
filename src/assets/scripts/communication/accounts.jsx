/**
 * 
 * Manage the communication with the accounts system API
 * 
 **/

import { makeRequest } from './../loader.jsx';
import { log, throwError, isDevMode } from './../console.jsx';

async function jsonPOST(url, json){
    return new Promise((resolve,reject)=>{
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                devMode: isDevMode,
                ...json
            })
        })
        .then(response => response.json())
        .then(data => {
            log(data);
            resolve(data);
        }).catch(error => {
            reject(error);
        });
    });
}

export function signInPOST(data, callback){
    jsonPOST("/APIs/accounts/core/login.json.php", data).then(function(data){
        callback(data.responseInfo.successful, data);
    }).catch(function(error){
        callback(false, undefined);
        throwError(error);
    });
}

export function signOutPOST(callback){
    jsonPOST("/APIs/accounts/core/logout.json.php", {
        //
    }).then(function(data){
        callback(data.responseInfo.successful, data);
    }).catch(function(error){
        callback(false, undefined);
        throwError(error);
    });
}

export function signUpPOST(data, callback){
    jsonPOST("/APIs/accounts/core/register.json.php",
        data
    ).then(function(data){
        callback(data.responseInfo.successful, data);
    }).catch(function(error){
        callback(false, undefined);
        throwError(error);
    });
}

export function usernameCheckPOST(username, callback, getDisplayUsername = true, reserveUsername = false, getCooldown = false){
    jsonPOST("/APIs/accounts/core/username.check.json.php",{
        username: username,
        getDisplayUsername: getDisplayUsername,
        getCooldown: getCooldown,
        reserveUsername: reserveUsername
    }).then(function(data){
        callback(data.responseInfo.successful, data);
    }).catch(function(error){
        callback(false, undefined);
        throwError(error);
    });
}

export function getSalts(callback){
    makeRequest("/const/password_salt.txt", function(error, data){
        // Note: The password salt will only prevent leaked password hashes from being used
        // to gain access to the user's password using already-existing hash lists
        callback(error, (error) ? data : data.replace(/\r/g, "").split(/\n/g));
    });
}

export function userDataPOST(callback, fullRequest = true){
    jsonPOST("/APIs/accounts/core/userData.request.json.php",{
        fullRequest: fullRequest
    }).then(function(data){
        callback(data.responseInfo.successful, data);
    }).catch(function(error){
        callback(false, undefined);
        throwError(error);
    });
}

// Temp
window.requestUserData = function(full = true){userDataPOST(function(...d){console.log(d)}, full)};