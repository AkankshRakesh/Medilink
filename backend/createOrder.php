<?php
// At the very top of createOrder.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require __DIR__ . '/vendor/autoload.php';
require 'db.php';

use Razorpay\Api\Api;

try {
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input: " . json_last_error_msg());
    }

    // Log received data
    file_put_contents('create_order_debug.log', print_r([
        'timestamp' => date('Y-m-d H:i:s'),
        'input' => $input
    ], true), FILE_APPEND);

    // Validate required fields
    $required = ['doctor_id', 'patient_id', 'amount', 'meeting_date', 'meeting_time'];
    foreach ($required as $field) {
        if (empty($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Initialize Razorpay
    $api = new Api("rzp_test_yzGAVhIYZJF0BR", "vOMjfVyGq4SYeLo3HjmsyH0W");

    // Create order data
    $orderData = [
        'receipt' => 'receipt_' . time(),
        'amount' => $input['amount'] * 100, // Convert to paise
        'currency' => 'INR',
        'payment_capture' => 1,
        'notes' => [
            'doctor_id' => $input['doctor_id'],
            'patient_id' => $input['patient_id'],
            'date' => $input['meeting_date'],
            'time' => $input['meeting_time']
        ]
    ];
    // Create order
    $order = $api->order->create($orderData);
    
    
    $stmt = $pdo->prepare("INSERT INTO payments SET
    order_id = :order_id,
    payment_id = NULL,
    signature = NULL,
    doctor_id = :doctor_id,
    patient_id = :patient_id,
    amount = :amount,
    currency = :currency,
    status = :status,
    meeting_date = :meeting_date,
    meeting_time = :meeting_time,
    created_at = NOW()");

$stmt->execute([
    ':order_id' => $order->id,
    ':doctor_id' => (int)$input['doctor_id'], // Force integer type
    ':patient_id' => (int)$input['patient_id'], // Force integer type
    ':amount' => (float)$input['amount'],
    ':currency' => 'INR',
    ':status' => 'created',
    ':meeting_date' => $input['meeting_date'],
    ':meeting_time' => $input['meeting_time']
]);

    // Prepare response
    $response = [
        'success' => true,
        'order_id' => $order->id,
        'amount' => $input['amount'],
        'currency' => 'INR'
    ];

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    
    // Log the error
    file_put_contents('create_order_errors.log', print_r([
        'timestamp' => date('Y-m-d H:i:s'),
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString(),
        'input' => $input ?? null
    ], true), FILE_APPEND);
    
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString() // Remove in production
    ]);
}