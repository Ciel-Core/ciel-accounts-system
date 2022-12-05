<?php

// Load XML functions
require_once "tool.xml.php";

// Load server info
require_once "server.info.php";

// Load WebAuthn library
require_once "$SERVER_ROOT/libraries/WebAuthn/WebAuthn.php";

// Load CabArchive library
require_once "$SERVER_ROOT/libraries/BinaryStream/BinaryStream.php";
require_once "$SERVER_ROOT/libraries/CabArchive/CabArchive.php";

global $updateXMLCertificateFile;
$updateXMLCertificateFile = false;

// External communication
function saveTemporaryFile($url){
    global $G_SERVER_ROOT;
    // Get temporary folder
    $TmpFolderPath = "$G_SERVER_ROOT/certificates/tmp";
    if(!is_dir($TmpFolderPath)){
        mkdir($TmpFolderPath);
    }
    // Save file, and return temporary path
    $N = rand(100000000, 999999999);
    $filePath = "$TmpFolderPath/$N.tmp";
    file_put_contents($filePath, file_get_contents($url));
    return $filePath;
}
function emptyTemporary(){
    global $G_SERVER_ROOT;
    $tmp = "$G_SERVER_ROOT/certificates/tmp";
    array_map('unlink', glob("$tmp/*.*"));
    rmdir($tmp);
    unset($tmp);
}

// Data conversion
function cabToPem($path){
    $r = "";
    $cab = new CabArchive($path);
    $fileNames = $cab->getFileNames();
    foreach($fileNames as $fileName){
        if(in_array(pathinfo($fileName, PATHINFO_EXTENSION), array('crt', 'cer', 'der'))){
            $r .= "File: $fileName".PHP_EOL;
            $data = $cab->getFileContent($fileName);
            $r .= crtToPem($data);
            unset($data);
        }
    }
    unset($cab, $fileNames);
    return $r;
}
function crtToPem($data){
    // Source: https://gist.github.com/ajzele/4585931
    return
        '-----BEGIN CERTIFICATE-----'.PHP_EOL.
        chunk_split(base64_encode($data), 64, PHP_EOL).
        '-----END CERTIFICATE-----'.PHP_EOL;

}

// "last-update" functions
function getLastUpdate($element){
    return ((int)getElement($element, "last-update")->textContent);
}
function setLastUpdate($element, $value){
    global $updateXMLCertificateFile;
    $updateXMLCertificateFile = true;
    getElement($element, "last-update")->nodeValue = $value;
}

// "update-interval" functions
function getUpdateInterval($element){
    return ((int)getElement($element, "update-interval")->textContent) * 60 * 60 * 24;
}

// "source" functions
function hasContentSource($element){
    return (getElement(getElement($element, "source"), "content") != NULL);
}
function hasCabFileSource($element){
    return (getElement(getElement($element, "source"), "cab-file") != NULL);
}
function getContentSource($element){
    return getElement(getElement($element, "source"), "content")->textContent;
}
function getCabFileSource($element){
    return getElement(getElement($element, "source"), "cab-file")->textContent;
}

// "file-name" functions
function getFileName($element){
    return getElement($element, "file-name")->textContent;
}

// Update all certificates
function updateCertificates(){
    global $updateXMLCertificateFile, $G_SERVER_ROOT;
    // Get certificates data
    if($data = loadXML("$G_SERVER_ROOT/certificates/data.xml", true)){
        // Check last update time for certificates

        // Update FIDO certificates
        $FIDO = getElement($data->documentElement, "FIDO");
        if(getLastUpdate($FIDO) + getUpdateInterval($FIDO) <= time()){
            // Use WebAuthn library to update certificates
            {
                $WebAuthn = new lbuchs\WebAuthn\WebAuthn('', '', NULL);
                $WebAuthn->queryFidoMetaDataService("$G_SERVER_ROOT/certificates/FIDO/", true);
                unset($WebAuthn);
            }
            setLastUpdate($FIDO, time());
        }
        unset($FIDO);

        // Update root certificates
        $certificates = $data->documentElement->getElementsByTagName("certificate");
        foreach($certificates as $certificate){
            if(getLastUpdate($certificate) + getUpdateInterval($certificate) <= time()){
                $ParentFolder = $certificate->parentNode->tagName;
                $FolderPath = "$G_SERVER_ROOT/certificates/$ParentFolder";
                if(!is_dir($FolderPath)){
                    mkdir($FolderPath);
                }
                $FileName = getFileName($certificate);
                // Delete current certificate
                @unlink("$FolderPath/$FileName");
                // Get latest certificate(s) from the assigned source!
                if(hasContentSource($certificate)){
                    $content = file_get_contents(getContentSource($certificate));
                    file_put_contents("$FolderPath/$FileName", $content);
                    unset($content);
                }else if(hasCabFileSource($certificate)){
                    $source = saveTemporaryFile(getCabFileSource($certificate));
                    $content = cabToPem($source);
                    file_put_contents("$FolderPath/$FileName", $content);
                    unset($source, $content);
                }
                setLastUpdate($certificate, time());
                unset($ParentFolder, $FolderPath, $FileName);
            }
        }
        // Save data
        if($updateXMLCertificateFile){
            $data->saveXML();
            saveXML($data, "$G_SERVER_ROOT/certificates/data.xml");
        }
        unset($data);
        emptyTemporary();
    }else{
        emptyTemporary();
        throw new Exception("Couldn't update certificates!");
    }
}

?>