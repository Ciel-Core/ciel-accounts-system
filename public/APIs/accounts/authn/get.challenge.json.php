<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->new, "boolean"]
);

// Include challenge key generator
require './../../tools/tool.strings.php';

// Include sessions functions
require './../../tools/sql.sessions.php';

if($INPUT_DATA->new || !(isset($_COOKIE["AUTHN__challengeKey"]))){
    setBrowserCookie("AUTHN__challengeKey", randomHexString(32), time() + 360); // Only valid for 6 minutes
}

?>
{
    "challengeKey": "<?php echo $_COOKIE["AUTHN__challengeKey"]; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}