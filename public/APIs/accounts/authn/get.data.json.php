<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->username, "string", true, "/^[A-Za-z0-9_]{3,20}$/", "/[a-zA-Z]/"],
    [$INPUT_DATA->getUserData, "boolean"]
);

// Include challenge key generator
require './../../tools/tool.strings.php';

// Generate challenge key
session_start();
$KEY = randomHexString(32);
$_SESSION["AUTHN__challengeKey"] = $KEY;
$_SESSION["AUTHN__challengeKey_timeout"] = time() + 360; // Only valid for 6 minutes

// Get user info
if($INPUT_DATA->getUserData){
    require './../../tools/sql.register.device.php';
    $userData = getUserData($INPUT_DATA->username);
}

?>
{
    <?php
        if($INPUT_DATA->getUserData){
            echo '"user": {';
            echo    '"id":';
            echo        $userData->UID;
            echo    ', "name": "';
            echo        $INPUT_DATA->username;
            echo    '", "displayName": "';
            echo        $userData->displayUsername;
            echo    '"';
            echo '},';
        }
    ?>
    "challengeKey": "<?php echo $KEY; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}