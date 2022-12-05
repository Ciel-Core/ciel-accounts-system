<?php

// Load XML files
function loadXML($path, $editable = false){
    if($editable){
        $dom = new DOMDocument();
        if(@$dom->load($path) === false){
            unset($dom);
            return false;
        }else{
            return $dom;
        }
    }else{
        return simplexml_load_file($path);
    }
}

// Save XML file
function saveXML(DOMDocument $doc, $path){
    file_put_contents($path, $doc->saveXML());
}

// Get first element
function getElement($element, $name): DOMElement|NULL{
    return $element->getElementsByTagName($name)->item(0);
}

?>