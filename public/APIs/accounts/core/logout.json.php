<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

require_once './../../tools/client.info.php';
if(CLIENT_isSessionValid()){
    // Remove session from database!
    require_once './../../tools/sql.sessions.php';
    removeSession();
}else{
    $RESPONSE_TEXT = "No active session detected!";
}

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}