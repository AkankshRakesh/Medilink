<?php
require '../db.php'; 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['email'] ?? null;
    $enteredOtp = $inputData['otp'] ?? null;

    if (!$email || !$enteredOtp) {
        echo json_encode(["status" => "error", "message" => "Email and OTP are required"]);
        http_response_code(400);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT otp, expires_at FROM otptable WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$result) {
            echo json_encode(["status" => "error", "message" => "No OTP found for this email"]);
            exit;
        }

        $storedOtp = $result['otp'];
        $expiryTime = strtotime($result['expires_at']);
        $currentTime = time();

        if ($storedOtp == $enteredOtp) {
            if ($currentTime > $expiryTime) {
                echo json_encode(["status" => "error", "message" => "OTP has expired"]);
            } else {
                $stmt = $pdo->prepare("DELETE FROM otptable WHERE email=?");
                $stmt->execute([$email]);

                echo json_encode(["status" => "success", "message" => "OTP verification successful"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid OTP"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
}
?>
