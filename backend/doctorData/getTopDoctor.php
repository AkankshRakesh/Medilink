<?php 
session_start();
include '../db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$specialization = $data['specialization'] ?? '';

if (!empty($specialization)) {
    try {
        // Prepare and execute query
        $stmt = $pdo->prepare("SELECT * FROM doctors WHERE specialization = ? ORDER BY rating DESC LIMIT 2");
        $stmt->execute([$specialization]);
        $doctor = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($doctor) {
            echo json_encode($doctor);
        } else {
            echo json_encode(["message" => "No doctor found for this specialization"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Specialization field is required"]);
}
?>