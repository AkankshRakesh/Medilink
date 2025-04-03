<?php
session_start([
    'use_cookies' => true,
    'use_only_cookies' => true,
    'cookie_secure' => false, 
    'cookie_httponly' => true,
]);

$allowedOrigins = [
    "https://medilink-6v6f.onrender.com",
    "http://localhost:3000"
];

if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204); // No Content
    exit;
}

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
