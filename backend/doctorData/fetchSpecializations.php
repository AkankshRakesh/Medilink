<?php
session_start();
include '../db.php'; 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

try {
    // SQL query to fetch unique specializations
    $stmt = $pdo->prepare("SELECT DISTINCT specialization FROM doctors");
    $stmt->execute();
    
    $specializations = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if ($specializations) {
        echo json_encode(["success" => true, "specializations" => $specializations]);
    } else {
        echo json_encode(["success" => false, "message" => "No specializations found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>