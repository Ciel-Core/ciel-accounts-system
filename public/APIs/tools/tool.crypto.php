<?php

// Source: https://davegebler.com/post/php/php-encryption-the-right-way-with-libsodium

function encryptData($data){
    global $DATABASE_encryptionKey;

    if(strlen($data) > 255){
        responseReport(BLOCKED_DATA, "Data longer than 255 characters detected!");
    }

    $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $ciphertext = sodium_crypto_secretbox($data, $nonce, $DATABASE_encryptionKey);
    $result = sodium_bin2base64($nonce . $ciphertext, SODIUM_BASE64_VARIANT_ORIGINAL);
    sodium_memzero($data);
    sodium_memzero($nonce);

    return $result;
}

function decryptData($data){
    global $DATABASE_encryptionKey;

    $ciphertext = sodium_base642bin($data, SODIUM_BASE64_VARIANT_ORIGINAL);
    $nonce = mb_substr($ciphertext, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, '8bit');
    $ciphertext = mb_substr($ciphertext, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES, null, '8bit');
    $result = sodium_crypto_secretbox_open($ciphertext, $nonce, $DATABASE_encryptionKey);
    if ($result === false) {
        responseReport(BACKEND_ERROR, "Couldn't decrypt user data!");
    }
    sodium_memzero($nonce);
    sodium_memzero($ciphertext);

    return $result;
}

?>