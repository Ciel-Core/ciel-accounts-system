<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Get client info
require './../../tools/client.info.php';

// Start a session
session_start();

$AwaitingAuth = false;
if(!(CLIENT_isSessionValid())){
    // Check if there is a user waiting for auth
    if(isset($_SESSION["AUTH_UID"])){
        $AwaitingAuth = true;
    }
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "Device already has one on-going session!";
    $RESPONSE_CODE = BLOCKED_REQUEST;
}

?>
{
    "awaitingAuth": <?php echo ($AwaitingAuth) ? 'true' : 'false'; ?>,
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}