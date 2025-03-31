<?php
session_start();
include '../db.php'; 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$userId = $_SESSION['user_id'] ?? null;
if (!isset($_SESSION['user_id'])) {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $userId = $inputData['userId'] ?? null;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM doctors WHERE userId = ?");
    $stmt->execute([$userId]);
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
