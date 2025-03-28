<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php'; // Database connection

try {
    $stmt = $pdo->prepare("
        SELECT 
            p.order_id, 
            p.amount, 
            p.currency, 
            p.meeting_date, 
            p.meeting_time,
            p.created_at,
            d.id AS doctor_id, 
            d.name AS doctor_name, 
            d.email AS doctor_email,
            u.id AS patient_id, 
            u.name AS patient_name, 
            u.email AS patient_email
        FROM payments p
        JOIN doctors d ON p.doctor_id = d.id
        JOIN users u ON p.patient_id = u.id
        ORDER BY p.created_at DESC
    ");
    
    $stmt->execute();
    $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "payments" => $payments]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error fetching payments", "message" => $e->getMessage()]);
}
