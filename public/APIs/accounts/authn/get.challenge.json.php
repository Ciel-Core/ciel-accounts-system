<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
// checkInputData();

// Include challenge key generator
require './../../tools/tool.strings.php';

// Include sessions functions
// require './../../tools/sql.sessions.php';

session_start();
$_SESSION["AUTHN__challengeKey"] = randomHexString(32);
// setBrowserCookie("AUTHN__challengeKey", $challengeKey, time() + 360); // Only valid for 6 minutes

?>
{
    "challengeKey": "<?php echo $_SESSION["AUTHN__challengeKey"]; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}