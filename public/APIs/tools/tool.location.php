<?php

function getLocationFromIP($IPAddress){
    $return = (object)array(
        "city"     => "Unknown",
        "region"   => "Unknown",
        "country"  => "??",
        "loc"      => "0,0"
    );

    // Get location info from external server
    global $TOKEN_IPInfo;
    $response = file_get_contents("http://ipinfo.io/$IPAddress?token=$TOKEN_IPInfo");
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
    return $return;
}

?>