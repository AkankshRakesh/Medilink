<?php
session_start();
include '../db.php'; // Ensure this contains a valid PDO connection ($pdo)

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Ensure the user is logged in by checking session data
$userId = $_SESSION['user_id'] ?? null;
if (!isset($_SESSION['user_id'])) {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $userId = $inputData['userId'] ?? null;
}

try {
    // Prepare SQL query using PDO
    $stmt = $pdo->prepare("SELECT * FROM doctors WHERE userId = ?");
    $stmt->execute([$userId]);
    $doctor = $stmt->fetch(PDO::FETCH_ASSOC); // Fetch a single row

    if ($doctor) {
        echo json_encode(["success" => true, "doctor" => $doctor]);
    } else {
        echo json_encode(["success" => false, "message" => "Doctor not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
