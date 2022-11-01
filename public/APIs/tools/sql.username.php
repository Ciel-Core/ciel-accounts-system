<?php

// Check if the username already exists in the database as an ID
function usernameExists($username){
    return strtolower($username) == "temp";
}

// Return the cooldown status of a username
// - Should the username be locked to an IP address that is not the same as the current one, return
//   true.
// - Should the username be locked to the current IP address, return false
function usernameOnCooldown($username){
    return false;
}

// Reserve username for 240 minutes (lock the username to the current IP address)
// - Should an account be created using the current IP address, drop all locked usernames
//   attached to said IP address.
// - Should an IP address have more than 14 usernames locked to it, prevent said IP address
//   from locking any more usernames for 240 minutes and drop all locked usernames attached to said
//   IP address.
function cooldownUsername($username){
    //$_SERVER['REMOTE_ADDR'];
}

?>