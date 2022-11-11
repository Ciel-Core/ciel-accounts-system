/**
 * 
 * Manage device credentials
 * 
 **/

import { challengeRegisterPOST, getAuthnLoginDataPOST, getAuthnChallengeDataPOST } from "./communication/accounts.jsx";
import { loadCBOR, loadPlatformJS } from "./loader.jsx";
import { loginData } from "./pages/loginData.jsx";

// Read https://webauthn.guide/

export function createPublicKey(username, callback){

    // Get a challenge key from the server
    getAuthnChallengeDataPOST(username, async function(success, data){
        if(success){
            let challengeKey = data.challengeKey;

            // Start the client-side setup
            try {

                let credentialId, publicKeyBytes, user = data.user;

                // Get credential
                let credential = await navigator.credentials.create({
                    publicKey: {
                        challenge: Uint8Array.from(challengeKey, c => c.charCodeAt(0)),
                        rp: {
                            name: window.websiteName,
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

                if(credential instanceof PublicKeyCredential){

                    // let clientExtensionResults = credential.getClientExtensionResults();

                    // decode the clientDataJSON into a utf-8 string
                    let utf8Decoder = new TextDecoder('utf-8'),
                        decodedClientData = utf8Decoder.decode(credential.response.clientDataJSON);

                    // parse the string as an object
                    let clientDataObj = JSON.parse(decodedClientData);

                    // Check for invalid data
                    if(!(credential.response instanceof AuthenticatorAttestationResponse) ||
                        clientDataObj.type != "webauthn.create" ||
                        clientDataObj.origin != location.origin){
                        throw new Error("Unexpected client data!");
                    }else{
                        loadCBOR(function(){
                            // note: a CBOR decoder library is needed here.
                            let decodedAttestationObj = CBOR.decode(
                                credential.response.attestationObject);

                            //
                            let {authData} = decodedAttestationObj;

                            // get the length of the credential ID
                            let dataView = new DataView(new ArrayBuffer(2));
                            let idLenBytes = authData.slice(53, 55);
                            idLenBytes.forEach((value, index) => dataView.setUint8(index, value));
                            let credentialIdLength = dataView.getUint16();

                            // get the credential ID
                            credentialId = authData.slice(55, 55 + credentialIdLength);

                            // get the public key object
                            publicKeyBytes = authData.slice(55 + credentialIdLength);

                            // the publicKeyBytes are encoded again as CBOR
                            // let publicKeyObject = CBOR.decode(publicKeyBytes.buffer);

                            // Validate the data with the server!
                            // window.DATA = {credentialId, publicKeyBytes};
                            // let decoder = new TextDecoder();
                            // alert(`${decoder.decode(credentialId).length}-${decoder.decode(publicKeyBytes).length}`);

                            // Convert credential ID to array
                            credentialId = Array.from ? Array.from(credentialId)
                                                    : [].map.call(credentialId, (v => v));
                            loadPlatformJS(function(){
                                challengeRegisterPOST(
                                    btoa(JSON.stringify(credentialId)),
                                    btoa(JSON.stringify(publicKeyBytes)),
                                    clientDataObj.challenge,
                                    platform.os.family, function(success, data){
                                    callback(!success, {
                                        ...data,
                                        user: {
                                            ...user
                                        }
                                    });
                                });
                            });
                        });
                    }
                }
            }catch(e){
                callback(e, undefined);
            }
        }else{
            callback(new Error("Couldn't get a challenge key!"), undefined);
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
                        let credentialID = JSON.parse(atob(data.credentialID));
                        let assertion = await navigator.credentials.get({
                            publicKey: {
                                challenge: Uint8Array.from(challengeKey, c => c.charCodeAt(0)),
                                allowCredentials: [{
                                    id: new Uint8Array(credentialID),
                                    type: 'public-key',
                                    transports: ["internal"]
                                }],
                                userVerification: "required",
                                timeout: 60000,
                            }
                        });
                
                        callback(false, assertion);
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