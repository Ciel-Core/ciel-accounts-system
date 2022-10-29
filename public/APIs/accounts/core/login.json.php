<?php

// Initiate the page
require './../../_chips/comb.start_inputJSON.php';

// Do a basic check for the input data!
checkInputData(
    [$INPUT_DATA->username, "string"],
    [$INPUT_DATA->password, "string"]
);

?>
{
    <?php require './../../_chips/JSON_response_attachment.php'; ?>
}