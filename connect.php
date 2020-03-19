<?php

    $host = "localhost";
    $user = "root";
    $pass = null;
    $port = null;

    $db_name = "fastmemory";
    $table_name = "records";

    $db = new mysqli($host, $user, $pass, $db_name, $port);

    if (!$db) {
        http_response_code(500);
        exit();
    }

?>