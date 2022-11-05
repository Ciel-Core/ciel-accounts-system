<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->credentialId, "string", false, "/^.|\n|\r{16,65535}$/"],
    [$INPUT_DATA->publicKey, "string", false, "/^.|\n|\r{16,65535}$/"]
);

// Include challenge key generator
require './../../tools/tool.strings.php';

// Include sessions functions
require './../../tools/sql.sessions.php';

//
"ES256"

?>
{
    "valid": "<?php echo $_COOKIE["AUTHN__challengeKey"]; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}