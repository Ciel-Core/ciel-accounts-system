<?php

if(!function_exists("connectMySQL"))
    require 'sql.database.php';

function signInStage1($input){
    global $DATABASE_CoreTABLE__users, $DATABASE_CoreTABLE__security,
        $DATABASE_secretSault1, $DATABASE_secretSault2;
    $connection = connectMySQL(DATABASE_READ_ONLY);

    $EscapedUsername = mysqli_real_escape_string($connection, strtolower($input->username));
    $PasswordHash = md5($DATABASE_secretSault1.($input->passwordHash).$DATABASE_secretSault2);

    // Prepare return object
    $return = (object)array("validUser" =>false, "require2FA" => 0);

    // Check if the login info are correct
    $result = executeQueryMySQL($connection, "SELECT `UID` FROM $DATABASE_CoreTABLE__users WHERE `Username` = '$EscapedUsername' AND `PasswordHash` = '$PasswordHash'");
    $UID = mysqli_fetch_assoc($result)["UID"];
    unset($result);

    // Check if the user is valid
    if(gettype($UID) == "string" && strlen($UID) > 10){
        $return->validUser = true;
        $result = executeQueryMySQL($connection, "SELECT `Require2FA` from $DATABASE_CoreTABLE__security WHERE `UID` = $UID");
        if($result){
            $return->require2FA = mysqli_fetch_assoc($result)["Require2FA"];
        }else{
            responseReport(BACKEND_ERROR, "Couldn't access 'security' database!");
        }
    }

    $connection->close();
    return $return;
}

?>