<?php

{

    global $INPUT_DATA, $RESPONSE_SUCCESS_STATUS, $RESPONSE_CODE, $RESPONSE_TEXT,
            $DEV_MODE;

    // Print the JSON input data for dev mode
    if($DEV_MODE){
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
    echo        addcslashes($RESPONSE_TEXT, '"');
    echo    '"';
    echo '}';

}

?>