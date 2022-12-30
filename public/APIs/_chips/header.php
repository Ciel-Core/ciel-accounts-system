<?php

// Mark this file as a JSON file
header('Content-Type: application/json; charset=utf-8');

// Check if the user is making a request in dev mode
global $DEV_MODE;
$DEV_MODE = (isset($_SERVER['HTTP_DEV_MODE']) && $_SERVER['HTTP_DEV_MODE'] == "true");

// Get important data
require __DIR__."/../../config.env.php";
require __DIR__.'/../../data.secret.php';
require __DIR__.'/../../security/check.php';

// Disable warnings
error_reporting(($DEV_MODE) ? (E_ERROR | E_PARSE) : (0));
// Use `error_reporting(-1)` when you see no errors

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

// Only allow connections through port 443 (HTTPS)
if(!($STATE_HOSTED_LOCALLY) && $_SERVER['SERVER_PORT'] != 443){
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_CODE = BLOCKED_REQUEST;
    $RESPONSE_TEXT = "Requests are only permitted through port 443!";
    endRequest();
}

?>