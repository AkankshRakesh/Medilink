<?php
    include 'db.php';
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Origin: POST, OPTIONS');
    header('Access-Control-Allow-Origin: Content-Type, Authorization');
    header('Content-Type: application/json');

    if($_SERVER['REQUEST-METHOD'] == 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Origin: POST, OPTIONS');
        header('Access-Control-Allow-Origin: Content-Type, Authorization');
        header('Content-Type: application/json');

        http_response_code(200);
        exit;
    }

    if($_SERVER['REQUEST-METHOD'] == 'POST') {
        $inputData = json_decode(file_get_contents('php://input'), true);
        $email = $inputData('email') ?? null;
        $otp = $inputData('otp') ?? null;

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email AND otp = :otp");
        $stmt->execute(['email' => $email, 'otp' => $otp]);
        $user = $stmt->fetch();

    if($user && $user['otp_expiry'] > time()) {
        $stmt = $pdo->prepare("UPDATE users SET otp = NULL, otp_expiry = NULL")
        $stmt->execute(['email' => $email]);

        echo json_encode(["message" => "OTP verification successfully", "user_id" => $user['id'], "username" => $user['username']]);
    } else {
        echo json_encode(["message" => "OTP verification successfully", "user_id" => $user['id'], "username" => $user ['username']]);
    } else {
        echo json_encode(["message" => "Invalid or expired OTP"]);
    }
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Invalid request method"]);
    }
?>