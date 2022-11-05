/**
 * 
 * Manage device credentials
 * 
 **/

// Read https://webauthn.guide/

import { loadCBOR } from "./loader";

export { loadCBOR };

export async function createPublicKey(challengeKey, userData, userIdentifier, callback){
    try {
        // Get credential
        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: Uint8Array.from(
                    challengeKey, c => c.charCodeAt(0)),
                rp: {
                    name: window.websiteName,
                    id: location.hostname,
                },
                user: {
                    id: Uint8Array.from(
                        userIdentifier, c => c.charCodeAt(0)),
                    name: userData.username,
                    displayName: userData.displayUsername,
                },
                pubKeyCredParams: [{alg: -7, type: "public-key"}, {alg: -257, type: "public-key"}],
                authenticatorSelection: {
                    authenticatorAttachment: "platform",
                },
                timeout: 60000,
                attestation: "direct"
            }
        });

        callback(false, credential);
    }catch(e){
        callback(e, undefined);
    }
}