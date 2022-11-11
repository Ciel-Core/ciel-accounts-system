<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->getDisplayUsername, "boolean"],
    [$INPUT_DATA->getCooldown, "boolean"],
    [$INPUT_DATA->reserveUsername, "boolean"],
    [$INPUT_DATA->getTrustedDevices, "boolean"],
    [$INPUT_DATA->username, "string", false, "/^[A-Za-z0-9_]{3,20}$/", "/[a-zA-Z]/"]
);

$USERNAME_EXISTS        = false;
$USERNAME_ON_COOLDOWN   = false;
$USERNAME_DISPLAY       = "";
$USER_ID                = "-1";
$TRUSTED_DEVICES        = array();

require './../../tools/sql.username.php';
// Get username cooldown status
$USERNAME_ON_COOLDOWN = usernameOnCooldown($INPUT_DATA->username);
if(!($USERNAME_ON_COOLDOWN)){
    // Check if username is not taken
    $USER_ID = usernameExists($INPUT_DATA->username);
    if($USER_ID != "0"){
        $USERNAME_EXISTS = true;
        // Get display username from database
        if($INPUT_DATA->getDisplayUsername){
            $USERNAME_DISPLAY = getDisplayUsername($INPUT_DATA->username);
        }
        // Get trusted devices
        if($INPUT_DATA->getTrustedDevices){
            require './../../tools/sql.trusted.devices.php';
            $TRUSTED_DEVICES = getTrustedDevices($USER_ID);
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
        if($INPUT_DATA->getTrustedDevices){
            echo '"trustedDevices":';
            echo '[';
            $i = 0;
            while($i < count($TRUSTED_DEVICES)){
                echo '"';
                echo $TRUSTED_DEVICES[$i];
                echo '"';
                $i++;
                if($i < count($TRUSTED_DEVICES)){
                    echo ',';
                }
            }
            // List...
            echo '],';
        }
    ?>
    "UID": <?php echo $USER_ID; ?>,
    "usernameExists": <?php echo ($USERNAME_EXISTS) ? 'true' : 'false' ?>,
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}