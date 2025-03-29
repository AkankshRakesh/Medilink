<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request (preflight request)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Respond with a successful status
    exit;
}

require 'vendor/autoload.php';
require 'db.php'; // Database connection

use Razorpay\Api\Api;

$data = json_decode(file_get_contents("php://input"), true);
$doctor_id = $data['doctor_id'] ?? null;
$patient_id = $data['patient_id'] ?? null;
$amount = $data['amount'] ?? null;
$meeting_date = $data['meeting_date'] ?? null;
$meeting_time = $data['meeting_time'] ?? null;
$extra_info = $data['extra_info'] ?? null;

if (!$doctor_id || !$patient_id || !$amount || !$meeting_date || !$meeting_time) {
    echo json_encode(["error" => "Doctor ID, Patient ID, Amount, Meeting Date, and Meeting Time are required"]);
    exit;
}

try {
    $api = new Api("rzp_test_yzGAVhIYZJF0BR", "vOMjfVyGq4SYeLo3HjmsyH0W");

    $currency = "INR";
    $orderData = [
        'receipt'         => $doctor_id . "_" . $patient_id,
        'amount'          => $amount * 100, // Razorpay expects amount in paise
        'currency'        => $currency,
        'payment_capture' => 1 // Auto capture payment
    ];

    $order = $api->order->create($orderData);
    $razorpay_order_id = $order['id']; // Get the Razorpay order ID

    // Store in Database
    $stmt = $pdo->prepare("INSERT INTO payments (order_id, doctor_id, patient_id, amount, currency, meeting_date, meeting_time) 
                            VALUES (:order_id, :doctor_id, :patient_id, :amount, :currency, :meeting_date, :meeting_time)");

    $stmt->execute([
        'order_id' => $razorpay_order_id, // Use Razorpay's Order ID
        'doctor_id'    => $doctor_id,
        'patient_id'   => $patient_id,
        'amount'       => $amount,
        'currency'     => $currency,
        'meeting_date' => $meeting_date,
        'meeting_time' => $meeting_time
    ]);

    // Fetch the inserted data
    $fetchStmt = $pdo->prepare("SELECT * FROM payments WHERE order_id = :order_id");
    $fetchStmt->execute(['order_id' => $razorpay_order_id]);
    $insertedData = $fetchStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "order" => $insertedData
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error creating order", "message" => $e->getMessage()]);
}
