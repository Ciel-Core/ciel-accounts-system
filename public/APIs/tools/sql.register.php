<?php

require_once 'sql.database.php';

// Delete waste data
function deleteRegisterFailWaste($connection, $CreationIPAddress, $UID, $Username = ''){
    global $DATABASE_CoreTABLE__users;
    // Delete user data!
    // Note: all tables with the UID value are linked with the 'users' table! If a row in
    // the 'users' table is deleted, the correlated rows in the other linked tables will
    // also get deleted.
    executeQueryMySQL($connection, "DELETE FROM `$DATABASE_CoreTABLE__users`
                                            WHERE `UID` = $UID
                                            OR `Username` = '$Username'", false);
    // Delete other waste data
    deleteRegisterWaste($connection, $CreationIPAddress);
}
function deleteRegisterWaste($connection, $CreationIPAddress){
    global $DATABASE_CoreTABLE__reservedUsernames;
    // Delete the username cooldown
    executeQueryMySQL($connection, "DELETE FROM $DATABASE_CoreTABLE__reservedUsernames
                                            WHERE `IPAddress` = '$CreationIPAddress'", false);
}

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
        $keys = generateKeyPair(true, false);
        if(!($keys)){
            // Delete user data
            deleteRegisterFailWaste($connection, $CreationIPAddress, $UID, $Username);
            $connection->close();
            // Report error!
            responseReport(BACKEND_ERROR, "Couldn't generate user key pair!");
        }
        $PublicKey = $keys->public;
        $PrivateKey = $keys->private;

        // Update the user's password hash!
        // By doing this, hackers can't use a completed hash table for one user on
        // other user's password hash!
        $PasswordHash = hash("sha256",
                                    dataScatter($DATABASE_secretSalt1, $PublicKey).
                                        ($input->passwordHash).
                                    dataScatter($DATABASE_secretSalt2, $PublicKey)
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
                    deleteRegisterFailWaste($connection, $CreationIPAddress, $UID, $Username);

                    $connection->close();
                    return false;
                }else{
                    // Delete waste data
                    deleteRegisterWaste($connection, $CreationIPAddress);

                    // Take care of things that are not related to the database!
                    finalizeUserRegistration($connection, $UID);
                }
            }else{
                // Delete user data
                deleteRegisterFailWaste($connection, $CreationIPAddress, $UID, $Username);
                $connection->close();
                return false;
            }
        }else{
            // Delete user data!
            // Note: all tables with the UID value are linked with the 'users' table! If a row in
            // the 'users' table is deleted, the correlated rows in the other linked tables will
            // also get deleted.
            deleteRegisterFailWaste($connection, $CreationIPAddress, $UID, $Username);
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

// Report the current level of registration finalisation
global $finalizeProgressCount;
$finalizeProgressCount = 0;
function reportFinalizeProgress($connection, $UID, $c = NULL){
    global $DATABASE_CoreTABLE__system, $finalizeProgressCount;
    $finalizeProgressCount++;
    // Enable change of value through function input
    if($c != NULL){
        $finalizeProgressCount = $c;
    }
    // Update database value
    executeQueryMySQL($connection, "UPDATE $DATABASE_CoreTABLE__system
                                        SET `FinalizedUserRegistration` = $finalizeProgressCount
                                    WHERE `UID` = $UID", true);

}

// Take care of non-SQL registration process
// Note that failures within this process are not allowed to result in a "unsuccessful response
// status" from the server!
function finalizeUserRegistration($connection, $UID){
    // To finalize the user's registration, a unique user folder must be created with the provided
    // "_UID" user folder template in "/data"!
    include_once "tool.files.php";
    $root = __DIR__."/../../data";
    xcopy($root."/_UID", $root."/$UID");
    // Report folder creation success!
    reportFinalizeProgress($connection, $UID);

    // Update $root value
    $root = __DIR__."/../../data/$UID";

    // Generate a unique profile picture!
    // Note: The user's *default profile picture* can never be changed at all!
    // https://dicebear.com/styles/thumbs
    $thumb = file_get_contents("https://api.dicebear.com/5.x/thumbs/svg?".
        // Set the colours
        "backgroundColor=ff0000".
        "&shapeColor=0000ff".
        "&eyesColor=00ff00".
        "&mouthColor=00ff00".

        // Make sure the face doesn't get cut off
        "&faceOffsetX=0".
        "&faceOffsetY=0".
        "&scale=80".
        "&radius=0".

        // Randomise output
        "&rotate=".
            strval(
                // Base the image rotation on the user's ID
                (30 * ($UID % 2 + 1))
                * $UID
                // 360deg value
                % 360).
        "&seed=".
            md5('ciel:'.$UID)
    );
    // The generated SVG image will be saved, with the following strings being replaced:
    //     #ff0000 -> @background
    //     #0000ff -> @body
    //     #00ff00 -> @inner
    $thumb = str_replace("#ff0000", "@background", $thumb);
    $thumb = str_replace("#0000ff", "@body", $thumb);
    $thumb = str_replace("#00ff00", "@inner", $thumb);
    // The user's profile picture colours are linked to the user's prefered accent colour!
    // Save the output for future image generation
    file_put_contents("$root/general/profile/.default", $thumb);
    // Report "default profile picture template" creation success!
    reportFinalizeProgress($connection, $UID);

    // Set the account finalisation status as successful
    reportFinalizeProgress($connection, $UID, 100);
}

?>