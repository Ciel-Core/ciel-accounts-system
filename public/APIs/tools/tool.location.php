<?php

function getLocationFromIP($IPAddress, $timezoneOffset, $UID){
    $return = (object)array(
        "city"           => "Unknown",
        "region"         => "Unknown",
        "country"        => "??",
        "loc"            => "NULL,NULL",
        "timezoneOffset" => 0
    );

    // Check if the user wants location data to be collected!
    global $DATABASE_CoreTABLE__preferences;
    $connection = connectMySQL(DATABASE_READ_ONLY);
    $dbUID = mysqli_real_escape_string($connection, $UID);
    $result = executeQueryMySQL($connection,
                "SELECT `Location` FROM $DATABASE_CoreTABLE__preferences WHERE `UID` = '$dbUID'");
    $collectLocationData = false;
    if($result){
        $collectLocationData = ((int)mysqli_fetch_assoc($result)["Location"] == 1);
    }else{
        responseReport(BACKEND_ERROR, "Couldn't get user's location preference!");
    }

    // Get location info from external server
    if($collectLocationData){
        $return->timezoneOffset = $timezoneOffset;
        global $TOKEN_IPInfo, $STATE_HOSTED_LOCALLY;
        $response = file_get_contents(
                ($STATE_HOSTED_LOCALLY) ?
                    "http://ipinfo.io/$IPAddress/json" :
                    "http://ipinfo.io/$IPAddress?token=$TOKEN_IPInfo");
        if($response != false){
            $response = json_decode($response);
            // Only keep the needed data
            if(isset($response->city))
                $return->city     = $response->city;
            if(isset($response->region))
                $return->region   = $response->region;
            if(isset($response->country))
                $return->country  = $response->country;
            if(isset($response->loc))
                $return->loc      = $response->loc;
            unset($response);
        }else{
            responseReport(BACKEND_ERROR, "Couldn't detect user's location");
        }
    }
    return $return;
}

?>