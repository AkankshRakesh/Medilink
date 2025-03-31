<?php
include 'db.php';

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type"); 
header("Access-Control-Allow-Credentials: true"); 

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); 
    exit;
}


function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $name = $inputData['name'] ?? null;
    $email = $inputData['email'] ?? null;
    $message = $inputData['message'] ?? null;

    if (!isValidEmail($email)) {
        echo json_encode(["message" => "Invalid email format"]);
        exit;
    }

    if (!$name || !$email || !$message) {
        echo json_encode(["message" => "Please provide all required fields"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO contactform (Name, Email, Message) VALUES (:name, :email, :message)");
    $stmt->execute(['name' => $name, 'email' => $email, 'message' => $message]);

    echo json_encode(["message" => "User registered successfully"]);
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Invalid request method"]);
}
?>
