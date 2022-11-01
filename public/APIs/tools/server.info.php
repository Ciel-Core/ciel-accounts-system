<?php

// Get the server protocol
$SERVER_PROTOCOL = stripos($_SERVER['SERVER_PROTOCOL'],'https') === 0 ? 'https://' : 'http://';

// Get the server host name
$SERVER_NAME = $_SERVER['SERVER_NAME'];

// Get the server's root
$SERVER_ROOT = $_SERVER['DOCUMENT_ROOT'];

?>