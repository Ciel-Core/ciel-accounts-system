<?php

require_once 'sql.database.php';

require_once 'sql.user.data.php';

// Create a safe device ID
// It's not nessessary at all to check if the device ID already exists since the chance of such
// a thing happening is very small. May be better off without this!
function createDeviceID($connection){
    global $DATABASE_CoreTABLE__trustedDevices;
    require_once 'tool.strings.php';
    $PlannedDeviceID = randomString(216);
    $result = executeQueryMySQL($connection, "SELECT 1 FROM $DATABASE_CoreTABLE__trustedDevices WHERE `DeviceID` = '$PlannedDeviceID'");
    if($result){
        if((mysqli_fetch_assoc($result)[1]) == 1){
            unset($PlannedDeviceID);
            unset($result);
            return createDeviceID($connection);
        }
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get data from database!");
    }
    return $PlannedDeviceID;
}

// Add a trusted device
function addTrustedDevice($credentialId, $publicKey){
    // Connect to DB
    $connection = connectMySQL(DATABASE_READ_AND_WRITE);
    global $DATABASE_CoreTABLE__trustedDevices;

    // Check if credential is already registered
    $CredentialID = mysqli_real_escape_string($connection, $credentialId);
    $PublicKey = mysqli_real_escape_string($connection, $publicKey);
    $result = executeQueryMySQL($connection, "SELECT 1 FROM $DATABASE_CoreTABLE__trustedDevices WHERE `CredentialID` = '$CredentialID' OR `PublicKey` = '$PublicKey'");
    if($result){
        if((mysqli_fetch_assoc($result)[1]) == 1){
            responseReport(BLOCKED_REQUEST, "CredentialID or PublicKey already exist!");
        }else{
            unset($result);
            $UID = getUID($connection);
            $DeviceID = createDeviceID($connection);
            executeQueryMySQL($connection,
                "INSERT INTO `$DATABASE_CoreTABLE__trustedDevices`
                    (`DeviceID`,  `UID`, `CredentialID`,  `PublicKey`,  `DeviceName`, `Environment`)
                VALUES
                    ('$DeviceID', $UID,  '$CredentialID', '$PublicKey', '',           '')");
            $connection->close();
            return $DeviceID;
        }
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get data from database!");
    }
}

// Get user data from username
function getUserData($username){
    // Connect to database
    global $DATABASE_CoreTABLE__users;
    $connection = connectMySQL(DATABASE_READ_ONLY);
    // Prevent SQL injections
    $EscapedUsername = mysqli_real_escape_string($connection, strtolower($username));

    // Get user data
    $return = (object)array("displayUsername" => "", "UID" => "");
    $result = executeQueryMySQL($connection,
        "SELECT `UID`, `DisplayUsername` FROM $DATABASE_CoreTABLE__users WHERE `Username` = '$EscapedUsername'");
    if($result){
        $result = mysqli_fetch_assoc($result);
        $return->displayUsername = $result["DisplayUsername"];
        $return->UID = $result["UID"];
        unset($result);
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get user ID");
    }

    // Return result
    $connection->close();
    return $return;
}

?>