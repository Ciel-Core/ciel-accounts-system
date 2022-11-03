<?php

// Start session
session_start();

$CLIENT_IPAddress = '';
// Get real visitor IP behind CloudFlare network
if (isset($_SERVER["HTTP_CF_CONNECTING_IP"])) {
    $_SERVER['REMOTE_ADDR'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
    $_SERVER['HTTP_CLIENT_IP'] = $_SERVER["HTTP_CF_CONNECTING_IP"];
}
$client  = @$_SERVER['HTTP_CLIENT_IP'];
$forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
$remote  = $_SERVER['REMOTE_ADDR'];
if(filter_var($client, FILTER_VALIDATE_IP)){
    $CLIENT_IPAddress = $client;
}else if(filter_var($forward, FILTER_VALIDATE_IP)){
    $CLIENT_IPAddress = $forward;
}else{
    $CLIENT_IPAddress = $remote;
}

function CLIENT_isSessionValid(){
    if(isset($_SESSION["SID"]) && strlen($_SESSION["SID"]) == 128){
        if(!function_exists("removeSession"))
            require 'sql.sessions.php';
        if(!(checkSessionStatus())){
            unset($_SESSION["SID"]);
            return false;
        }else{
            return true;
        }
    }else{
        unset($_SESSION["SID"]);
        return false;
    }
}

?>