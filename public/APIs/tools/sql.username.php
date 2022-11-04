<?php

if(!function_exists("connectMySQL"))
    require 'sql.database.php';

if(!function_exists("CLIENT_isSessionValid"))
    require 'client.info.php';

if(!function_exists("validateDate"))
    require './../../tools/tool.dates.php';

// Check if the username already exists in the database as an ID
function usernameExists($username){
    $connection = connectMySQL(DATABASE_READ_ONLY);
    // Prevent SQL injections
    $EscapedUsername = mysqli_real_escape_string($connection, strtolower($username));

    global $DATABASE_CoreTABLE__users;
    $result = executeQueryMySQL($connection, "SELECT 1 FROM $DATABASE_CoreTABLE__users WHERE `Username` = '$EscapedUsername'");
    $connection->close();
    return (mysqli_fetch_assoc($result)[1]) == 1;
}

// Get display username (in upper and lower case format)
function getDisplayUsername($username){
    $connection = connectMySQL(DATABASE_READ_ONLY);
    // Prevent SQL injections
    $EscapedUsername = mysqli_real_escape_string($connection, strtolower($username));

    global $DATABASE_CoreTABLE__users;
    $result = executeQueryMySQL($connection, "SELECT `DisplayUsername` FROM $DATABASE_CoreTABLE__users WHERE `Username` = '$EscapedUsername'");
    $DisplayUsername = mysqli_fetch_assoc($result)["DisplayUsername"];
    $connection->close();
    return $DisplayUsername;
}

// Return the cooldown status of a username
// - Should the username be locked to an IP address that is not the same as the current one, return
//   true.
// - Should the username be locked to the current IP address, return false
function usernameOnCooldown($username, $ignoreIP = false){
    global $DATABASE_CoreTABLE__reservedUsernames, $CLIENT_IPAddress;
    $connection = connectMySQL(DATABASE_READ_ONLY);
    $Username = mysqli_real_escape_string($connection, strtolower($username));
    $result = executeQueryMySQL($connection, "SELECT `IPAddress`, `TimeoutTimestamp` FROM $DATABASE_CoreTABLE__reservedUsernames WHERE `Username` = '$Username'");
    if($result){
        $result = mysqli_fetch_assoc($result);
        $timeoutTimestamp = strToTimestamp($result["TimeoutTimestamp"]);
        // Check if the username cooldown status is expired
        if(time() >= $timeoutTimestamp){
            executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__reservedUsernames WHERE `Username` = '$Username'");
        }else if(($result["IPAddress"] != $CLIENT_IPAddress) || $ignoreIP){ // Check if this is not the same user
            $connection->close();
            return true;
        }
    }
    $connection->close();
    return false;
}

// Reserve username for 240 minutes (lock the username to the current IP address)
// - Should an account be created using the current IP address, drop all locked usernames
//   attached to said IP address.
function cooldownUsername($username){
    global $DATABASE_CoreTABLE__reservedUsernames, $CLIENT_IPAddress;
    $connection = connectMySQL(DATABASE_READ_AND_WRITE);
    $ClientIPAddress = mysqli_real_escape_string($connection, $CLIENT_IPAddress);

    // First remove all previously cooldowned usernames!
    executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__reservedUsernames WHERE `IPAddress` = '$ClientIPAddress'");

    // Cooldown the new username!
    $Username = mysqli_real_escape_string($connection, strtolower($username));
    // Get the timestamp of the next 240 minutes
    $TimeoutTimestamp = date('Y-m-d H:i:s', time() + 60*240); // Hmm, timezones...
    executeQueryMySQL($connection,
            "INSERT INTO `$DATABASE_CoreTABLE__reservedUsernames`
                (`IPAddress`,        `Username`,  `TimeoutTimestamp`)
            VALUES
                ('$ClientIPAddress', '$Username', '$TimeoutTimestamp')"
            );
    $connection->close();
}

?>