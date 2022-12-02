<?php
// Modify limits
set_time_limit(0);
ini_set('session.gc_maxlifetime', '3600');
ini_set('auto_detect_line_endings', 1);
ini_set('mysql.connect_timeout','7200');
ini_set('max_execution_time', '0');

// Update timezone
// date_default_timezone_set('SYSTEM');

ob_end_clean();
gc_enable();

// Mark this as an event stream!
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Access-Control-Allow-Credentials: false');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Expose-Headers: X-Events');  

// Define flush function
function flushContent(){
    if( @ob_get_level() > 0 ) for( $i=0; $i < @ob_get_level(); $i++ ) @ob_flush();
    @flush();
}

// Print an event
function issueEvent($n, $d, $f = false){
    // Print event info
    echo "event: ".$n."\r\n";
    echo "retry: 2000\r\n";
    echo 'data: '.$d;
    if($f){
        echo "\r\n\r\n";
        flushContent();
    }
}

// Send server errors to client
function serverErrorUpdate($e){
    // Print event info
    issueEvent("server-error", $e, true);
}

// Close connection
// 0 - allow user to use service without reconnecting,
// 1 - prompt user to reconnect
function closeConnection($d){
    issueEvent("server-close", $d, true);
    sleep(1);
    exit();
}

// Import needed libraries
require_once './../../APIs/tools/data.secret.php';
require_once './../../APIs/tools/tool.dates.php';
require_once './../../APIs/tools/sql.database.php';
require_once './../../APIs/tools/sql.user.data.php';

// Connect to the core_accounts database
$coreAccountsDB = connectMySQL(DATABASE_READ_ONLY, false);
if($coreAccountsDB->connect_error){
    serverErrorUpdate("CONNNECT.DB.CORE_ACCOUNTS");
    closeConnection("0");
}

// Get User ID and session ID
global $UID, $coreAccountsSID;
$coreAccountsSID = mysqli_real_escape_string($coreAccountsDB, $_COOKIE["SID"]);
$UID = getUID($coreAccountsDB, false, false);
if(gettype($UID) != "string" || strlen($UID) < 11){
    serverErrorUpdate("DATA.UID");
    closeConnection("1");
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
        serverErrorUpdate("DATA.TIMESTAMP");
        closeConnection("1");
    }
    return $timestamp;
}
function getTSbySID($db, $table){
    global $coreAccountsSID;
    $timestamp = 0;
    $result = executeQueryMySQL($db, 
                "SELECT `UpdateTimestamp` FROM $table WHERE `SID` = '$coreAccountsSID'",
            false);
    if($result){
        $timestamp = strToTimestamp(mysqli_fetch_assoc($result)["UpdateTimestamp"]);
        unset($result);
    }else{
        serverErrorUpdate("DATA.TIMESTAMP");
        closeConnection("1");
    }
    return $timestamp;
}

// Keep track of update timestamps
global $ts;
$ts = json_decode('{
    "CORE_ACCOUNTS": {
        "USERS": 0,
        "PREFERENCES": 0,
        "SESSIONS": 0,
        "SYSTEM": 0
    }
}', true);
if(isset($_GET["zero"])){
    $ts["CORE_ACCOUNTS"]["USERS"]       = 0;
    $ts["CORE_ACCOUNTS"]["PREFERENCES"] = 0;
    $ts["CORE_ACCOUNTS"]["SESSIONS"]    = 0;
    $ts["CORE_ACCOUNTS"]["SYSTEM"]      = 0;
}else{
    $ts["CORE_ACCOUNTS"]["USERS"]       = getTS($coreAccountsDB, $DATABASE_CoreTABLE__users);
    $ts["CORE_ACCOUNTS"]["PREFERENCES"] = getTS($coreAccountsDB, $DATABASE_CoreTABLE__preferences);
    $ts["CORE_ACCOUNTS"]["SESSIONS"]    = getTS($coreAccountsDB, $DATABASE_CoreTABLE__sessions);
    $ts["CORE_ACCOUNTS"]["SYSTEM"]      = getTS($coreAccountsDB, $DATABASE_CoreTABLE__system);
}

// Keep track of flush state
global $needFlush;
$needFlush = false;

// Send a server-data-update event
global $started;
$started = false;
function serverDataUpdate($db, $t, $dbT){
    // Update flush status
    global $needFlush;
    $needFlush = true;
    // Update timestamp
    global $ts;
    $ts[$db][$t] = $dbT;
    // Print event info
    global $started;
    if(!$started){
        issueEvent("server-data-update", $db.'.'.$t);
        $started = true;
    }else{
        // Print data
        echo ','.$db.'.'.$t;
    }
}

// Do a test event
issueEvent("server-open", NULL, true);

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
        if((($t = getTS($coreAccountsDB, $DATABASE_CoreTABLE__users)) > $ts["CORE_ACCOUNTS"]["USERS"]) ||
            (($t = getTS($coreAccountsDB, $DATABASE_CoreTABLE__users)) == 0 && $ts["CORE_ACCOUNTS"]["USERS"] != 0)){
            serverDataUpdate("CORE_ACCOUNTS", "USERS", $t);
        }
        if((($t = getTS($coreAccountsDB, $DATABASE_CoreTABLE__preferences)) > $ts["CORE_ACCOUNTS"]["PREFERENCES"]) ||
            (($t = getTS($coreAccountsDB, $DATABASE_CoreTABLE__preferences)) == 0 && $ts["CORE_ACCOUNTS"]["PREFERENCES"] != 0)){
            serverDataUpdate("CORE_ACCOUNTS", "PREFERENCES", $t);
        }
        if((($t = getTSbySID($coreAccountsDB, $DATABASE_CoreTABLE__sessions)) > $ts["CORE_ACCOUNTS"]["SESSIONS"]) ||
            (($t = getTSbySID($coreAccountsDB, $DATABASE_CoreTABLE__sessions)) == 0 && $ts["CORE_ACCOUNTS"]["SESSIONS"] != 0)){
            serverDataUpdate("CORE_ACCOUNTS", "SESSIONS", $t);
        }
        if((($t = getTS($coreAccountsDB, $DATABASE_CoreTABLE__system)) > $ts["CORE_ACCOUNTS"]["SYSTEM"]) ||
            (($t = getTS($coreAccountsDB, $DATABASE_CoreTABLE__system)) == 0 && $ts["CORE_ACCOUNTS"]["SYSTEM"] != 0)){
            serverDataUpdate("CORE_ACCOUNTS", "SYSTEM", $t);
        }
        unset($t);
    }

    // flush the output buffer and send echoed messages to the browser
    if($needFlush){
        echo "\r\n\r\n";
        flushContent();
        $needFlush = false;
        // Sleep for 4 seconds
        sleep(4);
    }else{
        // Sleep for 2 seconds
        sleep(2);
        // Do a server test every ~20 seconds
        // You need this to detect when the user closes the website
        if($c % 10 == 0){
            issueEvent("server-test", "", true);
        }
    }

    // Reset $started variable
    global $started;
    if($started){
        $started = false;
    }

    // reduce memory leaks
    $c++;
    if($c == 500){
        gc_collect_cycles();
        $c = 1;
    }
}
?>