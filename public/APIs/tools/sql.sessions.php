<?php

if(!function_exists("connectMySQL"))
    require 'sql.database.php';

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
    $PlannedSID = randomString(128);
    $result = executeQueryMySQL($connection, "SELECT 1 FROM $DATABASE_CoreTABLE__sessions WHERE `SID` = '$PlannedSID'");
    if((mysqli_fetch_assoc($result)[1]) == 1){
        unset($PlannedSID);
        unset($result);
        return createSessionID($SID);
    }
    return $PlannedSID;
}

// Add a session
function addSession($UID){
    global $DATABASE_CoreTABLE__sessions;
    $connection = connectMySQL(DATABASE_WRITE_ONLY);
    $SID = createSessionID($connection);
    $TimeoutTimestamp = date('Y-m-d H:i:s', time() + 60*60*24*16); // Hmm, timezones...
    $UserAgent = mysqli_real_escape_string($connection, $_SERVER['HTTP_USER_AGENT']);
    // Remove session
    executeQueryMySQL($connection,
            "INSERT INTO `$DATABASE_CoreTABLE__sessions`
                (`SID`,  `UID`, `TimeoutTimestamp`,  `UserAgent`,  `Country`, `Region`, `City`, `Timezone`, `LocationCoordinates`)
            VALUES
                ('$SID', $UID,  '$TimeoutTimestamp', '$UserAgent', '2', '3', '4', '5', '6')"
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
    
?>