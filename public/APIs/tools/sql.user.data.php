<?php

require_once 'sql.database.php';

function getDataFromTable($connection, $table, $UID, $data){
    $UserID = mysqli_real_escape_string($connection, $UID);
    $result = executeQueryMySQL($connection, "SELECT $data FROM $table WHERE `UID` = $UserID");
    if($result){
        return mysqli_fetch_assoc($result);
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get user data from database! (`$table`)");
    }
}

// Get UID
function getUID($connection = null, $die = true, $close = true){
    // Connect to database
    global $DATABASE_CoreTABLE__sessions;
    $closeCon = false;
    if($connection == null){
        $connection = connectMySQL(DATABASE_READ_ONLY, $die);
        $closeCon = true;
    }
    $EscapedSID = mysqli_real_escape_string($connection, $_COOKIE["SID"]);

    // Get UID
    $UID = 0;
    $result = executeQueryMySQL($connection,
        "SELECT `UID` FROM $DATABASE_CoreTABLE__sessions WHERE `SID` = '$EscapedSID'", $die);
    if($result){
        $UID = mysqli_fetch_assoc($result)["UID"];
        unset($result);
    }else if($die){
        responseReport(BACKEND_ERROR, "Couldn't get user ID");
    }

    // Return result
    if($closeCon && $close){
        $connection->close();
    }
    return $UID;
}

// Get UID by device ID
function getUIDByDeviceID($deviceID, $connection = null){
    // Connect to database
    global $DATABASE_CoreTABLE__trustedDevices;
    $closeCon = false;
    if($connection == null){
        $connection = connectMySQL(DATABASE_READ_ONLY);
        $closeCon = true;
    }
    $DeviceID = mysqli_real_escape_string($connection, $deviceID);

    // Get UID
    $UID = 0;
    $result = executeQueryMySQL($connection,
        "SELECT `UID` FROM $DATABASE_CoreTABLE__trustedDevices WHERE `DeviceID` = '$DeviceID'");
    if($result){
        $UID = mysqli_fetch_assoc($result)["UID"];
        unset($result);
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get user ID");
    }

    // Return result
    if($closeCon){
        $connection->close();
    }
    return $UID;
}

// Get UID by username
function getUIDByUsername($username, $connection = null){
    // Connect to database
    global $DATABASE_CoreTABLE__users;
    $closeCon = false;
    if($connection == null){
        $connection = connectMySQL(DATABASE_READ_ONLY);
        $closeCon = true;
    }
    $Username = mysqli_real_escape_string($connection, $username);

    // Get UID
    $UID = 0;
    $result = executeQueryMySQL($connection,
        "SELECT `UID` FROM $DATABASE_CoreTABLE__users WHERE `Username` = '$Username'");
    if($result){
        $UID = mysqli_fetch_assoc($result)["UID"];
        unset($result);
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get user ID");
    }

    // Return result
    return $UID;
}

// Get the key pair of a user
function getUserKeyPair($UID = NULL){
    // Connect to database
    global $DATABASE_CoreTABLE__security;
    $connection = connectMySQL(DATABASE_READ_ONLY);

    // Get UID
    if($UID == NULL){
        $UID = getUID($connection);
    }

    // Get user data from 'security'
    $security = (object)getDataFromTable($connection, $DATABASE_CoreTABLE__security, $UID,
                "`PrivateKey`, `PublicKey`");
    
    return (object)array(
        "public" => $security->PublicKey,
        "private" => $security->PrivateKey
    );
}

// Get all the user data needed by the client!
function getUserDataC(){
    // Connect to database
    global $DATABASE_CoreTABLE__users, $DATABASE_CoreTABLE__preferences,
            $DATABASE_CoreTABLE__system;
    $connection = connectMySQL(DATABASE_READ_ONLY);

    // Get UID
    $UID = getUID($connection);

    // Get user data from 'users'
    $users = getDataFromTable($connection, $DATABASE_CoreTABLE__users, $UID,
                "`UID`, `Username`, `DisplayUsername`, `FirstName`, `LastName`,
                 `ProfilePicutre`, `Lang`");

    // Get user data from 'preferences'
    $preferences = getDataFromTable($connection, $DATABASE_CoreTABLE__preferences, $UID,
                                        "`ColorScheme`, `AccentColor`");

    // Get user data from 'system'
    $system = getDataFromTable($connection, $DATABASE_CoreTABLE__system, $UID,
                                    "`CustomizationComplete`");

    return (object)array_merge((array)$users, (array)$preferences, (array)$system);
}

?>