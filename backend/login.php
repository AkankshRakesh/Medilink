<?php
include 'db.php';
require 'vendor/autoload.php'; //autoload composer-pm installed lib
//import-classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Handle OPTIONS request ( CORS-preflight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    //throw all the allowed-options
    header('Access-Control-Allow-Origin: *'); // Allow requests from any origin (replace * with your frontend URL in production)
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allow POST, GET, and OPTIONS requests
    header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow these headers
    header('Content-Type: application/json');

    http_response_code(200); // Respond with a successful status
    exit;
}

//for{other http requests}
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from POST request
    $inputData = json_decode(file_get_contents('php://input'), true);//json->arr
    $email = $inputData['email'] ?? null; //!allowed-null
    $password = $inputData['password'] ?? null;

    // Check if the email exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");//prevent sql-injection
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();


    if (!$user) {
        echo json_encode(["message" => "Invalid email or password"]);
        exit;
    }

    if (password_verify($password, $user['password'])) {
        // $_SESSION['user_id'] = $user['id'];
        echo json_encode(["message" => "Login successful", "user_id" => $user['id'], "username" => $user['username']]);
    } else {
        echo json_encode(["message" => "Invalid email or password"]);
    }
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Invalid request method"]);
}

$otp = rand(100000, 999999);
$otp_Expiry = time() + 15;
$stmt = $pdo->prepare("UPDATET otp = :otp, otp_expiry = :otp_expiry WHERE email = :email");
$stmt->execute(['otp'=>$otp, 'otp_expiry'=>$otp_Expiry, 'email'=>$email]);
 users SE
$mail = new PHPMailer(true);

try{
    //server-settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'nags0x.dev@gmail.com';
    $mail->Password = '123';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;//encrypt-protocol
    $mail->Port = 587;

    //recipient
    $mail->setFrom('nags0x.dev@gmail.com');
    $mail->addAddress($email);

    //content
    $mail->isHTML(true);
    $mail->Subject = 'Your One Time Passcode';
    $mail->Body = 'Code: $otp /// It will expire soon';

    $mail->send();
    echo json_encode(["message" => "OTP sent successfully to your e-mail"]);
    
} catch(Exception $e) { 
    echo.json_encode(["message" => "OTP could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Invalid request method"]);
}
?>
