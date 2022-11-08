<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->username, "string", true, "/^[A-Za-z0-9_]{3,20}$/", "/[a-zA-Z]/"]
);
/*
                            id: Uint8Array.from(data.user.UID, c => c.charCodeAt(0)),
                            name: data.user.name,
                            displayName: data.user.displayName

*/

// Include challenge key generator
require './../../tools/tool.strings.php';

// Include sessions functions
// require './../../tools/sql.sessions.php';

// Include WebAuthn-related functions
require './../../tools/sql.register.device.php';

// Generate challenge key
session_start();
$KEY = randomHexString(32);
$_SESSION["AUTHN__challengeKey"] = $KEY;
$_SESSION["AUTHN__challengeKey_timeout"] = time() + 360; // Only valid for 6 minutes

// Get user info
$userData = getUserData($INPUT_DATA->username);

?>
{
    "user": {
        "id": <?php echo $userData->UID; ?>,
        "name": "<?php echo $INPUT_DATA->username; ?>",
        "displayName": "<?php echo $userData->displayUsername; ?>"
    },
    "challengeKey": "<?php echo $KEY; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}