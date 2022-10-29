<?php

// Fail report
function reportFailedInputDataCheck($code, $text){
    global $RESPONSE_SUCCESS_STATUS, $RESPONSE_CODE, $RESPONSE_TEXT;
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_CODE = $code;
    $RESPONSE_TEXT = $text;
    echo '{';
    require 'JSON_response_attachment.php';
    exit("}");
}

// Get the profanity filter
require './../../tools/filter.profanity.php';

// Check if the profanity filter is working or not
if(!($PROFANITY_FILTER_status)){
    reportFailedInputDataCheck(BACKEND_ERROR, "Profanity filter failed to load!");
}

// Check the input data for presence and SQL injections
// [data, expected_type, is_public], [...], [...], ...
function checkInputData(...$data){
    foreach($data as $arg){
        // Check if the data exists
        if(!isset($arg[0]) || is_null($arg[0])){
            reportFailedInputDataCheck(MISSING_DATA, "Missing data!");
        }else if(gettype($arg[0]) != $arg[1]){ // Check if the data type is as expected
            reportFailedInputDataCheck(INVALID_DATA, "Invalid data type detected!");
        }else if(strip_tags($arg[0]) != $arg[0]){ // Check for HTML injections
            reportFailedInputDataCheck(BLOCKED_DATA, "HTML/JS injection detected!");
        }else if($arg[1] == "string"){ // Special string checks
            if($arg[2] && checkProfanity($arg[0])){ // Prevent profanity in public data
                reportFailedInputDataCheck(BLOCKED_DATA, "Profanity detected in 'public' data!");
            }else if($arg[2] && preg_match('/(http|ftp|mailto)/', $arg[0])){ // Block URLs
                reportFailedInputDataCheck(BLOCKED_DATA, "URL detected in 'public' data!");
            }else if(preg_match("/[\r\t\n]/", $arg[0])){ // ?
                reportFailedInputDataCheck(BLOCKED_DATA, "Unsafe characters detected!");
            }
        }
        // Check if the data follows the expected patterns
        for($i = 0; $i < sizeof($data) - 3; $i++){
            if(gettype($arg[3 + $i]) == "string" && !(preg_match($arg[3 + $i], $arg[0]))){
                reportFailedInputDataCheck(INVALID_DATA, "Data doesn't follow the expected pattern!");
            }
        }
    }
}

?>