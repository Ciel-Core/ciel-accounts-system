<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->username, "string", false, "/^[A-Za-z0-9_]{3,20}$/", "/[a-zA-Z]/"],
    [$INPUT_DATA->passwordHash, "string", false, "/^[a-z0-9]{32}$/"]
);

// Connect to the database
require './../../tools/sql.login.php';

$result = signInStage1($INPUT_DATA);

?>
{
    "require2FA": <?php echo ($result->require2FA) ? 'true' : 'false'; ?>,
    "validUser": <?php echo ($result->validUser) ? 'true' : 'false'; ?>,
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}