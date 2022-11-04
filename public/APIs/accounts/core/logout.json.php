<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

if(!(function_exists("CLIENT_isSessionValid")))
    require './../../tools/client.info.php';
if(CLIENT_isSessionValid()){
    // Remove session from database!
    if(!function_exists("removeSession"))
        require './../../tools/sql.sessions.php';
    removeSession();
}else{
    $RESPONSE_TEXT = "No active session detected!";
}

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}