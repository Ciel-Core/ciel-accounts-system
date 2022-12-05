<?php

// Load WebAuthn library
require_once "$SERVER_ROOT/libraries/WebAuthn/WebAuthn.php";
global $WebAuthn;

// Get certificates functions
require_once "tool.certificates.php";

// Formats
$formats = array('android-key', 'android-safetynet', 'apple', 'fido-u2f', 'none', 'packed', 'tpm');

$rpId = $_SERVER['SERVER_NAME'];

// cross-platform: true, if type internal is not allowed
//                 false, if only internal is allowed
//                 null, if internal and cross-platform is allowed

// new Instance of the server library.
$WebAuthn = new lbuchs\WebAuthn\WebAuthn('Ciel', $rpId, $formats);

// Update certificates
try{
    updateCertificates();
}catch(Exception $e){
    responseReport(BACKEND_ERROR, $e->getMessage());
}

// add trusted certificates
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/root"); // Trusted root certificates
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/FIDO"); // FIDO-affiliated certificates

?>