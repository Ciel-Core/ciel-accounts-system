<?php

global  $DATABASE_serverName, $DATABASE_name, $DATABASE_username_RW, $DATABASE_username_R,
        $DATABASE_username_W, $DATABASE_password_RW, $DATABASE_password_R, $DATABASE_password_W,
        $DATABASE_secretSault1, $DATABASE_secretSault2;

$DATABASE_serverName   = $_SERVER['HTTP_HOST']; // The server name
$DATABASE_name = "core_accounts"; // Database name
$DATABASE_username_RW  = "usernameRW"; // Read and write permissions
$DATABASE_username_R   = "usernameR"; // read-only permissions
$DATABASE_username_W   = "usernameW"; // write-only permissions
$DATABASE_password_RW  = "passwordRW";
$DATABASE_password_R   = "passwordR";
$DATABASE_password_W   = "passwordW";

// Extra
$DATABASE_secretSault1 = "XXXXXXXXXXXXXXXXXXXXXXXX";
$DATABASE_secretSault2 = "XXXXXXXXXXXXXXXXXXXXXXXX";

?>