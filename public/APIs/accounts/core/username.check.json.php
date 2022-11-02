<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->getDisplayUsername, "boolean"],
    [$INPUT_DATA->getCooldown, "boolean"],
    [$INPUT_DATA->reserveUsername, "boolean"],
    [$INPUT_DATA->username, "string", true, "/^[A-Za-z0-9_]{3,20}$/", "/[a-zA-Z]/"]
);

$USERNAME_EXISTS = false;
$USERNAME_ON_COOLDOWN = false;
$USERNAME_DISPLAY = "";

require './../../tools/sql.username.php';
// Get username cooldown status
$USERNAME_ON_COOLDOWN = usernameOnCooldown($INPUT_DATA->username);
if(!($USERNAME_ON_COOLDOWN)){
    // Check if username is not taken
    if(usernameExists($INPUT_DATA->username)){
        $USERNAME_EXISTS = true;
        // Get display username from database
        if($INPUT_DATA->getDisplayUsername){
            $USERNAME_DISPLAY = getDisplayUsername($INPUT_DATA->username);
        }
    }else if($INPUT_DATA->reserveUsername && !usernameOnCooldown($INPUT_DATA->username, true)){
        cooldownUsername($INPUT_DATA->username);
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
        if($INPUT_DATA->getCooldown){
            echo '"usernameOnCooldown":';
            echo ($USERNAME_ON_COOLDOWN) ? 'true' : 'false';
            echo ',';
        }
    ?>
    "usernameExists": <?php echo ($USERNAME_EXISTS) ? 'true' : 'false' ?>,
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}