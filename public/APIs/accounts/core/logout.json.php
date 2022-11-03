<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Start session
// session_start();

// Get client info
require './../../tools/client.info.php';

if(CLIENT_isSessionValid()){
    // Remove session from database!
    require './../../tools/sql.sessions.php';
    removeSession();
    // remove all session variables and end session
    session_unset();
    session_destroy();
    #$RESPONSE_SUCCESS_STATUS = false;
    #$RESPONSE_TEXT = "Backend not ready!";
    #$RESPONSE_CODE = TEMPORARY;
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "No active session detected!";
    $RESPONSE_CODE = BLOCKED_REQUEST;
}

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}