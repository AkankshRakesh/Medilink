<?php
// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Ensure the response has the correct CORS headers
    header("Access-Control-Allow-Origin: *"); // Allow all origins or specify a domain
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allowed HTTP methods
    header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allowed headers
    header("Access-Control-Allow-Credentials: true"); // Allow credentials if needed
    http_response_code(200); // Respond with status 200
    exit;
}

// Regular response for other HTTP methods
header("Access-Control-Allow-Origin: *"); // Allow all origins or specify a domain
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

echo json_encode(["message" => "Backend is running!"]);
?>
