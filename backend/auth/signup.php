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


function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $username = $inputData['username'] ?? null;
    $email = $inputData['email'] ?? null;
    $password = $inputData['password'] ?? null;
    $isDoctor = $inputData['isDoctor'] ?? false;

    if (!isValidEmail($email)) {
        echo json_encode(["message" => "Invalid email format"]);
        exit;
    }

    if (!$username || !$email || !$password) {
        echo json_encode(["message" => "Please provide all required fields"]);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user) {
        echo json_encode(["message" => "Email already exists"]);
        exit;
    } else {
        echo json_encode(["message" => "Email is available"]);
    }


    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, isDoctor) VALUES (:username, :email, :password, :isDoctor)");
    $stmt->execute(['username' => $username, 'email' => $email, 'password' => $hashedPassword, 'isDoctor' => $isDoctor]);

    echo json_encode(["message" => "User registered successfully"]);
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Invalid request method"]);
}
?>
