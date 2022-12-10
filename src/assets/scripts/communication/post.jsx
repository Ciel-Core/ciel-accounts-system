/**
 * 
 * Manage the communication with the server's API (using POST)
 * 
 **/

import { log, isDevMode } from './../console.jsx';

export async function jsonPOST(url, json){
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                // Content headers
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // Developer mode header
                'Dev-Mode': isDevMode,
                // HTTP_CLIENT_REQUEST_PASSPHRASE
                // Use this header to verify actions that require the user to be signed in!
                // 'Client-Request-Passphrase': '[LOCAL_PASSPHRASE]'
            },
            body: JSON.stringify({
                ...json
            })
        })
        .then(response => response.json())
        .then(data => {
            log("Fetch", url, data);
            resolve(data);
        }).catch(error => {
            reject(error);
        });
    });
}