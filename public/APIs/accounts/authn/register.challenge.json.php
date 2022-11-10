<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->credentialId, "string", false, "/^.|\n|\r{16,65535}$/"],
    [$INPUT_DATA->publicKey, "string", false, "/^.|\n|\r{16,65535}$/"],
    [$INPUT_DATA->challenge, "string", false, "/^.|\n|\r{16,65535}$/"],
    [$INPUT_DATA->environment, "string", false, "/^[a-zA-Z0-9 ]{1,255}$/"]
);

// Include challenge key generator
require './../../tools/tool.strings.php';

// Include sessions functions
require './../../tools/sql.sessions.php';

// Include WebAuthn-related functions
require './../../tools/sql.register.device.php';

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
$DeviceID = "";
if(base64_decode($INPUT_DATA->challenge) == $_SESSION["AUTHN__challengeKey"]){
    if(time() < $_SESSION["AUTHN__challengeKey_timeout"]){
        $DeviceID = addTrustedDevice($INPUT_DATA->credentialId, $INPUT_DATA->publicKey, $INPUT_DATA->environment);
    }else{
        $RESPONSE_SUCCESS_STATUS = false;
        $RESPONSE_TEXT = "Challenge key expired!";
        $RESPONSE_CODE = BLOCKED_REQUEST;
    }
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "Challenge key is invalid!";
    $RESPONSE_CODE = INVALID_DATA;
}

?>
{
    "deviceID": "<?php echo $DeviceID; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}