<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->getDisplayUsername, "boolean"],
    [$INPUT_DATA->reserveUsername, "boolean"],
    [$INPUT_DATA->username, "string"]
);

$USERNAME_EXISTS = false;
$USERNAME_DISPLAY = "";

// Check if username is not taken
if(strtolower($INPUT_DATA->username) == "temp"){ // TEMP
    $USERNAME_EXISTS = true;
    // Get display username from database
    if($INPUT_DATA->getDisplayUsername){
        $USERNAME_DISPLAY = "TemP";
    }
}else{
    // Reserve username for 10 minutes
    if($INPUT_DATA->reserveUsername){
        //
    }
}

?>
{
    <?php
        if($INPUT_DATA->getDisplayUsername){
            echo '"displayUsername": "';
            echo $USERNAME_DISPLAY;
            echo '",';
        }
    ?>
    "usernameExists": <?php echo ($USERNAME_EXISTS) ? 'true' : 'false' ?>,
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}