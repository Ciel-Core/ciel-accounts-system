<?php

// Create a key pair
// exportMode - true returns array of key pair in PEM format
function generateKeyPair($exportMode = false){
    // Generate keys
    $pKey =  openssl_pkey_new(array(
        "digest_alg" => "sha512",
        "private_key_bits" => 4096,
        "private_key_type" => OPENSSL_KEYTYPE_RSA,
    ));
    // Return object
    if(!($exportMode)){
        return $pKey;
    }
    // Get keys in PEM format
    openssl_pkey_export($pKey, $privateKey);
    $publicKey = openssl_pkey_get_details($pKey)["key"];
    $keys = array(
        "public" => $publicKey,
        "private" => $privateKey
    );
    unset($pKey);
    return $keys;
}

// Encrypt data
function encryptPublic($data, $publicKey){
    openssl_public_encrypt($data, $output, $publicKey);
    return $output;
}

// Decrypt data
function decryptPrivate($data, $privateKey){
    openssl_private_decrypt($data, $output, $privateKey);
    return $output;
}

?>