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
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "No active session detected!";
    $RESPONSE_CODE = BLOCKED_REQUEST;
}

// remove all session variables and end session
session_unset();
session_destroy();

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}