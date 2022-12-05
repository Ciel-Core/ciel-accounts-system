<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->deviceID, "string", false, "/^[A-Za-z0-9]{216}$/"],
    [$INPUT_DATA->clientDataJSON, "string", false, "/^[A-Za-z0-9=+-\/]{16,65535}$/"],
    [$INPUT_DATA->authenticatorData, "string", false, "/^[A-Za-z0-9=+-\/]{16,65535}$/"],
    [$INPUT_DATA->signature, "string", false, "/^[A-Za-z0-9=+-\/]{16,65535}$/"],
    [$INPUT_DATA->challenge, "string", false, "/^[a-z0-9]{32}$/"],
    [$INPUT_DATA->timezoneOffset, "integer"]
);

// Include sessions functions
require './../../tools/sql.sessions.php';

// Include WebAuthn-related functions
require './../../tools/sql.trusted.devices.php';

// Include WebAuthn-related functions
require './../../tools/sql.register.device.php';

// Check if challenge key is valid
session_start();
$ValidUser = false;
if($INPUT_DATA->challenge == $_SESSION["AUTHN__challengeKey"]){
    if(time() < $_SESSION["AUTHN__challengeKey_timeout"]){
        // Include WebAuthn library
        require './../../tools/tool.web.authn.php';

        // Ready data
        $clientDataJSON = base64_decode($INPUT_DATA->clientDataJSON);
        $authenticatorData = base64_decode($INPUT_DATA->authenticatorData);
        $signature = base64_decode($INPUT_DATA->signature);
        $credentialPublicKey = getTrustedDevicePublicKey($INPUT_DATA->deviceID);

        // process the get request. throws WebAuthnException if it fails
        try{
            $data = $WebAuthn->processGet($clientDataJSON, $authenticatorData, $signature,
                                                $credentialPublicKey,
                                                $_SESSION["AUTHN__challengeKey"], null, true,
                                                true);
        }catch(Exception $e){
            // User authn failed
            responseReport(BACKEND_ERROR, $e->getMessage());
        }

        // Check if auth was successful
        if($data){
            // The user is good to go, initialise a new session!
            require_once './../../tools/sql.user.data.php';
            require_once './../../tools/sql.sessions.php';
            // Create a session
            $UID = getUIDByDeviceID($INPUT_DATA->deviceID);
            addSession($UID, $INPUT_DATA);
            // User login successful!
            $ValidUser = true;
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

// End session
clearServerSession();

?>
{
    "validUser": <?php echo ($ValidUser) ? 'true' : 'false'; ?>,
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}