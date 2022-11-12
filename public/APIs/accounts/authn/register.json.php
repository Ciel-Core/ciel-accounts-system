<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->clientDataJSON, "string", false, "/^[A-Za-z0-9=+-\/]{16,65535}$/"],
    [$INPUT_DATA->attestationObject, "string", false, "/^[A-Za-z0-9=+-\/]{16,65535}$/"],
    [$INPUT_DATA->challenge, "string", false, "/^[A-Za-z0-9=+-\/]{16,1000}$/"],
    [$INPUT_DATA->environment, "string", false, "/^[a-zA-Z0-9 ]{1,255}$/"]
);

// Include sessions functions
require './../../tools/sql.sessions.php';

// Include WebAuthn-related functions
require './../../tools/sql.register.device.php';

// Start session
session_start();
$DeviceID = "";

// Check if challenge key is valid
if(base64_decode($INPUT_DATA->challenge) == $_SESSION["AUTHN__challengeKey"]){
    if(time() < $_SESSION["AUTHN__challengeKey_timeout"]){
        // Include WebAuthn library
        require './../../tools/tool.web.authn.php';
        global $WebAuthn;

        // Ready data
        $clientDataJSON = base64_decode($INPUT_DATA->clientDataJSON);
        $attestationObject = base64_decode($INPUT_DATA->attestationObject);

        // processCreate returns data to be stored for future logins.
        try{
            $data = $WebAuthn->processCreate($clientDataJSON, $attestationObject, $_SESSION['AUTHN__challengeKey'], true, true, false);
        }catch(Exception $e){
            responseReport(BACKEND_ERROR, $e->getMessage());
        }

        // Save device to database
        $DeviceID = addTrustedDevice(base64_encode($data->credentialId), $data->credentialPublicKey, $INPUT_DATA->environment);

        // Check if root is valid
        if ($data->rootValid === false) {
            $RESPONSE_TEXT = 'registration ok, but certificate does not match any of the selected root ca.';
        }
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



/*
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
}*/

// End session
clearServerSession();

?>
{
    "deviceID": "<?php echo $DeviceID; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}