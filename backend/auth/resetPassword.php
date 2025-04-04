<?php
include '../db.php';

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type"); 
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); 
    exit;
}

 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['email'] ?? null;
    $password = $inputData['newPassword'] ?? null;


    if ( !$email || !$password) {
        echo json_encode(["message" => "Please provide all required fields"]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("UPDATE users SET password = :password WHERE email = :email");
    $result = $stmt->execute(['email' => $email, 'password' => $hashedPassword]);
    $user = $stmt->fetch();

    if ($result) {
        $response['status'] = 'success';
        $response['message'] = 'Password updated successfully';
    } else {
        $response['message'] = 'Failed to update password';
    }

    echo json_encode($response);
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Invalid request method"]);
}
?>
