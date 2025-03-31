<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require '../db.php'; 

try {
    $data = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input");
    }

    $order_id = $data['order_id'] ?? null;
    $payment_id = $data['payment_id'] ?? null;

    if (!$order_id) {
        throw new Exception("Order ID is required");
    }

    // Validate order_id format if needed (example: should be string like 'order_ABC123')
    // if (!preg_match('/^order_[a-zA-Z0-9]+$/', $order_id)) {
    //     throw new Exception("Invalid Order ID format");
    // }

    $status = 'paid';

    $sql = "UPDATE payments SET payment_id = :payment_id, status = :status WHERE order_id = :order_id";
    $stmt = $pdo->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Failed to prepare SQL statement");
    }

    $stmt->bindParam(':status', $status, PDO::PARAM_STR);
    $stmt->bindParam(':payment_id', $payment_id, PDO::PARAM_STR);
    $stmt->bindParam(':order_id', $order_id, PDO::PARAM_STR);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update order status");
    }

    if ($stmt->rowCount() === 0) {
        throw new Exception("No records found with that Order ID");
    }

    echo json_encode([
        "success" => true,
        "message" => "Payment verified successfully",
        "order_id" => $order_id,
        "payment_id" => $payment_id
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
} finally {
    $pdo = null;
}