<?php

// Tables
global $DATABASE_CoreTABLE__preferences, $DATABASE_CoreTABLE__reservedUsernames,
    $DATABASE_CoreTABLE__security, $DATABASE_CoreTABLE__sessions,
    $DATABASE_CoreTABLE__trustedDevices, $DATABASE_CoreTABLE__users,
    $DATABASE_CoreTABLE__system;

$DATABASE_CoreTABLE__preferences            = "preferences";
$DATABASE_CoreTABLE__reservedUsernames      = "reservedusernames";
$DATABASE_CoreTABLE__security               = "security";
$DATABASE_CoreTABLE__sessions               = "sessions";
$DATABASE_CoreTABLE__trustedDevices         = "trusteddevices";
$DATABASE_CoreTABLE__users                  = "users";
$DATABASE_CoreTABLE__system                 = "system";

// Connect to a database
const DATABASE_READ_ONLY = "R",
    DATABASE_WRITE_ONLY = "W",
    DATABASE_READ_AND_WRITE = "RW";
function connectMySQL($mode, $die = true){
    global $DATABASE_serverName, $DATABASE_serverPort, $DATABASE_name;
    $conn = NULL;
    if($mode == "RW"){
        global $DATABASE_username_RW, $DATABASE_password_RW;
        $conn = new mysqli($DATABASE_serverName, $DATABASE_username_RW, $DATABASE_password_RW,
                                $DATABASE_name, $DATABASE_serverPort);
    }else if($mode == "W"){
        global $DATABASE_username_W, $DATABASE_password_W;
        $conn = new mysqli($DATABASE_serverName, $DATABASE_username_W, $DATABASE_password_W,
                                $DATABASE_name, $DATABASE_serverPort);
    }else if($mode == "R"){
        global $DATABASE_username_R, $DATABASE_password_R;
        $conn = new mysqli($DATABASE_serverName, $DATABASE_username_R, $DATABASE_password_R,
                                $DATABASE_name, $DATABASE_serverPort);
    }else if($die){
        responseReport(BACKEND_ERROR, "Can't connect to database!");
    }
    if ($conn->connect_error && $die) {
        responseReport(BACKEND_ERROR, "Couldn't connect to database!");
    }
    return $conn;
}

// Execute a MySQL query
function executeQueryMySQL($connection, $query, $die = true){
    $result = mysqli_query($connection, $query);
    if($die && !($result)){
        responseReport(BACKEND_ERROR, "Couldn't execute query!");
    }
    return $result;
}

?>