<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Start session
session_start();

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->username, "string", false, "/^[A-Za-z0-9_]{3,20}$/", "/[a-zA-Z]/"],
    [$INPUT_DATA->passwordHash, "string", false, "/^[a-z0-9]{32}$/"]
);

// Connect to the database
require './../../tools/sql.login.php';

// Get client info
require './../../tools/client.info.php';

if(!(CLIENT_isSessionValid())){
    // Check if the username and password match
    $result = signInStage1($INPUT_DATA);
    if($result->validUser){
        if($result->require2FA){
            $RESPONSE_SUCCESS_STATUS = false;
            $RESPONSE_TEXT = "Backend does not support 2FA yet!";
            $RESPONSE_CODE = TEMPORARY;
        }else{
            // The user is good to go, initialise a new session!
            if(!function_exists("removeSession"))
                require './../../tools/sql.sessions.php';
            $SID = addSession($result->UID);
            $_SESSION["SID"] = $SID;
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