<?php

// Load XML functions
require_once "tool.xml.php";

// Load server info
require_once "server.info.php";

// Load WebAuthn library
require_once "$SERVER_ROOT/libraries/WebAuthn/WebAuthn.php";

global $updateXMLCertificateFile;
$updateXMLCertificateFile = false;

// Data conversion
function cerToPem($data){
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
                    //
                    getCabFileSource($certificate);
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
    }else{
        throw new Exception("Couldn't update certificates!");
    }
}

?>