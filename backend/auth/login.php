<?php
session_start(); 
include '../db.php';

if (isset($_SESSION['user_id'])) {
    echo json_encode(["message" => "User already logged in", "user_id" => $_SESSION['user_id']]);
    exit;
}

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); 
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = json_decode(file_get_contents('php://input'), true);
    $email = $inputData['email'] ?? null;
    $password = $inputData['password'] ?? null;

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(["message" => "Invalid email or password"]);
        exit;
    }

    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        echo json_encode(["message" => "Login successful", "user_id" => $user['id'], "username" => $user['username']]);
    } else {
        echo json_encode(["message" => "Invalid email or password"]);
    }
} else {
    http_response_code(405); 
    echo json_encode(["message" => "Invalid request method"]);
}
?>
