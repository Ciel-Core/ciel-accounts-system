<?php

global $OPENSSL_CONFIG, $STATE_HOSTED_LOCALLY;
$OPENSSL_CONFIG = array(
    "digest_alg" => 'md5',
    "private_key_bits" => 2048,
    "private_key_type" => OPENSSL_KEYTYPE_RSA
);
if($STATE_HOSTED_LOCALLY){
    $OPENSSL_CONFIG["config"] = getenv("LOCAL_OPENSSL_CONFIG_PATH");
}

// Create a key pair
// exportMode - true returns array of key pair in PEM format
function generateKeyPair($exportMode = false, $die = true){
    global $OPENSSL_CONFIG;
    // Generate keys
    $pKey =  openssl_pkey_new($OPENSSL_CONFIG);
    if(!($pKey)){
        if($die){
            responseReport(BACKEND_ERROR, "Couldn't generate key pair!");
        }else{
            return false;
        }
    }
    // Return object
    if(!($exportMode)){
        return $pKey;
    }
    // Get keys in PEM format
    $keys = (object)array(
        "public" => NULL,
        "private" => NULL
    );
    openssl_pkey_export($pKey, $keys->private, NULL, $OPENSSL_CONFIG);
    $keys->public = openssl_pkey_get_details($pKey)["key"];
    unset($pKey);
    return $keys;
}

// Encrypt data
function encryptPublic($data, $publicKey){
    openssl_public_encrypt($data, $output, $publicKey);
    return base64_encode($output);
}

// Decrypt data
function decryptPrivate($data, $privateKey){
    openssl_private_decrypt($data, $output, $privateKey);
    return base64_decode($output);
}

?>