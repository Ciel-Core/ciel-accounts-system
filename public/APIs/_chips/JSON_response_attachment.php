<?php

{

    global $INPUT_DATA, $RESPONSE_SUCCESS_STATUS, $RESPONSE_CODE, $RESPONSE_TEXT;

    // Print the JSON input data for dev mode
    if($INPUT_DATA->devMode){
        echo '"inputData": ';
        echo json_encode($INPUT_DATA);
        echo ",";
    }

    // Print the responseInfo object
    echo '"responseInfo": {';
    echo    '"successful": ';
    echo        ($RESPONSE_SUCCESS_STATUS) ?
                    'true' :
                    'false';
    echo    ',';
    echo    '"code": ';
    echo        strval($RESPONSE_CODE);
    echo    ',';
    echo    '"text": "';
    echo        $RESPONSE_TEXT;
    echo    '"';
    echo '}';

}

?>