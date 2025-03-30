<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Clear all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Clear the session cookie if it exists
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Respond with success message
echo json_encode(['status' => 'success', 'message' => 'User logged out successfully']);
?>