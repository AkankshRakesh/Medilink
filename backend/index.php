<?php
include 'db.php';

header('Content-Type: application/json');
echo json_encode(["message" => "Backend is running!"]);
?>
