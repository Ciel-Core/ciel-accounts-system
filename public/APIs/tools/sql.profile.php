<?php

require_once 'sql.database.php';
require_once 'sql.user.data.php';

// List of default profile image colours
global $colors;
$colors = array(
    "red"       => ["#ec3f6b", "#FFFFFF"],
    "blue"      => ["#4e5ce6", "#FFFFFF"],
    "orange"    => ["#ff7642", "#FFFFFF"],
    "yellow"    => ["#dfad35", "#FFFFFF"],
    "green"     => ["#48903e", "#FFFFFF"],
    "purple"    => ["#935fd4", "#FFFFFF"],
    "pink"      => ["#f94d9d", "#FFFFFF"],
    "black"     => ["#818f8f", "#FFFFFF"]
);

// Update default profile image
function updateDefaultProfileSet($UID = NULL){
    global $DATABASE_CoreTABLE__preferences, $DATABASE_CoreTABLE__users, $colors;
    $connection = connectMySQL(DATABASE_READ_AND_WRITE);
    $success = false;

    // Get user ID
    $UID = $UID ?? getUID($connection);

    // Update CustomizationComplete status
    $result = executeQueryMySQL($connection, "SELECT `AccentColor`
                                                FROM $DATABASE_CoreTABLE__preferences
                                                WHERE `UID` = $UID");
    if($result){
        // Get accent colour
        $AccentColor = mysqli_fetch_assoc($result)["AccentColor"];

        // Get dir
        $dir = __DIR__."/../../data/$UID/general/profile";

        // Colour the SVG
        $svg = file_get_contents($dir."/.default");
        $svg = str_replace("@background", $colors[$AccentColor][0], $svg);
        $svg = str_replace("@body", $colors[$AccentColor][1], $svg);
        $svg = str_replace("@inner", $colors[$AccentColor][0], $svg);

        // Save image
        saveProfilePicture($UID, "default-$AccentColor", $svg);

        // Update DB profile picture value
        executeQueryMySQL($connection, "UPDATE $DATABASE_CoreTABLE__users
                                            SET `ProfilePicture` = 'default-$AccentColor'
                                        WHERE `UID` = $UID");

    }
    unset($result);

    $connection->close();
    return $success;
}

// Save image in all needed formats and sizes
function saveProfilePicture($UID, $name, $input){
    $im = new Imagick();
    // Load image
    $im->readImageBlob($input);

    // Create folder for profile picture
    $dir = __DIR__."/../../data/$UID/general/profile/$name";
    mkdir($dir);

    // PNGs in all needed sizes
    // x320
    $im->resizeImage(320, 320, imagick::FILTER_LANCZOS, 1);
    $im->writeImage($dir."/320.png");
    // x196
    $im->resizeImage(196, 196, imagick::FILTER_LANCZOS, 1);
    $im->writeImage($dir."/196.png");
    // x96
    $im->resizeImage(96, 96, imagick::FILTER_LANCZOS, 1);
    $im->writeImage($dir."/96.png");

    // Destroy object
    $im->clear();
    $im->destroy();
}

?>