<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Get client info
require './../../tools/client.info.php';

if(CLIENT_isSessionValid()){
    // Do stuff!
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "No valid on-going sessions!";
    $RESPONSE_CODE = BLOCKED_REQUEST;
}

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}