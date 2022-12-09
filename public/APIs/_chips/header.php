<?php

// Mark this file as a JSON file
header('Content-Type: application/json; charset=utf-8');

require __DIR__.'/../tools/data.secret.php';

// Disable warnings
error_reporting(E_ERROR | E_PARSE);

// Only allow POST requests
if($_SERVER['REQUEST_METHOD'] != 'POST'){
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_CODE = BLOCKED_REQUEST;
    $RESPONSE_TEXT = "Only POST requests are allowed!";
    echo '{';
    require 'JSON_response_attachment.php';
    exit("}");
}

// Only allow the host to access these pages
// (works only with browsers that support the 'referer' value, dependent on the client)
// Might be better off without this code!
if($_SERVER['SERVER_NAME'] != parse_url($_SERVER['HTTP_REFERER'])['host']){
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_CODE = BLOCKED_REQUEST;
    if($_SERVER['HTTP_REFERER'] == ""){
        $RESPONSE_TEXT = "Request must include the referer value!";
    }else{
        $RESPONSE_TEXT = "Only the script host is allowed to access this page!";
    }
    echo '{';
    require 'JSON_response_attachment.php';
    exit("}");
}

?>