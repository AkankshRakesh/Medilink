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

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM otptable WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $emailExists = $stmt->fetchColumn();

    if ($emailExists) {
        $stmt = $pdo->prepare("UPDATE otptable SET otp = :otp, expires_at = :expires_at WHERE email = :email");
        $stmt->execute(['email' => $email, 'otp' => $otp, 'expires_at' => $expiry]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO otptable (email, otp, expires_at) VALUES (:email, :otp, :expires_at)");
        $stmt->execute(['email' => $email, 'otp' => $otp, 'expires_at' => $expiry]);
    }

    // HTML email template with OTP
    $htmlTemplate = <<<HTML
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f7;
      font-family: 'Arial', sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      padding: 40px 30px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo {
      width: 60px;
      height: auto;
      margin-bottom: 10px;
    }
    .title {
      font-size: 22px;
      font-weight: bold;
      color: #333;
    }
    .otp {
      font-size: 28px;
      color: #d42755;
      font-weight: bold;
      letter-spacing: 4px;
      background-color: #f8f9fa;
      padding: 15px 20px;
      display: inline-block;
      border-radius: 6px;
    }
    .text {
      font-size: 16px;
      color: #333333;
      line-height: 1.6;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">Verify Your Email</div>
    </div>
    <div class="text">
      <p>Use the following OTP to verify your email address. This OTP is valid for the next 10 minutes.</p>
      <p style="text-align: center;">
        <span class="otp">$otp</span>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; 2025 Medilink All rights reserved.
    </div>
  </div>
</body>
</html>

HTML;

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
        $mail->Subject = 'Your Medilink Verification Code';
        $mail->isHTML(true);
        $mail->Body = $htmlTemplate;
        $mail->AltBody = "Your OTP code for Medilink is: $otp. This OTP is valid for 10 minutes.";

        $mail->send();
        echo json_encode(["status" => "success", "message" => "OTP sent successfully"]);
    } catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Mailer Error: " . $mail->ErrorInfo]);
    }
}
?>