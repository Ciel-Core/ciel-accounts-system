<?php

// Mark this file as a JSON file
header('Content-Type: application/json; charset=utf-8');

require __DIR__.'/../../data.secret.php';
require __DIR__.'/../../security/check.php';

// Disable warnings
error_reporting(E_ERROR | E_PARSE);

// End request
function endRequest(){
    echo '{';
    require 'JSON_response_attachment.php';
    exit("}");    
}

// Only allow POST requests
if($_SERVER['REQUEST_METHOD'] != 'POST'){
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_CODE = BLOCKED_REQUEST;
    $RESPONSE_TEXT = "Only POST requests are allowed!";
    endRequest();
}

// Only allow the host to access these pages
// (works only with browsers that support the 'referer' value, dependent on the client)
// Might be better off without this code!
if(!isHostAccess()){
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_CODE = BLOCKED_REQUEST;
    $RESPONSE_TEXT = "Only the script host is allowed to access this page!";
    endRequest();
}

// Only allow HTTPS connections!
if(!($STATE_HOSTED_LOCALLY) && !(isSecureConnection())){
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_CODE = BLOCKED_REQUEST;
    $RESPONSE_TEXT = "Requests are only permitted through secure connections!";
    endRequest();
}

// Only allow connections through port 80
if($_SERVER['SERVER_PORT'] != 80){
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_CODE = BLOCKED_REQUEST;
    $RESPONSE_TEXT = "Requests are only permitted through port 80!";
    endRequest();
}

?>