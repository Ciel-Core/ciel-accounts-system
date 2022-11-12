<?php

require_once 'sql.database.php';

// Get trusted devices
function getTrustedDevices($UID){
    global $DATABASE_CoreTABLE__trustedDevices;
    $connection = connectMySQL(DATABASE_READ_ONLY);
    $result = executeQueryMySQL($connection, "SELECT `DeviceID` FROM $DATABASE_CoreTABLE__trustedDevices WHERE `UID` = $UID");
    $return = array();
    if($result){
        while ($row = mysqli_fetch_array($result, MYSQLI_NUM)) {
            array_push($return, $row[0]);
        }
        unset($result);
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get trusted devices!");
    }
    $connection->close();
    return $return;
}

// Get trusted device credential
function getTrustedDeviceCredential($deviceID){
    global $DATABASE_CoreTABLE__trustedDevices;
    $connection = connectMySQL(DATABASE_READ_ONLY);
    $DeviceID = mysqli_real_escape_string($connection, $deviceID);
    $result = executeQueryMySQL($connection, "SELECT `CredentialID` FROM $DATABASE_CoreTABLE__trustedDevices WHERE `DeviceID` = '$DeviceID'");
    if($result){
        $connection->close();
        return mysqli_fetch_assoc($result)["CredentialID"];
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get trusted devices!");
    }
}

// Get trusted device public key
function getTrustedDevicePublicKey($deviceID){
    global $DATABASE_CoreTABLE__trustedDevices;
    $connection = connectMySQL(DATABASE_READ_ONLY);
    $DeviceID = mysqli_real_escape_string($connection, $deviceID);
    $result = executeQueryMySQL($connection, "SELECT `PublicKey` FROM $DATABASE_CoreTABLE__trustedDevices WHERE `DeviceID` = '$DeviceID'");
    if($result){
        $connection->close();
        return mysqli_fetch_assoc($result)["PublicKey"];
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get public key!");
    }
}

?>