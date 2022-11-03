<?php

$DATE_currentYear = (int)date("Y");
$DATE_current = new DateTime();

function validateDate($date, $format = 'Y-n-j'){
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) === $date;
}

// Get dates difference in years
function dateDiffY($date1, $date2, $format = "Y-n-j"){
    if(gettype($date1) == "string"){
        $date1 = DateTime::createFromFormat($format, $date1);
    }
    if(gettype($date2) == "string"){
        $date2 = DateTime::createFromFormat($format, $date2);
    }
    return ($date1->diff($date2))->y;
}

function strToTimestamp($StrTimestamp){
    $timestamp = DateTime::createFromFormat('Y-m-d H:i:s', $StrTimestamp);
    if($timestamp === false){
        $timestamp = 0;
    }else{
        $timestamp = $timestamp->getTimestamp();
    }
    return $timestamp;
}

?>