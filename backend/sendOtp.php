<?php
require 'vendor/autoload.php'; 
require 'db.php'; 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

function generateOTP() {
    return rand(100000, 999999);
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($data['email']) || empty($data['email'])) {
        echo json_encode(["status" => "error", "message" => "Email is required"]);
        exit;
    }

    $email = $data['email']; 
    $otp = generateOTP();
    $expiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));

    $stmt = $pdo->prepare("INSERT INTO otptable (email, otp, expires_at) VALUES (:email, :otp, :expires_at)");
    $stmt->execute(['email' => $email, 'otp' => $otp, 'expires_at' => $expiry]);

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp-relay.brevo.com'; 
        $mail->SMTPAuth = true;
        $mail->Username = '852d66001@smtp-brevo.com';
        $mail->Password = 'cH52JzGKUaWRLVYS'; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        $mail->setFrom('akankshrakesh@gmail.com', 'Medilink');
        $mail->addAddress($email);
        $mail->Subject = 'Email Verification';
        $mail->Body = "Your OTP code for Medilink is: $otp. This OTP is valid for 10 minutes.";

        $mail->send();
        echo json_encode(["status" => "success", "message" => "OTP sent successfully"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Mailer Error: " . $mail->ErrorInfo]);
    }
}
?>
