<?php
require 'vendor/autoload.php'; // Load PHPMailer
require 'db.php'; // Include database connection

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$requiredFields = ['doctorId', 'patientId', 'date', 'time'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

try {
    $doctorStmt = $pdo->prepare("SELECT  email FROM users WHERE id = :doctorId");
    $doctorStmt->execute(['doctorId' => $data['doctorId']]);
    $doctor = $doctorStmt->fetch(PDO::FETCH_ASSOC);
    
    $patientStmt = $pdo->prepare("SELECT username, email FROM users WHERE id = :patientId");
    $patientStmt->execute(['patientId' => $data['patientId']]);
    $patient = $patientStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$doctor || !$patient) {
        throw new Exception("Could not find doctor or patient records");
    }

    $bookingStmt = $pdo->prepare("INSERT INTO bookings 
        (doctorId, patientId, date, time, paymentId, meetLink) 
        VALUES (:doctorId, :patientId, :date, :time, :paymentId, :meetLink)");
    
    $bookingStmt->execute([
        'doctorId' => $data['doctorId'],
        'patientId' => $data['patientId'],
        'date' => $data['date'],
        'time' => $data['time'],
        'paymentId' => $data['paymentId'] ?? null,
        'meetLink' => $data['meetLink'] ?? null
    ]);
    
    $bookingId = $pdo->lastInsertId();
    
    $emailsSent = false;
    if (!empty($data['meetLink'])) {
        $dateTime = new DateTime("{$data['date']} {$data['time']}");
        $formattedDateTime = $dateTime->format('F j, Y \a\t g:i A');
        
        $patientSubject = "Your Appointment with {$data['doctorName']}";
        $patientBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
    .email-container { background-color: #fff; border-radius: 8px; padding: 30px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
    .header { text-align: center; color: #d42755; font-size: 22px; font-weight: bold; }
    .content { margin-top: 20px; font-size: 16px; color: #333; }
    .content strong { color: #d42755; }
    .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
    .link-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007BFF; /* Bootstrap-like blue */
  color: #ffffff !important;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  border: none;
}


  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">Appointment Confirmation</div>
    <div class="content">
      <p>Dear {$patient['username']},</p>
      <p>Your appointment with <strong>{$data['doctorName']}</strong> has been confirmed for:</p>
      <p><strong>{$formattedDateTime}</strong></p>
      <p>You can join the consultation via the following link:</p>
      <p><a class="link-btn" href="{$data['meetLink']}">Join Meeting</a></p>
      <p>Please be on time and ensure you have a stable internet connection.</p>
      <p>If you have any issues, contact us via your Medilink dashboard.</p>
    </div>
    <div class="footer">&copy; 2025 Medilink. All rights reserved.</div>
  </div>
</body>
</html>
HTML;

        
        $doctorSubject = "New Appointment with {$patient['username']}";
        $doctorBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; }
    .email-container { background-color: #fff; border-radius: 8px; padding: 30px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
    .header { text-align: center; color: #0a3d62; font-size: 22px; font-weight: bold; }
    .content { margin-top: 20px; font-size: 16px; color: #333; }
    .content strong { color: #0a3d62; }
    .footer { margin-top: 30px; text-align: center; color: #888; font-size: 12px; }
    .link-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007BFF; /* Bootstrap-like blue */
  color: #ffffff !important;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  border-radius: 6px;
  border: none;
}


  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">New Appointment Scheduled</div>
    <div class="content">
      <p>Dear <strong>{$data['doctorName']}</strong>,</p>
      <p>You have a new appointment with <strong>{$patient['username']}</strong> scheduled for:</p>
      <p><strong>{$formattedDateTime}</strong></p>
      <p>Meeting Link:</p>
      <p><a class="link-btn" href="{$data['meetLink']}">Join Meeting</a></p>
      <p>Please ensure you're prepared and available at the scheduled time.</p>
    </div>
    <div class="footer">&copy; 2025 Medilink. All rights reserved.</div>
  </div>
</body>
</html>
HTML;

        
        $mailer = new PHPMailer(true);
        try {
            $mailer->isSMTP();
            $mailer->Host = 'smtp-relay.brevo.com';
            $mailer->SMTPAuth = true;
            $mailer->Username = '852d66001@smtp-brevo.com';
            $mailer->Password = 'cH52JzGKUaWRLVYS';
            $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mailer->Port = 587;
            $mailer->setFrom('akankshrakesh@gmail.com', 'Medilink');
            $mailer->isHTML(true);
            
            $mailer->clearAddresses();
            $mailer->addAddress($patient['email'], $patient['username']);
            $mailer->Subject = $patientSubject;
            $mailer->Body = $patientBody;
            $mailer->send();
            
            $mailer->clearAddresses();
            $mailer->addAddress($doctor['email'], $data['doctorName']);
            $mailer->Subject = $doctorSubject;
            $mailer->Body = $doctorBody;
            $mailer->send();
            
            $emailsSent = true;
        } catch (Exception $e) {
            error_log("Email sending failed: " . $e->getMessage());
        }
    }
    
    echo json_encode([
        'success' => true,
        'bookingId' => $bookingId,
        'emailsSent' => $emailsSent,
        'message' => 'Booking confirmed' . ($emailsSent ? ' and emails sent' : '')
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>