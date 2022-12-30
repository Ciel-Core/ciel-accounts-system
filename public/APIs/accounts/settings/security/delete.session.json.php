<?php

// Initiate the page
require './../../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->localID, "integer"]
);

// Get client info
require './../../../tools/client.info.php';
require_once './../../../tools/sql.sessions.php';

if(CLIENT_isSessionValid()){
    // Do stuff!
    $SID = getSIDByLocalID($INPUT_DATA->localID);
    removeSession($SID);
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "No valid on-going sessions!";
    $RESPONSE_CODE = BLOCKED_REQUEST;
}

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}