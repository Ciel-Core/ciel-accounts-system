<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->credentialId, "string", false, "/^.|\n|\r{16,65535}$/"],
    [$INPUT_DATA->publicKey, "string", false, "/^.|\n|\r{16,65535}$/"],
    [$INPUT_DATA->challenge, "string", false, "/^.|\n|\r{16,65535}$/"]
);

// Include challenge key generator
require './../../tools/tool.strings.php';

// Include sessions functions
// require './../../tools/sql.sessions.php';

//
/*openssl_decrypt(
    string $data,
    string $cipher_algo,
    string $passphrase,
    int $options = 0,
    string $iv = "",
    ?string $tag = null,
    string $aad = ""
);*/
"ES256"; // aes256
"RS256";
// echo "\n'";
// var_dump($INPUT_DATA->challenge);
// echo "'\n'";
// var_dump(openssl_decrypt($INPUT_DATA->challenge, ""));
// echo "'\n";
session_start();
// $_SESSION["AUTHN__challengeKey"]

// Check if challenge key is valid
if(base64_decode($INPUT_DATA->challenge) == $_SESSION["AUTHN__challengeKey"]){
    //
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "Challenge key is invalid!";
    $RESPONSE_CODE = INVALID_DATA;
}

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}