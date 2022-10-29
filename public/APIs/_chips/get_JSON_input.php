<?php

// Takes raw data from the request
$INPUT_STRING = file_get_contents('php://input');

// Converts it into a PHP object
$INPUT_DATA = json_decode($INPUT_STRING);

?>