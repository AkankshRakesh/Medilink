<?php

session_start([
    'use_cookies' => true,
    'use_only_cookies' => true,
    'cookie_secure' => false, 
    'cookie_httponly' => true,
]);

$allowedOrigins = [
    "https://medilink-6v6f.onrender.com",
    "http://localhost:3000",
    "https://moodl-wheat.vercel.app"
];

header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit;
    }
    
    if (!empty($data)) {
        $id = uniqid(); 
        $_SESSION["doctor_$id"] = $data; 
        echo json_encode(["id" => $id, "session_id" => session_id()]); // Return session ID for debugging
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data"]);
    }
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["id"])) {
    
    $id = $_GET["id"];
    if (isset($_SESSION["doctor_$id"])) {
        echo json_encode($_SESSION["doctor_$id"]);
    } else {
        $stmt = $pdo->prepare("SELECT * FROM doctors WHERE userId = 11");
        $stmt->execute();
        $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($doctor) {
            echo json_encode(["doctor" => $doctor]);
            return; 
        } else {
            echo json_encode(["success" => false, "message" => "Doctor not found"]);
        }
        http_response_code(404);
        echo json_encode([
            "error" => "Doctor not found",
            "session_keys" => array_keys($_SESSION), // Show available session keys
            "session_id" => session_id()
        ]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
?>