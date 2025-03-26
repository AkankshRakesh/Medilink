<?php
session_start([
    'use_cookies' => true,
    'use_only_cookies' => true,
    'cookie_secure' => false, // Set to true if using HTTPS
    'cookie_httponly' => true,
]);
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!empty($data)) {
        $id = uniqid(); 
        $_SESSION["doctor_$id"] = $data; 
        echo json_encode(["id" => $id]); 
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data"]);
    }
}

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["id"])) {
    $id = $_GET["id"];
    if (isset($_SESSION["doctor_$id"])) {
        echo json_encode($_SESSION["doctor_$id"]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "Doctor not found"]);
    }
}
?>
