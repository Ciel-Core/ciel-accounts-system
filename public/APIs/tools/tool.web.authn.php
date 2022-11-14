<?php

require_once "$SERVER_ROOT/libraries/WebAuthn/WebAuthn.php";

global $WebAuthn;

// Formats
$formats = array('android-key', 'android-safetynet', 'apple', 'fido-u2f', 'none', 'packed', 'tpm');

$rpId = $_SERVER['SERVER_NAME'];

// cross-platform: true, if type internal is not allowed
//                 false, if only internal is allowed
//                 null, if internal and cross-platform is allowed
$crossPlatformAttachment = false;

// new Instance of the server library.
$WebAuthn = new lbuchs\WebAuthn\WebAuthn('Ciel', $rpId, $formats);

// add root certificates to validate new registrations
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/root/solo.pem");
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/root/apple.pem");
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/root/yubico.pem");
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/root/hypersecu.pem");
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/root/globalSign.pem");
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/root/googleHardware.pem");
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/root/microsoftTpmCollection.pem");
$WebAuthn->addRootCertificates("$SERVER_ROOT/certificates/root/mds");

?>