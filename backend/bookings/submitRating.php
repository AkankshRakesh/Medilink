<?php
include '../db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$doctorId = $data['doctorId'] ?? null;
$rating = $data['rating'] ?? null;
$date = $data['date'] ?? null;
$time = $data['time'] ?? null;

if (!$doctorId || !$rating) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "All parameters (doctorId, rating, bookingId) are required"]);
    exit;
}

if (!is_numeric($rating) || $rating < 1 || $rating > 5) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Rating must be a number between 1 and 5"]);
    exit;
}

try {

    // 1. Get current doctor rating data
    $stmt = $pdo->prepare("SELECT rating, ratingCount FROM doctors WHERE userId = ?");
    $stmt->execute([$doctorId]);
    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$doctor) {
        throw new Exception("Doctor not found");
    }

    $currentRating = (float)$doctor['rating'];
    $ratingCount = (int)$doctor['ratingCount'];

    if ($ratingCount == 0) {
        $newAverage = $rating;
        $ratingCount = 1;
    } else {
        $newAverage = ($currentRating * $ratingCount + $rating) / ($ratingCount + 1);
        $ratingCount++;
    }

    $newAverage = round($newAverage, 1);

    $stmt = $pdo->prepare("UPDATE doctors 
                          SET rating = ?, ratingCount = ?
                          WHERE userId = ?");
    $stmt->execute([$newAverage, $ratingCount, $doctorId]);

    $stmt = $pdo->prepare("DELETE from bookings WHERE doctorId = ? AND date = ? AND time = ?");
    $stmt->execute([$doctorId, $date, $time]);


    echo json_encode([
        "success" => true,
        "message" => "Doctor rating updated successfully",
        "newRating" => $newAverage,
        "ratingCount" => $ratingCount
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?>