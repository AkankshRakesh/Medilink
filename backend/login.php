<?php
include 'db.php';
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin (replace * with your frontend URL in production)
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allow POST, GET, and OPTIONS requests
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow these headers
header('Content-Type: application/json');
// Handle OPTIONS request (preflight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Respond with a successful status
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from POST request
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['email'] ?? null;
    $password = $inputData['password'] ?? null;

    // Check if the email exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(["message" => "Invalid email or password"]);
        exit;
    }

    if (password_verify($password, $user['password'])) {
        // $_SESSION['user_id'] = $user['id'];
        echo json_encode(["message" => "Login successful", "user_id" => $user['id'], "username" => $user['username']]);
    } else {
        echo json_encode(["message" => "Invalid email or password"]);
    }
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Invalid request method"]);
}
?>
