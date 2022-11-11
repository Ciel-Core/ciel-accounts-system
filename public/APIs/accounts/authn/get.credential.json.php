<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->deviceID, "string", false, "/^[A-Za-z0-9]{216}$/"]
);

// Include WebAuthn-related functions
require './../../tools/sql.trusted.devices.php';

// Generate challenge key
$CredentialID = getTrustedDeviceCredential($INPUT_DATA->deviceID);

?>
{
    "credentialID": "<?php echo $CredentialID; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}