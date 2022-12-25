<?php

require_once 'sql.database.php';

// Attempt to register the user in the databse
// return TRUE on success, FALSE on failure
function registerUser($input){
    global $DATABASE_CoreTABLE__preferences, $DATABASE_CoreTABLE__security,
        $DATABASE_CoreTABLE__users, $DATABASE_CoreTABLE__reservedUsernames,
        $DATABASE_CoreTABLE__system,
        $DATABASE_secretSalt1, $DATABASE_secretSalt2,
        $CLIENT_IPAddress;
    $connection = connectMySQL(DATABASE_READ_AND_WRITE);

    // Prevent SQL injections
    require_once 'client.info.php';
    $Username = mysqli_real_escape_string($connection, strtolower($input->username));
    $DisplayUsername = mysqli_real_escape_string($connection, $input->username);
    $FirstName = mysqli_real_escape_string($connection, $input->name->first);
    $LastName = mysqli_real_escape_string($connection, $input->name->last);
    $Birthdate = $input->birthdate->year."-".$input->birthdate->month."-".$input->birthdate->day;
    $GenderName = mysqli_real_escape_string($connection, ucwords(strtolower($input->gender)));
    $Pronounce = $input->pronounce;
    $CreationIPAddress = mysqli_real_escape_string($connection, $CLIENT_IPAddress);
    $Lang = mysqli_real_escape_string($connection, $input->extraData->registrationDisplayLanguage);

    // Attempt to register basic user info 
    if(executeQueryMySQL($connection,
            "INSERT INTO `$DATABASE_CoreTABLE__users`
                (`Username`,  `DisplayUsername`,  `CreationIPAddress`,
                `FirstName`,  `LastName`,  `Birthdate`,  `GenderName`, `Pronounce`, `Lang`)
            VALUES
                ('$Username', '$DisplayUsername', '$CreationIPAddress',
                '$FirstName', '$LastName', '$Birthdate', '$GenderName', $Pronounce, '$Lang')"
        )){

        // Get the user ID (UID)
        $result = executeQueryMySQL($connection, "SELECT `UID` FROM $DATABASE_CoreTABLE__users
                                                                WHERE `Username` = '$Username'");
        $UID = mysqli_fetch_assoc($result)["UID"];
        $UIDStatus = (gettype($UID) == "string" && strlen($UID) > 10);
        unset($result);

        // Prevent SQL injections
        $SecurityQuestion1 = $input->securityQuestions->q1;
        $SecurityQuestion2 = $input->securityQuestions->q2;
        $SecurityQuestion3 = $input->securityQuestions->q3;
        $SecurityQuestionAns1 = mysqli_real_escape_string($connection,
                                                                $input->securityQuestions->a1);
        $SecurityQuestionAns2 = mysqli_real_escape_string($connection,
                                                                $input->securityQuestions->a2);
        $SecurityQuestionAns3 = mysqli_real_escape_string($connection,
                                                                $input->securityQuestions->a3);
        
        // Create the user's key pair!
        require_once "tool.ssl.php";
        $keys =  generateKeyPair(true);
        $PublicKey = $keys->public;
        $PrivateKey = $keys->private;

        // Update the user's password hash!
        // By doing this, hackers can't use a completed hash table for one user on
        // other user's password hash!
        $PasswordHash = hash("sha256",
                                    encryptPublic($DATABASE_secretSalt1, $PublicKey).
                                        ($input->passwordHash).
                                    encryptPublic($DATABASE_secretSalt2, $PublicKey)
                                );
        executeQueryMySQL($connection, "UPDATE $DATABASE_CoreTABLE__users
                                            SET `PasswordHash` = '$PasswordHash'
                                            WHERE `UID` = $UID");


        // Attempt to register the security questions
        if($UIDStatus && executeQueryMySQL($connection,
                "INSERT INTO `$DATABASE_CoreTABLE__security`
                    (`UID`, `PrivateKey`,  `PublicKey`,
                     `SecurityQuestion1`, `SecurityQuestion2`, `SecurityQuestion3`,
                     `SecurityQuestionAns1`,  `SecurityQuestionAns2`,  `SecurityQuestionAns3`)
                VALUES
                    ($UID,  '$PrivateKey', '$PublicKey',
                     $SecurityQuestion1,  $SecurityQuestion2,  $SecurityQuestion3,
                     '$SecurityQuestionAns1', '$SecurityQuestionAns2', '$SecurityQuestionAns3')"
            )){

            $ProfileVisibility = $input->quickSettings->profile;
            $ActivityMode = $input->quickSettings->activity;
            $Location = $input->quickSettings->location;
            $ColorScheme = $input->quickSettings->colorScheme;

            // Attempt to register the user's preferences
            if(executeQueryMySQL($connection,
                    "INSERT INTO `$DATABASE_CoreTABLE__preferences`
                        (`UID`, `ProfileVisibility`, `ActivityMode`, `Location`,
                         `ColorScheme`)
                    VALUES
                        ($UID,  $ProfileVisibility,  $ActivityMode,  $Location,
                          $ColorScheme)"
                )){

                // Attempt to register the user's system info
                if(!executeQueryMySQL($connection,
                        "INSERT INTO `$DATABASE_CoreTABLE__system`
                            (`UID`)
                        VALUES
                            ($UID)"
                    )){

                    // Delete user data
                    executeQueryMySQL($connection, "DELETE FROM `$DATABASE_CoreTABLE__users`
                                                    WHERE `UID` = $UID");
                    // Delete the username cooldown
                    executeQueryMySQL($connection, "DELETE
                                                    FROM $DATABASE_CoreTABLE__reservedUsernames
                                                    WHERE `IPAddress` = '$CreationIPAddress'");
                    $connection->close();
                    return false;
                }else{
                    // Delete the username cooldown
                    executeQueryMySQL($connection, "DELETE
                                                    FROM $DATABASE_CoreTABLE__reservedUsernames
                                                    WHERE `IPAddress` = '$CreationIPAddress'"
                                                , false);
                }
            }else{
                // Delete user data
                executeQueryMySQL($connection, "DELETE FROM `$DATABASE_CoreTABLE__users`
                                                        WHERE `UID` = $UID");
                // Delete the username cooldown
                executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__reservedUsernames
                                                        WHERE `IPAddress` = '$CreationIPAddress'");
                $connection->close();
                return false;
            }
        }else{
            // Delete user data!
            // Note: all tables with the UID value are linked with the 'users' table! If a row in
            // the 'users' table is deleted, the correlated rows in the other linked tables will
            // also get deleted.
            if(!($UIDStatus && executeQueryMySQL($connection, "DELETE
                                                                FROM `$DATABASE_CoreTABLE__users`
                                                                WHERE `UID` = $UID"))){
                executeQueryMySQL($connection, "DELETE FROM `$DATABASE_CoreTABLE__users`
                                                        WHERE `Username` = '$Username'");
            }
            // Delete the username cooldown
            executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__reservedUsernames
                                                    WHERE `IPAddress` = '$CreationIPAddress'");
            $connection->close();
            return false;
        }
    }else{
        // Delete the username cooldown
        executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__reservedUsernames
                                                WHERE `IPAddress` = '$CreationIPAddress'");
        $connection->close();
        return false;
    }
    $connection->close();
    return true;
}

?>