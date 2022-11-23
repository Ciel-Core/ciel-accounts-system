<?php
// Modify limits
set_time_limit(0);
ini_set('auto_detect_line_endings', 1);
ini_set('mysql.connect_timeout','7200');
ini_set('max_execution_time', '0');

// Update timezone
date_default_timezone_set('Asia/Jerusalem');
ob_end_clean();
gc_enable();

// Mark this as an event stream!
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Access-Control-Allow-Credentials: false');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Expose-Headers: X-Events');  

// Import needed libraries
require_once './../APIs/tools/data.secret.php';
require_once './../APIs/tools/tool.dates.php';
require_once './../APIs/tools/sql.database.php';
require_once './../APIs/tools/sql.user.data.php';

// Connect to the core_accounts database
$coreAccountsDB = connectMySQL(DATABASE_READ_ONLY, false);
if($coreAccountsDB->connect_error){
    exit();
}

// Get User ID
global $UID;
$UID = getUID($coreAccountsDB, false, false);
if(gettype($UID) != "string" || strlen($UID) < 11){
    exit();
}

// Define query function
function getTS($db, $table){
    global $UID;
    $timestamp = 0;
    $result = executeQueryMySQL($db, 
                "SELECT `UpdateTimestamp` FROM $table WHERE `UID` = $UID",
            false);
    if($result){
        $timestamp = strToTimestamp(mysqli_fetch_assoc($result)["UpdateTimestamp"]);
        unset($result);
    }else{
        exit();
    }
    return $timestamp;
}

// Keep track of update timestamps
global $ts;
$ts = json_decode('{
    "CORE_ACCOUNTS": {
        "USERS": 0,
        "PREFERENCES": 0,
        "SESSIONS": 0
    }
}', true);
$ts["CORE_ACCOUNTS"]["USERS"] = time();
$ts["CORE_ACCOUNTS"]["PREFERENCES"] = time();
$ts["CORE_ACCOUNTS"]["SESSIONS"] = time();

// Keep track of flush state
global $needFlush;
$needFlush = false;

// Send a server-data-update event
global $started;
$started = false;
function serverDataUpdate($db, $t){
    // Update flush status
    global $needFlush;
    $needFlush = true;
    // Update timestamp
    global $ts;
    $ts[$db][$t] = time();
    // Print event info
    global $started;
    if(!$started){
        echo "event: server-data-update\r\n";
        echo "retry:1000\r\n";
        echo 'data: '.$db.'.'.$t;
        $started = true;
    }else{
        // Print data
        echo 'data: ,'.$db.'.'.$t;
    }
    echo "\r\n\r\n";
}

// Loop!
$c = 1;
while(true){
    // Check connection state
    if(connection_status() != CONNECTION_NORMAL || connection_aborted()){
        $coreAccountsDB->close();
        break;
        exit();
    }

    // Get global variables
    global $needFlush,
           $ts;

    // server-data-update event
    {
        // Send user details data update ping
        if(getTS($coreAccountsDB, $DATABASE_CoreTABLE__users) > $ts["CORE_ACCOUNTS"]["USERS"] ||
            getTS($coreAccountsDB, $DATABASE_CoreTABLE__users) == 0){
            serverDataUpdate("CORE_ACCOUNTS", "USERS");
        }
        if(getTS($coreAccountsDB, $DATABASE_CoreTABLE__preferences) > $ts["CORE_ACCOUNTS"]["PREFERENCES"] ||
            getTS($coreAccountsDB, $DATABASE_CoreTABLE__preferences) == 0){
            serverDataUpdate("CORE_ACCOUNTS", "PREFERENCES");
        }
        if(getTS($coreAccountsDB, $DATABASE_CoreTABLE__sessions) > $ts["CORE_ACCOUNTS"]["SESSIONS"] ||
            getTS($coreAccountsDB, $DATABASE_CoreTABLE__sessions) == 0){
            serverDataUpdate("CORE_ACCOUNTS", "SESSIONS");
        }
    }

    // flush the output buffer and send echoed messages to the browser
    if($needFlush){
        if( @ob_get_level() > 0 ) for( $i=0; $i < @ob_get_level(); $i++ ) @ob_flush();
        @flush();
        $needFlush = false;
        // Sleep for 5 seconds
        sleep(5);
    }else{
        // Sleep for 1 second
        sleep(1);
    }

    // Reset $started variable
    global $started;
    if($started){
        $started = false;
    }

    // reduce memory leaks
    $c++;
    if($c % 1000 == 0){
        gc_collect_cycles();
        $c = 1;
    }
}
?>