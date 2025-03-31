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

$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['userId'] ?? null;
$type = $data['type'] ?? 3; // Default to 3 (both) if not specified
$currentDate = date('Y-m-d');
$response = [];

if (!$userId) {
    http_response_code(400);
    echo json_encode(["error" => "userId parameter is required"]);
    exit;
}

$formatDoctorTime = function($row) {
    return [
        'date' => $row['date'],
        'time' => date('H:i', strtotime($row['time'])),
        'meetLink' => $row['meetLink']
    ];
};

$formatPatientTime = function($row) {
    return [
        'date' => $row['date'],
        'time' => date('H:i', strtotime($row['time'])),
        'doctorId' => $row['doctorId'],
        'meetLink' => $row['meetLink']
    ];
};

switch ($type) {
    case 1: // Doctor only
        $stmt = $pdo->prepare("SELECT time, date, meetLink FROM bookings 
                             WHERE doctorId = ? AND date >= ?
                             ORDER BY date, time");
        $stmt->execute([$userId, $currentDate]);
        $response = array_map($formatDoctorTime, $stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 2: // Patient only
        $stmt = $pdo->prepare("SELECT time, date, doctorId, meetLink FROM bookings 
                             WHERE patientId = ? AND date >= ?
                             ORDER BY date, time");
        $stmt->execute([$userId, $currentDate]);
        $response = array_map($formatPatientTime, $stmt->fetchAll(PDO::FETCH_ASSOC));
        break;
        
    case 3: // Both (default)
        $stmt = $pdo->prepare("SELECT time, date, meetLink FROM bookings 
                             WHERE doctorId = ? AND date >= ?
                             ORDER BY date, time");
        $stmt->execute([$userId, $currentDate]);
        $asDoctor = array_map($formatDoctorTime, $stmt->fetchAll(PDO::FETCH_ASSOC));
        
        $stmt = $pdo->prepare("SELECT time, date, doctorId, meetLink FROM bookings 
                             WHERE patientId = ? AND date >= ?
                             ORDER BY date, time");
        $stmt->execute([$userId, $currentDate]);
        $asPatient = array_map($formatPatientTime, $stmt->fetchAll(PDO::FETCH_ASSOC));
        
        $response = [
            'as_doctor' => $asDoctor,
            'as_patient' => $asPatient
        ];
        break;
        
    default:
        http_response_code(400);
        $response = ["error" => "Invalid type parameter (must be 1, 2, or 3)"];
}

echo json_encode($response);