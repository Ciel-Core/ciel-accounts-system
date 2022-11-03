<?php

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*\

           “
              𝑅𝑒𝓂𝑒𝓂𝒷𝑒𝓇,
                  𝓉𝒽𝒾𝓈 𝒻𝒾𝓁𝑒 𝒾𝓈 ✨𝓹𝓾𝓫𝓵𝓲𝓬✨!
                                               ”

.~~                     .~~~~~~~~~.                     ~~.
/                                                        /
\                                                        \
/                                                        /
\         Do NOT past ANYTHING into this file!           \
/                                                        /
\         First, make a copy of this file.               \
/         After that, rename the new file to:            /
\         'data.secret.php'                              \
/                                                        /
\         You can enter your information ONLY            \
/         AFTER RENAMING THE FILE!                       /
\                                                        \
/                                                        /
\         Have fun!                                      \
/                                                        /
\                                                        \
/                                                        /
.~~                     .~~~~~~~~~.                     ~~.

                               - Safey Cat
                                              ／l、
                                            （ﾟ､ ｡ ７
                                             l、~ ヽﾉｼ
                                             じじと ）
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// All variables here should be global!
global $STATE_HOSTED_LOCALLY,

// Database-related secret variables
$DATABASE_serverName, $DATABASE_name,
$DATABASE_username_RW, $DATABASE_password_RW,
$DATABASE_username_R, $DATABASE_password_R,
$DATABASE_username_W, $DATABASE_password_W,
$DATABASE_secretSault1,
$DATABASE_secretSault2,

// Secret tokens (for used third-party services)
$TOKEN__IPInfo;

// Server state
$STATE_HOSTED_LOCALLY = ($_SERVER['SERVER_NAME'] === "localhost");

// Don't forget to update the values!

// core_accounts database
/*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*/
if($STATE_HOSTED_LOCALLY){    /*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*/
$DATABASE_serverName            =    $_SERVER['HTTP_HOST'].':PORT';        /*-*/
$DATABASE_name                  =    "core_accounts";                      /*-*/
$DATABASE_username_RW           =    "username"; // Read and write         /*-*/
$DATABASE_password_RW           =    "password";                           /*-*/
$DATABASE_username_R            =    "username"; // read-only              /*-*/
$DATABASE_password_R            =    "password";                           /*-*/
$DATABASE_username_W            =    "username"; // write-only             /*-*/
$DATABASE_password_W            =    "password";                           /*-*/
/*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*/
}else{    /*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*/
/*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*/
$DATABASE_serverName            =    $_SERVER['HTTP_HOST'].':PORT';        /*-*/
$DATABASE_name                  =    "core_accounts";                      /*-*/
$DATABASE_username_RW           =    "username"; // Read and write         /*-*/
$DATABASE_password_RW           =    "password";                           /*-*/
$DATABASE_username_R            =    "username"; // read-only              /*-*/
$DATABASE_password_R            =    "password";                           /*-*/
$DATABASE_username_W            =    "username"; // write-only             /*-*/
$DATABASE_password_W            =    "password";                           /*-*/
}    /*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*/
/*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*//*-*/

// Database password saults
$DATABASE_secretSault1          =    "XXXXXXXXXXXXXXXXXXXXXXXX";
$DATABASE_secretSault2          =    "XXXXXXXXXXXXXXXXXXXXXXXX";

// IPInfo service token (https://ipinfo.io/account/home)
$TOKEN_IPInfo                   =    "your_access_token";

?>