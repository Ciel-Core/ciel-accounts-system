<?php

if(!function_exists("connectMySQL"))
    require 'sql.database.php';

// Attempt to register the user in the databse
// return TRUE on success, FALSE on failure
function registerUser($input){
    global $DATABASE_CoreTABLE__preferences, $DATABASE_CoreTABLE__security,
        $DATABASE_CoreTABLE__users;
    $connection = connectMySQL();
    $DATABASE_CoreTABLE__preferences;
    $DATABASE_CoreTABLE__security;
    $DATABASE_CoreTABLE__users;

    // Prevent SQL injections
    require 'client.info.php';
    $Username = mysqli_real_escape_string($connection, strtolower($input->username));
    $DisplayUsername = mysqli_real_escape_string($connection, $input->username);
    $PasswordHash = mysqli_real_escape_string($connection, $input->passwordHash);
    $FirstName = mysqli_real_escape_string($connection, $input->name->first);
    $LastName = mysqli_real_escape_string($connection, $input->name->last);
    $Birthdate = $input->birthdate->year."-".$input->birthdate->month."-".$input->birthdate->day;
    $GenderName = mysqli_real_escape_string($connection, ucwords(strtolower($input->gender)));
    $Pronounce = $input->pronounce;
    $Lang = mysqli_real_escape_string($connection, $input->extraData->registrationDisplayLanguage);

    // Attempt to register basic user info 
    if(executeQueryMySQL($connection,
            "INSERT INTO `$DATABASE_CoreTABLE__users`
                (`Username`,  `DisplayUsername`,  `CreationIPAddress`, `PasswordHash`,  `FirstName`,
                 `LastName`,  `Birthdate`,  `GenderName`, `Pronounce`, `Lang`)
            VALUES
                ('$Username', '$DisplayUsername', '$CLIENT_IPAddress', '$PasswordHash', '$FirstName',
                 '$LastName', '$Birthdate', '$GenderName', $Pronounce, '$Lang')"
        )){
        //
    }else{
        $connection->close();
        return false;
    }
    //INSERT INTO table_name (column1,column2,………….) VALUES (value1,value2,………….) 
    /*
UID
CreationDate
ProfilePicutre

$input->securityQuestions->q1
$input->securityQuestions->q2
$input->securityQuestions->q3
$input->securityQuestions->a1
$input->securityQuestions->a2
$input->securityQuestions->a3
$input->quickSettings->profile
$input->quickSettings->activity
$input->quickSettings->location
$input->quickSettings->colorScheme
$input->extraData->registrationDisplayLanguage
$input->agreement
*/
    $connection->close();
    return true;
}

/*

(table) users:

    UID:

    Username:

    creationDate:

    creationIPAddress:

    PasswordHash:

    FirstName:
    LastName:

    profilePicutre:

    Birthdate:

    GenderName:
    Pronounce:

    Language:

(table) preferences:

    UID:

    ProfileVisibility:

    ActivityMode:

    LocationType:

    colourScheme

(table) security:

    UID:

    SecurityQuestion1:
    SecurityQuestion2:
    SecurityQuestion3:

    SecurityQuestionAns1:
    SecurityQuestionAns2:
    SecurityQuestionAns3:

(table) sessions:

    SID:

    UID:

    TimeoutTimestamp:

    Country:
    Region:
    City:
    Timezone:
    LocationCoordinates:

    UserAgent:

(table) trustedDevices:

    UID:

    DeviceID:

    CredentialID:
    PublicKey:

    DeviceName:

    Environment:

(table) reservedUsernames:

    IPAddress:

    Username:

    TimeoutTimestamp:

*/

?>