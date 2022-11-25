<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->fullRequest, "boolean"]
);

// Prepare variables
$ProfilePicutre     = "DEFAULT";
$FirstName          = "[First]";
$LastName           = "[Last]";
$UID                = 0;
$Username           = "username";
$DisplayUsername    = "USERNAME";
$ColorScheme        = 0;
$AccentColor        = "COLOR";
$Lang               = "LANG";

// Check if the user has a valid session going on!
require_once './../../tools/client.info.php';
if(CLIENT_isSessionValid()){
    if($INPUT_DATA->fullRequest){
        require './../../tools/sql.user.data.php';
        $user = getUserDataC();
        $UID                = $user->UID;
        $Username           = $user->Username;
        $DisplayUsername    = $user->DisplayUsername;
        $FirstName          = $user->FirstName;
        $LastName           = $user->LastName;
        $ProfilePicutre     = $user->ProfilePicutre;
        $ColorScheme        = $user->ColorScheme;
        $AccentColor        = $user->AccentColor;
        $Lang               = $user->Lang;
    }else{
        $RESPONSE_SUCCESS_STATUS = false;
        $RESPONSE_TEXT = "Not ready yet!";
        $RESPONSE_CODE = TEMPORARY;
    }
}else{
    $RESPONSE_SUCCESS_STATUS = false;
    $RESPONSE_TEXT = "No active session detected!";
    $RESPONSE_CODE = BLOCKED_REQUEST;
}

?>
{
    "UID": <?php echo $UID; ?>,
    "Username": "<?php echo $Username; ?>",
    "DisplayUsername": "<?php echo $DisplayUsername; ?>",
    "FirstName": "<?php echo $FirstName; ?>",
    "LastName": "<?php echo $LastName; ?>",
    "ProfilePicutre": "<?php echo $ProfilePicutre; ?>",
    "ColorScheme": <?php echo $ColorScheme; ?>,
    "AccentColor": "<?php echo $AccentColor; ?>",
    "Lang": "<?php echo $Lang; ?>",
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}