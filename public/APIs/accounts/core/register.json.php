<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->name->first, "string", true, "/^[a-zA-Z]{1,32}$/"],
    [$INPUT_DATA->name->last, "string", true, "/^[a-zA-Z]{1,32}$/"],
    [$INPUT_DATA->username, "string", true, "/^[A-Za-z0-9_]{3,20}$/", "/[a-zA-Z]/"],
    [$INPUT_DATA->passwordHash, "string", false, "/^[a-z0-9]{32}$/"],
    [$INPUT_DATA->birthdate->day, "integer"],
    [$INPUT_DATA->birthdate->month, "integer"],
    [$INPUT_DATA->birthdate->year, "integer"],
    [$INPUT_DATA->gender, "string", true, "/^[a-zA-Z ]{1,32}$/"],
    [$INPUT_DATA->pronounce, "integer", true, "/^[0-2]{1}$/"],
    [$INPUT_DATA->securityQuestions->q1, "integer", false, "/^[1-6]{1}$/"],
    [$INPUT_DATA->securityQuestions->q2, "integer", false, "/^[1-6]{1}$/"],
    [$INPUT_DATA->securityQuestions->q3, "integer", false, "/^[1-6]{1}$/"],
    [$INPUT_DATA->securityQuestions->a1, "string", false, "/^[a-zA-Z0-9!?@#$%&*(). ]{5,255}$/"],
    [$INPUT_DATA->securityQuestions->a2, "string", false, "/^[a-zA-Z0-9!?@#$%&*(). ]{5,255}$/"],
    [$INPUT_DATA->securityQuestions->a3, "string", false, "/^[a-zA-Z0-9!?@#$%&*(). ]{5,255}$/"],
    [$INPUT_DATA->quickSettings->profile, "integer", false, "/^[1-3]{1}$/"],
    [$INPUT_DATA->quickSettings->activity, "integer", false, "/^[1-3]{1}$/"],
    [$INPUT_DATA->quickSettings->location, "integer", false, "/^[1-2]{1}$/"],
    [$INPUT_DATA->quickSettings->colorScheme, "integer", false, "/^[0-2]{1}$/"],
    [$INPUT_DATA->extraData->registrationDisplayLanguage, "string", true, "/^[a-zA-Z-]*$/"],
    [$INPUT_DATA->agreement, "boolean"]
);

// Check if there is an active session
require_once './../../tools/client.info.php';
require_once './../../tools/tool.dates.php';
if(!(CLIENT_isSessionValid())){
    // Check data
    if($INPUT_DATA->agreement){
        // Only do more checks on public data
        $birthdateStr = $INPUT_DATA->birthdate->year."-".$INPUT_DATA->birthdate->month
                            ."-".$INPUT_DATA->birthdate->day; // "year-month-day"
        if(!validateDate($birthdateStr)){
            $RESPONSE_SUCCESS_STATUS = false;
            $RESPONSE_TEXT = "Invalid birth date!";
            $RESPONSE_CODE = INVALID_DATA;
        }else if($INPUT_DATA->birthdate->year < ($DATE_currentYear - 120) ||
                    $INPUT_DATA->birthdate->year > $DATE_currentYear){
            $RESPONSE_SUCCESS_STATUS = false;
            $RESPONSE_TEXT = "Invalid birth year!";
            $RESPONSE_CODE = INVALID_DATA;
        }else if(dateDiffY($birthdateStr, $DATE_current) < 13){
            $RESPONSE_SUCCESS_STATUS = false;
            $RESPONSE_TEXT = "Must be 13+ years old to register!";
            $RESPONSE_CODE = BLOCKED_DATA;
        }else if($INPUT_DATA->gender[strlen($INPUT_DATA->gender) - 1] == " " ||
                $INPUT_DATA->gender[0] == " " ||
                strpos($INPUT_DATA->gender, "  ") !== false){
            $RESPONSE_SUCCESS_STATUS = false;
            $RESPONSE_TEXT =
                "Gender can't start or end with whitespace or contain consecutive whitespaces!";
            $RESPONSE_CODE = INVALID_DATA;
        }else{
            require './../../tools/filter.reserved.php';
            if(!($RESERVE_FILTER__status)){
                responseReport(BACKEND_ERROR, "Couldn't load reserved usernames list!");
            }
            require './../../tools/sql.username.php';
            require './../../tools/sql.register.php';
    
            if(checkUsernameRS($INPUT_DATA->username)){
                $RESPONSE_SUCCESS_STATUS = false;
                $RESPONSE_TEXT = "Username reserved by the system!";
                $RESPONSE_CODE = BLOCKED_DATA;
            }else if(usernameExists($INPUT_DATA->username) != "0"){
                $RESPONSE_SUCCESS_STATUS = false;
                $RESPONSE_TEXT = "Username in-use!";
                $RESPONSE_CODE = BLOCKED_DATA;
            }else if(usernameOnCooldown($INPUT_DATA->username)){
                $RESPONSE_SUCCESS_STATUS = false;
                $RESPONSE_TEXT = "Username on cooldown!";
                $RESPONSE_CODE = BLOCKED_DATA;
            }else if(!(registerUser($INPUT_DATA))){ // User input seems fine, attempt
                                                    // to register the user
                $RESPONSE_SUCCESS_STATUS = false;
                $RESPONSE_TEXT = "Couldn't register user!";
                $RESPONSE_CODE = BACKEND_ERROR;
            }
        }
    }else{
        $RESPONSE_SUCCESS_STATUS = false;
        $RESPONSE_TEXT = "Missing user agreement!";
        $RESPONSE_CODE = MISSING_DATA;
    }
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "Can't register users on devices with active sessions!";
    $RESPONSE_CODE = BLOCKED_REQUEST;
}

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}