<?php

// Detect if the host is trying to access this file
// (works only with browsers that support the 'referer' value, dependent on the client)
// Might be better off without this code!
function isHostAccess(){
    return ($_SERVER['SERVER_NAME'] == parse_url($_SERVER['HTTP_REFERER'])['host'] &&
    $_SERVER['SERVER_NAME'] == parse_url($_SERVER['HTTP_ORIGIN'])['host']);
}

// Check if the user is making the request through a secure connection
function isSecureConnection(){
    return (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1) ||
    isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https');
}

?>