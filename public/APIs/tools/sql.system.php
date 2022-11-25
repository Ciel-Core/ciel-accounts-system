<?php

require_once 'sql.database.php';
require_once 'sql.user.data.php';

function setAsCustomized(){
    global $DATABASE_CoreTABLE__system;
    $connection = connectMySQL(DATABASE_READ_AND_WRITE);

    // Get user ID
    $UID = getUID($connection);

    // Update CustomizationComplete status
    $result = executeQueryMySQL($connection, "UPDATE $DATABASE_CoreTABLE__system SET `CustomizationComplete` = 1 WHERE `UID` = $UID", false);
    $return = !!($result);
    unset($result);

    $connection->close();
    return $return;
}

?>