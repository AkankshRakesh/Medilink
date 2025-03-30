<?php
include '../db.php';

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Use specific domain in production
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow Content-Type header
header("Access-Control-Allow-Credentials: true"); // Allow credentials if needed

// Handle OPTIONS request (preflight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Respond with a successful status
    exit;
}


// Function to validate email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get data from POST request body (as JSON)
    $inputData = json_decode(file_get_contents('php://input'), true);
    $username = $inputData['username'] ?? null;
    $email = $inputData['email'] ?? null;
    $password = $inputData['password'] ?? null;
    $isDoctor = $inputData['isDoctor'] ?? false;

    // Validate email format
    if (!isValidEmail($email)) {
        echo json_encode(["message" => "Invalid email format"]);
        exit;
    }

    // Check for missing parameters
    if (!$username || !$email || !$password) {
        echo json_encode(["message" => "Please provide all required fields"]);
        exit;
    }

    // Hash the password before storing
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Check if the email already exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user) {
        echo json_encode(["message" => "Email already exists"]);
        exit;
    } else {
        echo json_encode(["message" => "Email is available"]);
    }


    // Insert the new user into the database
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, isDoctor) VALUES (:username, :email, :password, :isDoctor)");
    $stmt->execute(['username' => $username, 'email' => $email, 'password' => $hashedPassword, 'isDoctor' => $isDoctor]);

    echo json_encode(["message" => "User registered successfully"]);
} else {
    http_response_code(405); // Method not allowed
    echo json_encode(["message" => "Invalid request method"]);
}
?>
