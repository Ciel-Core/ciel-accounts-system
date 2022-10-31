<?php

// Set the filter's status to true by default
$RESERVE_FILTER_status = true;

// Get the server's info
require 'server.info.php';

// Get the usernames list
$RESERVE_FILTER__usernamesListString = file_get_contents("$SERVER_ROOT/lists/reserved_usernames.txt");
$RESERVE_FILTER__status = !($RESERVE_FILTER__usernamesListString == false);

// Convert the list into an array and clean up the string list
$RESERVE_FILTER__usernamesList = ($RESERVE_FILTER__status) ?
                                preg_split(
                                            "/\n|\r\n/",
                                            $RESERVE_FILTER__usernamesListString
                                        ) : false;

$RESERVE_FILTER__status = !($RESERVE_FILTER__usernamesList == false);
unset($RESERVE_FILTER__usernamesListString);

function checkUsernameRS($username){
    global $RESERVE_FILTER__status, $RESERVE_FILTER__usernamesList;
    if($RESERVE_FILTER__status){
        $username_lowerCase = strtolower($username);
        // Loop through the words
        $i = 0;
        while($i < count($RESERVE_FILTER__usernamesList)){
            if($username_lowerCase == $RESERVE_FILTER__usernamesList[$i]){
                return true;
            }
            $i++;
        }
    }
    return false;
}

?>