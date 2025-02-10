<?php
// Start the session to access session data
include 'db.php';

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

    $stmt = $pdo->prepare("SELECT isDoctor FROM users WHERE id = :userId");
    $stmt->execute(['userId' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if($user) {
            echo json_encode([
            'success' => true,
            'user_id' => $userId,
            'isDoctor' => $user['isDoctor']  // Replace with actual data from DB
        ]);
    } else{
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} else {
    // If no userId is provided
    echo json_encode([
        'success' => false,
        'message' => 'User ID is required'
    ]);
}
?>
