<?php

if(!function_exists("connectMySQL"))
    require 'sql.database.php';

if(!function_exists("CLIENT_isSessionValid"))
    require 'client.info.php';

// Start session
session_start();

// Remove a session from the database
function removeSession(){
    global $DATABASE_CoreTABLE__sessions;
    $connection = connectMySQL(DATABASE_WRITE_ONLY);
    $SID = mysqli_real_escape_string($connection, $_SESSION["SID"]);
    // Remove session
    executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__sessions WHERE `SID` = '$SID'");
    $connection->close();
}

// Create a safe session ID
// It's not nessessary at all to check if the session ID already exists since the chance of such
// a thing happening is very small. May be better off without this!
function createSessionID($connection){
    global $DATABASE_CoreTABLE__sessions;
    require 'tool.strings.php';
    $PlannedSID = randomString(216);
    $result = executeQueryMySQL($connection, "SELECT 1 FROM $DATABASE_CoreTABLE__sessions WHERE `SID` = '$PlannedSID'");
    if((mysqli_fetch_assoc($result)[1]) == 1){
        unset($PlannedSID);
        unset($result);
        return createSessionID($SID);
    }
    return $PlannedSID;
}

// Add a session
// Sessions can only stay valid for 20 days!
function addSession($UID, $input){
    checkSessionsLimit();
    global $DATABASE_CoreTABLE__sessions, $CLIENT_IPAddress;
    $connection = connectMySQL(DATABASE_WRITE_ONLY);
    // Prepare session data
    $SID = createSessionID($connection);
    $TimezoneOffset = $input->timezoneOffset;
    $TimeoutTimestamp = date('Y-m-d H:i:s', time() + 60*60*24*20);
    $UserAgent = mysqli_real_escape_string($connection, $_SERVER['HTTP_USER_AGENT']);
    // Get user's location data
    require 'tool.location.php';
    $locData = getLocationFromIP($CLIENT_IPAddress);
    $Country = mysqli_real_escape_string($connection, $locData->country);
    $Region = mysqli_real_escape_string($connection, $locData->region);
    $City = mysqli_real_escape_string($connection, $locData->city);
    $LocationCoordinates = mysqli_real_escape_string($connection, $locData->loc);
    // Insert session into DB
    executeQueryMySQL($connection,
            "INSERT INTO `$DATABASE_CoreTABLE__sessions`
                (`SID`,  `UID`, `TimeoutTimestamp`,  `UserAgent`,  `TimezoneOffset`, `Country`,
                `Region`,  `City`,  `LocationCoordinates`)
            VALUES
                ('$SID', $UID,  '$TimeoutTimestamp', '$UserAgent', $TimezoneOffset,  '$Country',
                '$Region', '$City', '$LocationCoordinates')"
            );
    $connection->close();
    return $SID;
}

// Check if a session ID is valid (true-valid,false-invalid)
function checkSessionStatus(){
    global $DATABASE_CoreTABLE__sessions;
    $connection = connectMySQL(DATABASE_READ_AND_WRITE);
    $SID = mysqli_real_escape_string($connection, $_SESSION["SID"]);
    $result = executeQueryMySQL($connection, "SELECT `TimeoutTimestamp` FROM $DATABASE_CoreTABLE__sessions WHERE `SID` = '$SID'");
    if($result){
        $TimeoutTimestamp = mysqli_fetch_assoc($result)["TimeoutTimestamp"];
        $timeoutTimestamp = DateTime::createFromFormat('Y-m-d H:i:s', $TimeoutTimestamp);
        if($timeoutTimestamp === false){
            $timeoutTimestamp = 0;
        }else{
            $timeoutTimestamp = $timeoutTimestamp->getTimestamp();
        }
        // Check if the session has expired!
        if(time() >= $timeoutTimestamp){
            executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__sessions WHERE `SID` = '$SID'");
            $connection->close();
            return false;
        }else{
            $connection->close();
            return true;
        }
    }else{
        $connection->close();
        return false;
    }
}

// Check active sessions (Platform-wide)
function checkActiveSessions(){
    global $DATABASE_CoreTABLE__sessions;
    $connection = connectMySQL(DATABASE_READ_ONLY);
    $result = executeQueryMySQL($connection, "SELECT COUNT(*) FROM $DATABASE_CoreTABLE__sessions");
    if($result){
        $connection->close();
        return (int)mysqli_fetch_assoc($result)["COUNT(*)"];
    }else{
        responseReport(BACKEND_ERROR, "Couldn't discern the number of active sessions!");
    }
}

// Check the sessions and limit them
// (Platform-wide sessions limit)
function checkSessionsLimit($Limit = 10){
    if(checkActiveSessions() >= $Limit){
        responseReport(BLOCKED_REQUEST, "Server-wide sessions limit exceeded! ($Limit)");
    }
}
    
?>