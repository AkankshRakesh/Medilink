<?php
session_start();
include 'db.php'; // Ensure this contains a valid PDO connection ($pdo)

header("Access-Control-Allow-Origin: http://localhost:3000"); // Set specific frontend origin
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // Allow cookies/sessions
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if user is authenticated via session, URL param, or request payload
$userId = $_SESSION['user_id'] ?? $_GET['user_id'] ?? null;

if (!$userId) {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $userId = $inputData['userId'] ?? null;
}

if (!$userId) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

try {
    // Fetch doctor details
    $stmt = $pdo->prepare("SELECT * FROM doctors WHERE userId = :userId");
    $stmt->bindParam(":userId", $userId, PDO::PARAM_INT);
    $stmt->execute();

    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($doctor) {
        echo json_encode(["success" => true, "doctor" => $doctor]);
    } else {
        echo json_encode(["success" => false, "message" => "Doctor not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
