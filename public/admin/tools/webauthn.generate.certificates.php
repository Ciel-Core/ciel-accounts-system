<?php

// Use this file to generate FIDO Alliance certificates for WebAuthn
// Generate new certificates once every 1-2 months

require_once './../../APIs/tools/server.info.php';
require_once './../../APIs/tools/tool.web.authn.php';

global $WebAuthn;
$WebAuthn->queryFidoMetaDataService("$SERVER_ROOT/certificates/fido/", true);

?>