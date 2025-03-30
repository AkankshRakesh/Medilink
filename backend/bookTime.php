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

// Validate required fields
$requiredFields = ['doctorId', 'patientId', 'date', 'time'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

try {
    // Get doctor and patient details
    $doctorStmt = $pdo->prepare("SELECT  email FROM users WHERE id = :doctorId");
    $doctorStmt->execute(['doctorId' => $data['doctorId']]);
    $doctor = $doctorStmt->fetch(PDO::FETCH_ASSOC);
    
    $patientStmt = $pdo->prepare("SELECT username, email FROM users WHERE id = :patientId");
    $patientStmt->execute(['patientId' => $data['patientId']]);
    $patient = $patientStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$doctor || !$patient) {
        throw new Exception("Could not find doctor or patient records");
    }

    // Insert booking
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
    
    // Send email notifications if meetLink exists
    $emailsSent = false;
    if (!empty($data['meetLink'])) {
        $dateTime = new DateTime("{$data['date']} {$data['time']}");
        $formattedDateTime = $dateTime->format('F j, Y \a\t g:i A');
        
        // Email to patient
        $patientSubject = "Your Appointment with {$data['doctorName']}";
        $patientBody = "
            <h2>Appointment Confirmation</h2>
            <p>Dear {$patient['username']},</p>
            <p>Your appointment with {$data['doctorName']} has been confirmed for:</p>
            <p><strong>{$formattedDateTime}</strong></p>
            <p>Meeting Link: <a href='{$data['meetLink']}'>{$data['meetLink']}</a></p>
            <p>Please join the meeting on time.</p>
            <br>
            <p>Best regards,</p>
            <p>Medilink Team</p>
        ";
        
        // Email to doctor
        $doctorSubject = "New Appointment with {$patient['username']}";
        $doctorBody = "
            <h2>New Appointment Scheduled</h2>
            <p>Dear Dr. {$data['doctorName']},</p>
            <p>You have a new appointment with {$patient['username']} scheduled for:</p>
            <p><strong>{$formattedDateTime}</strong></p>
            <p>Meeting Link: <a href='{$data['meetLink']}'>{$data['meetLink']}</a></p>
            <br>
            <p>Best regards,</p>
            <p>Medilink Team</p>
        ";
        
        // Send emails using your existing SMTP configuration
        $mailer = new PHPMailer(true);
        try {
            // Configure mailer (using your OTP email settings)
            $mailer->isSMTP();
            $mailer->Host = 'smtp-relay.brevo.com';
            $mailer->SMTPAuth = true;
            $mailer->Username = '852d66001@smtp-brevo.com';
            $mailer->Password = 'cH52JzGKUaWRLVYS';
            $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mailer->Port = 587;
            $mailer->setFrom('akankshrakesh@gmail.com', 'Medilink');
            $mailer->isHTML(true);
            
            // Send to patient
            $mailer->clearAddresses();
            $mailer->addAddress($patient['email'], $patient['username']);
            $mailer->Subject = $patientSubject;
            $mailer->Body = $patientBody;
            $mailer->send();
            
            // Send to doctor
            $mailer->clearAddresses();
            $mailer->addAddress($doctor['email'], $data['doctorName']);
            $mailer->Subject = $doctorSubject;
            $mailer->Body = $doctorBody;
            $mailer->send();
            
            $emailsSent = true;
        } catch (Exception $e) {
            // Log email error but don't fail the booking
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