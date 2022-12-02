<?php

require_once 'sql.database.php';
require_once './../../tools/tool.dates.php';

function signInStage1($input){
    global $DATABASE_CoreTABLE__users, $DATABASE_CoreTABLE__security,
        $DATABASE_secretSault1, $DATABASE_secretSault2;
    $connection = connectMySQL(DATABASE_READ_AND_WRITE);

    $EscapedUsername = mysqli_real_escape_string($connection, strtolower($input->username));
    $PasswordHash = hash("sha256", $DATABASE_secretSault1.($input->passwordHash)
                                    .$DATABASE_secretSault2);

    // Prepare return object
    $return = (object)array(
        "validUser" => false,
        "require2FA" => 0,
        "onCooldown" => false,
        "UID" => "0"
    );

    // Get user ID
    $UID = NULL;
    $result = executeQueryMySQL($connection, "SELECT `UID` FROM $DATABASE_CoreTABLE__users
                                                            WHERE `Username` = '$EscapedUsername'");
    if($result){
        $UID = mysqli_fetch_assoc($result)["UID"];
    }
    unset($result);
    if($UID == NULL || !(strlen($UID) > 10)){
        responseReport(BLOCKED_REQUEST, "Couldn't find user ID!");
    }

    // Check if account is on login cooldown
    $FailedLoginAttempts = NULL;
    $LoginCooldownTimeout = NULL;
    $result = executeQueryMySQL($connection, "SELECT `FailedLoginAttempts`, `LoginCooldownTimeout`
                                                FROM $DATABASE_CoreTABLE__security
                                                WHERE `UID` = $UID");
    if($result){
        $result = mysqli_fetch_assoc($result);
        $FailedLoginAttempts = $result["FailedLoginAttempts"];
        $LoginCooldownTimeout = $result["LoginCooldownTimeout"];
    }else{
        responseReport(BLOCKED_REQUEST, "Couldn't access 'security' database!");
    }
    unset($result);
    if($FailedLoginAttempts > 7){
        if($LoginCooldownTimeout != NULL && time() >= strToTimestamp($LoginCooldownTimeout)){
            // Remove login cooldown timeout
            executeQueryMySQL($connection,
                "UPDATE $DATABASE_CoreTABLE__security
                    SET `FailedLoginAttempts` = 0,
                        `LoginCooldownTimeout`= NULL
                WHERE `UID` = $UID");
        }else{
            $return->onCooldown = true;
            // responseReport(BLOCKED_REQUEST, "Account on login cooldown!");
        }
    }

    if(!($return->onCooldown)){
        // Check if the login info is correct
        $result = executeQueryMySQL($connection, "SELECT 1 FROM $DATABASE_CoreTABLE__users
                                                            WHERE `UID` = $UID
                                                            AND `PasswordHash` = '$PasswordHash'");
        if($result){
            if((mysqli_fetch_assoc($result)[1]) != 1){
                // Add cooldown for account login failure (8 failed attempts = 10 minutes cooldown)
                $FailedLoginAttempts = ($LoginCooldownTimeout == NULL ||
                                        time() >= strToTimestamp($LoginCooldownTimeout)) ?
                                            1
                                        :
                                            $FailedLoginAttempts + 1;
                $TimeoutTimestamp = date('Y-m-d H:i:s', time() + 60*10);
                executeQueryMySQL($connection,
                    "UPDATE $DATABASE_CoreTABLE__security
                        SET `FailedLoginAttempts` = $FailedLoginAttempts,
                            `LoginCooldownTimeout`= '$TimeoutTimestamp'
                    WHERE `UID` = $UID");
                responseReport(BLOCKED_REQUEST, "Invalid password!");
            }
        }else{
            responseReport(BACKEND_ERROR, "Couldn't access 'users' database!");
        }
        unset($result);

        // Check if the user is valid
        if(gettype($UID) == "string" && strlen($UID) > 10){
            $return->validUser = true;
            $return->UID = $UID;
            $result = executeQueryMySQL($connection, "SELECT `Require2FA`
                                                        FROM $DATABASE_CoreTABLE__security
                                                        WHERE `UID` = $UID");
            if($result){
                $return->require2FA = mysqli_fetch_assoc($result)["Require2FA"];
            }else{
                responseReport(BACKEND_ERROR, "Couldn't access 'security' database!");
            }
        }
    }

    $connection->close();
    return $return;
}

?>