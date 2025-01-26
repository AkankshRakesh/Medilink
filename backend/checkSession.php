<?php
// Start the session to access session data
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Respond with a successful status
    exit;
}

// Get user data from POST request body
$inputData = json_decode(file_get_contents('php://input'), true);
$userId = $inputData['userId'] ?? null;

if ($userId) {
    // Assuming you have a way to verify the user (e.g., check in the database)
    // For simplicity, we're just returning the user details based on userId
    // You can replace this with your database check logic
    echo json_encode([
        'success' => true,
        'user_id' => $userId,
        'username' => 'example_username', // Replace with actual data from DB
        'email' => 'example@example.com'  // Replace with actual data from DB
    ]);
} else {
    // If no userId is provided
    echo json_encode([
        'success' => false,
        'message' => 'User ID is required'
    ]);
}
?>
