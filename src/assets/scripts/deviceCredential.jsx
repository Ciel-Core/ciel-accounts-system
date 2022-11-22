/**
 * 
 * Manage device credentials
 * 
 **/

import { authnRegisterPOST, getAuthnLoginDataPOST, getAuthnChallengeDataPOST } from "./communication/accounts.jsx";
import { loadCBOR, loadPlatformJS } from "./loader.jsx";
import { loginData } from "./pages/loginData.jsx";

// Read https://webauthn.guide/

/**
 * Convert a ArrayBuffer to Base64
 * @param {ArrayBuffer} buffer
 * @returns {String}
 */
export function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export function createPublicKey(username, callback){

    // Get a challenge key from the server
    getAuthnChallengeDataPOST(username, async function(success, data){
        if(success){
            let challengeKey = data.challengeKey;

            // Start the client-side setup
            try {

                let user = data.user;

                // Get credential
                let credential = await navigator.credentials.create({
                    publicKey: {
                        challenge: Uint8Array.from(challengeKey, c => c.charCodeAt(0)),
                        rp: {
                            name: import.meta.env.VITE_NAME,
                            id: location.hostname
                        },
                        user: {
                            id: Uint8Array.from(String(user.id), c => c.charCodeAt(0)),
                            name: user.name,
                            displayName: user.displayName
                        },
                        // Read: https://chromium.googlesource.com/chromium/src/+/master/content/browser/webauth/pub_key_cred_params.md
                        pubKeyCredParams: [{alg: -7, type: "public-key"}, {alg: -257, type: "public-key"}], // ES256 (-7),  RS256 (-257)
                        authenticatorSelection: {
                            authenticatorAttachment: "platform",
                            userVerification: "required"
                        },
                        timeout: 60000,
                        attestation: "direct"
                    }
                });

                if(credential instanceof PublicKeyCredential &&
                    credential.response instanceof AuthenticatorAttestationResponse){

                    // Read data for server verification
                    let clientDataJSON = credential.response.clientDataJSON ? arrayBufferToBase64(credential.response.clientDataJSON) : null,
                        attestationObject = credential.response.attestationObject ? arrayBufferToBase64(credential.response.attestationObject) : null;
                    // Get user challenge
                    // decode the clientDataJSON into a utf-8 string
                    let utf8Decoder = new TextDecoder('utf-8'),
                        decodedClientData = utf8Decoder.decode(credential.response.clientDataJSON),
                        clientDataObj = JSON.parse(decodedClientData),
                        challenge = clientDataObj.challenge;

                    loadPlatformJS(function(){
                        authnRegisterPOST(
                            clientDataJSON,
                            attestationObject,
                            challenge,
                            platform.os.family, function(success, data){
                                callback(!success, {
                                    ...data,
                                    user: {
                                        ...user
                                    }
                                });
                            });
                    });
                }else{
                    throw new Error("Invalid client response object!");
                }
            }catch(e){
                callback(e, undefined);
            }
        }else{
            callback(new Error("Couldn't get a challenge key!"), data);
        }
    }, true);
}

export async function checkCreditential(callback){
    // Get device ID
    let deviceID = localStorage.getItem(`DEVICE_TRUSTED_${loginData.UID}`);
    // Get a challenge key
    getAuthnChallengeDataPOST(loginData.username, function(success, data){
        if(success){
            let challengeKey = data.challengeKey;
            getAuthnLoginDataPOST(deviceID, async function(success, data){
                if(success){
                    try {
                        // Get credential
                        let credentialID = atob(data.credentialID);
                        let assertion = await navigator.credentials.get({
                            publicKey: {
                                challenge: Uint8Array.from(challengeKey, c => c.charCodeAt(0)),
                                allowCredentials: [{
                                    id: Uint8Array.from(credentialID, c => c.charCodeAt(0)),
                                    type: 'public-key',
                                    transports: ["internal"]
                                }],
                                userVerification: "required",
                                timeout: 60000,
                            }
                        });

                        callback(false, challengeKey, assertion);
                    }catch(e){
                        callback(e, undefined);
                    }
                }else{
                    callback(new Error("Couldn't get creditential ID!"), undefined);
                }
            });
        }else{
            callback(new Error("Couldn't get a challenge key!"), undefined);
        }
    });

}

// Source: https://www.twilio.com/blog/detect-browser-support-webauthn
export function checkPlatformSupport(callback){
    let supported = false;
    if (window.PublicKeyCredential) {
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable().then((available) => {
            if(available){
                callback(false, true);
            }else{
                // WebAuthn supported, Platform Authenticator *not* supported.
                callback(false, false);
            }
        }).catch((e) => callback(e, undefined));
    }else{
        callback(false, false);
    }
}