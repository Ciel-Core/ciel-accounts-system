<?php

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

if(!function_exists("removeSession"))
    require 'sql.sessions.php';
function CLIENT_isSessionValid(){
    if(isset($_COOKIE["SID"]) && preg_match('/^[a-zA-Z0-9]{216}$/', $_COOKIE["SID"])){
        if(!(checkSessionStatus())){
            setBrowserCookie('SID', '', 0);
            return false;
        }else{
            return true;
        }
    }else{
        setBrowserCookie('SID', '', 0);
        return false;
    }
}

?>