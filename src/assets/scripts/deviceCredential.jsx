/**
 * 
 * Manage device credentials
 * 
 **/

import { loadCBOR } from "./loader.jsx";

// Read https://webauthn.guide/

export async function createPublicKey(challengeKey, user, callback){
    try {

        let credentialId, publicKeyBytes;

        // Get credential
        let credential = await navigator.credentials.create({
            publicKey: {
                challenge: Uint8Array.from(
                    challengeKey, c => c.charCodeAt(0)),
                rp: {
                    name: window.websiteName,
                    id: location.hostname
                },
                user: {
                    id: Uint8Array.from(user.ID, c => c.charCodeAt(0)),
                    name: user.name,
                    displayName: user.displayName
                },
                pubKeyCredParams: [{alg: -7, type: "public-key"}, {alg: -257, type: "public-key"}],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                    userVerification: "required"
                },
                timeout: 60000,
                attestation: "direct"
            }
        });

        // let clientExtensionResults = credential.getClientExtensionResults();

        // decode the clientDataJSON into a utf-8 string
        let utf8Decoder = new TextDecoder('utf-8'),
            decodedClientData = utf8Decoder.decode(credential.response.clientDataJSON);

        // parse the string as an object
        let clientDataObj = JSON.parse(decodedClientData);

        // Check for invalid data
        if(!(credential.response instanceof AuthenticatorAttestationResponse) ||
            clientDataObj.challenge != btoa(challengeKey) ||
            clientDataObj.type != "webauthn.create" ||
            clientDataObj.origin != location.origin){
            callback(true, undefined);
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

                callback(false, {
                    credentialId,
                    publicKeyBytes
                });
            });
        }
    }catch(e){
        callback(e, undefined);
    }
}

export async function checkCreditential(challengeKey, credentialId, callback){
    try {
        // Get credential
        let assertion = await navigator.credentials.get({
            publicKey: {
                challenge: Uint8Array.from(
                    challengeKey, c => c.charCodeAt(0)),
                allowCredentials: [{
                    id: credentialId,
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