<?php
// Include the database connection file
include 'db.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Query to fetch all doctors from the users table where isDoctor = 1
    $stmt = $pdo->prepare("SELECT id,userId, name,picture, experience, specialization, qualification, rating, patients,fee, availabilityStart, availabilityEnd, location FROM doctors");
    $stmt->execute();
    $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($doctors) {
        echo json_encode([
            'success' => true,
            'doctors' => $doctors
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No doctors found']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database query failed: ' . $e->getMessage()]);
}
