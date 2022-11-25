<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Get client info
require './../../tools/client.info.php';

// Get system table functions
require './../../tools/sql.system.php';

if(CLIENT_isSessionValid()){
    if(!(setAsCustomized())){
        $RESPONSE_SUCCESS_STATUS = false;
        $RESPONSE_TEXT = "Couldn't update status in database!";
        $RESPONSE_CODE = BLOCKED_REQUEST;
    }
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "Device doesn't have an active session!";
    $RESPONSE_CODE = BLOCKED_REQUEST;
}

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}