<?php

// Attempt to register the user in the databse
// return TRUE on success, FALSE on failure
function registerUser($input){
    //ucwords(strtolower($input->gender));
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