<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->username, "string", false, "/^[A-Za-z0-9_]{3,20}$/", "/[a-zA-Z]/"],
    [$INPUT_DATA->passwordHash, "string", false, "/^[a-z0-9]{32}$/"],
    [$INPUT_DATA->timezoneOffset, "integer"]
);

// Connect to the database
require './../../tools/sql.login.php';

// Get client info
require './../../tools/client.info.php';

if(!(CLIENT_isSessionValid())){
    // Validate extra data
    if($INPUT_DATA->timezoneOffset > 32767 || $INPUT_DATA->timezoneOffset < -32768){
        $RESPONSE_SUCCESS_STATUS = false;
        $RESPONSE_TEXT = "Timezone offset exceeded expected range!";
        $RESPONSE_CODE = INVALID_DATA;
    }else{
        // Check if the username and password match
        $result = signInStage1($INPUT_DATA);
        if($result->validUser){
            if($result->require2FA){
                // Start a session
                session_start();
                $_SESSION["AUTH_UID"] = $result->UID;
                $RESPONSE_SUCCESS_STATUS = false;
                $RESPONSE_TEXT = "Backend does not support 2FA yet!";
                $RESPONSE_CODE = TEMPORARY;
            }else{
                // The user is good to go, initialise a new session!
                require_once './../../tools/sql.sessions.php';
                // Create a session
                addSession($result->UID, $INPUT_DATA);
            }
        }
    }
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "Device already has one on-going session!";
    $RESPONSE_CODE = BLOCKED_REQUEST;

}

?>
{
    "require2FA": <?php echo ($result->require2FA) ? 'true' : 'false'; ?>,
    "validUser": <?php echo ($result->validUser) ? 'true' : 'false'; ?>,
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}