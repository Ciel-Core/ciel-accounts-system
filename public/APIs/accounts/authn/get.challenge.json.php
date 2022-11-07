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
$KEY = randomHexString(32);
$_SESSION["AUTHN__challengeKey"] = $KEY;
// setBrowserCookie("AUTHN__challengeKey", $challengeKey, time() + 360); // Only valid for 6 minutes

?>
{
    "challengeKey": "<?php echo $KEY; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}