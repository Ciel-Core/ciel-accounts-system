<?php

require_once 'sql.database.php';

require_once 'client.info.php';

require_once './../../tools/tool.dates.php';

function setBrowserCookie($name, $value, $expireDate, $HTTP_ONLY = true){
    global $STATE_HOSTED_LOCALLY;
    // 86400 = 1 day
    setcookie($name, '', 0, "/", $_SERVER['SERVER_NAME'], !$STATE_HOSTED_LOCALLY, $HTTP_ONLY);
    setcookie($name, $value, $expireDate, "/", $_SERVER['SERVER_NAME'], !$STATE_HOSTED_LOCALLY,
                $HTTP_ONLY);
}

// Remove a session from the database
function removeSession($InSID = "", $connection = ""){
    global $DATABASE_CoreTABLE__sessions;
    $close = false;
    if($connection == ""){
        $connection = connectMySQL(DATABASE_WRITE_ONLY);
        $close = true;
    }
    $SID = mysqli_real_escape_string($connection, ($InSID == "") ? $_COOKIE["SID"] : $InSID);
    // Remove session
    executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__sessions
                                            WHERE `SID` = '$SID'");
    if($close){
        $connection->close();
        setBrowserCookie("SID", '', 0);
    }
}

// Create a safe session ID
// It's not nessessary at all to check if the session ID already exists since the chance of such
// a thing happening is very small. May be better off without this!
function createSessionID($connection){
    global $DATABASE_CoreTABLE__sessions;
    require_once 'tool.strings.php';
    $PlannedSID = randomString(216);
    $result = executeQueryMySQL($connection, "SELECT 1 FROM $DATABASE_CoreTABLE__sessions
                                                        WHERE `SID` = '$PlannedSID'");
    if($result){
        if((mysqli_fetch_assoc($result)[1]) == 1){
            unset($PlannedSID);
            unset($result);
            return createSessionID($connection);
        }
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get data from database!");
    }
    return $PlannedSID;
}

function clearServerSession(){
    if(session_status() == PHP_SESSION_ACTIVE){
        session_start();
        session_unset();
        if(ini_get("session.use_cookies")){
            $params = session_get_cookie_params();
            setcookie(session_name(), '', -1,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }
}

// Add a session
// Sessions can only stay valid for 20 days!
function addSession($UID, $input){
    clearServerSession();
    // Check session limits
    checkSessionsLimit();
    checkUserSessionsLimit($UID);

    // Create a new session
    global $DATABASE_CoreTABLE__sessions, $CLIENT_IPAddress;
    $connection = connectMySQL(DATABASE_WRITE_ONLY);
    // Prepare session data
    $SID = createSessionID($connection);
    $LocalID = (int)mysqli_fetch_assoc(
                    executeQueryMySQL($connection,
                                        "SELECT MAX(`LocalID`) FROM $DATABASE_CoreTABLE__sessions
                                            WHERE `UID` = $UID")
                )["MAX(`LocalID`)"] + 1;
    $TimeoutTimestamp = date('Y-m-d H:i:s', time() + 60*60*24*20);
    $UserAgent = mysqli_real_escape_string($connection, $_SERVER['HTTP_USER_AGENT']);
    $ClientIPAddress = mysqli_real_escape_string($connection, $CLIENT_IPAddress);
    // Get user's location data
    require 'tool.location.php';
    $locData = getLocationFromIP($CLIENT_IPAddress, $input->timezoneOffset, $UID);
    $Country = mysqli_real_escape_string($connection, $locData->country);
    $Region = mysqli_real_escape_string($connection, $locData->region);
    $City = mysqli_real_escape_string($connection, $locData->city);
    $LocationCoordinates = mysqli_real_escape_string($connection, $locData->loc);
    $TimezoneOffset = mysqli_real_escape_string($connection, $locData->timezoneOffset);
    // Insert session into DB
    executeQueryMySQL($connection,
            "INSERT INTO `$DATABASE_CoreTABLE__sessions`
                (`SID`,  `UID`, `LocalID`, `TimeoutTimestamp`,  `IPAddress`,        `UserAgent`,
                `TimezoneOffset`, `Country`,  `Region`,  `City`,  `LocationCoordinates`)
            VALUES
                ('$SID', $UID,  $LocalID,  '$TimeoutTimestamp', '$ClientIPAddress', '$UserAgent',
                $TimezoneOffset,  '$Country', '$Region', '$City', '$LocationCoordinates')"
            );
    // Set a cookie to recover the session ID when the server's session ends
    setBrowserCookie("SID", $SID, time() + (86400 * 20)); // 86400 = 1 day
    $connection->close();
    return $SID;
}

// Check if a session ID is valid (true-valid,false-invalid)
function checkSessionStatus(){
    $isValid = true;
    global $DATABASE_CoreTABLE__sessions;
    $connection = connectMySQL(DATABASE_READ_AND_WRITE);
    $SID = mysqli_real_escape_string($connection, $_COOKIE["SID"]);
    // Check if the session has expired!
    $result = executeQueryMySQL($connection, "SELECT `TimeoutTimestamp`
                                                FROM $DATABASE_CoreTABLE__sessions
                                                WHERE `SID` = '$SID'");
    if($result){
        $timeoutTimestamp = strToTimestamp(mysqli_fetch_assoc($result)["TimeoutTimestamp"]);
        if(time() >= $timeoutTimestamp){
            $isValid = false;
        }
    }
    // Delete session from database
    if(!($isValid)){
        executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__sessions
                                            WHERE `SID` = '$SID'");
    }
    $connection->close();
    return $isValid;
}

// Check active sessions (user-specific)
// This function counts valid sessions, and removes expired sessions!
function checkUserActiveSessions($UID){
    global $DATABASE_CoreTABLE__sessions;
    $connection = connectMySQL(DATABASE_READ_AND_WRITE);
    $UID = mysqli_real_escape_string($connection, $UID);
    $result = executeQueryMySQL($connection, "SELECT `SID`, `TimeoutTimestamp`
                                                FROM $DATABASE_CoreTABLE__sessions
                                                WHERE `UID` = $UID");

    // Start counting active sessions
    if($result){
        $count = 0;
        while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
            $timestamp = strToTimestamp($row["TimeoutTimestamp"]);
            if(time() >= $timestamp){
                // Remove expired sessions!
                removeSession($row["SID"], $connection);
            }else{
                $count++;
            }
        }
        $connection->close();
        return $count;
    }else{
        responseReport(BACKEND_ERROR, "Couldn't discern the number of active sessions!");
    }
}

// Check the sessions and limit them
// Each user can sign in to a max of 3 devices at a given moment!
function checkUserSessionsLimit($UID, $die = true){
    if(checkUserActiveSessions($UID) >= 3){
        if($die){
            responseReport(BLOCKED_REQUEST, "Active sessions limit exceeded!");
        }
        return true;
    }
    return false;
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