<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->richData, "boolean"]
);

// Get client info
require './../../tools/client.info.php';
require_once './../../tools/sql.sessions.php';
require_once './../../tools/tool.dates.php';

$Sessions = array();
$LocalID = 0;
if(CLIENT_isSessionValid()){
    // Get the local ID of the current session
    $LocalID = getSessionLocalID();
    // Get sessions list
    $Sessions = listActiveSessions($INPUT_DATA->richData);
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "No valid on-going sessions!";
    $RESPONSE_CODE = BLOCKED_REQUEST;
}

?>
{
    "localID": <?php echo strval($LocalID); ?>,
    "sessions": [
        <?php
            $i = 0;
            while($i < count($Sessions)){
                "`LocalID`, `StartTimestamp`, `UserAgent`";
                echo '{';
                echo    '"localID":';
                echo        strval($Sessions[$i]["LocalID"]);
                echo    ',';
                echo    '"startTimestamp":';
                echo        strval(strToTimestamp($Sessions[$i]["StartTimestamp"]));
                echo    ',';
                echo    '"userAgent": "';
                echo        strval($Sessions[$i]["UserAgent"]);
                echo    '"';
                if($INPUT_DATA->richData){
                    echo ',';
                    echo '"ipAddress": "';
                    echo    strval($Sessions[$i]["IPAddress"]);
                    echo '",';
                    echo '"location": {';
                    echo    '"country": "';
                    echo        strval($Sessions[$i]["Country"]);
                    echo    '",';
                    echo    '"region": "';
                    echo        strval($Sessions[$i]["Region"]);
                    echo    '",';
                    echo    '"city": "';
                    echo        strval($Sessions[$i]["City"]);
                    echo    '"';
                    echo '}';
                }
                echo '}';
                $i++;
                if($i < count($Sessions)){
                    echo ',';
                }
            }
        ?>
    ],
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}