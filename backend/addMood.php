<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mood = $_POST['mood'];
    $date = $_POST['date'];

    $stmt = $pdo->prepare("INSERT INTO moods (mood, date) VALUES (:mood, :date)");
    $stmt->execute(['mood' => $mood, 'date' => $date]);

    echo json_encode(["message" => "Mood added successfully"]);
} else {
    http_response_code(405); // Method not allowed
    echo json_encode(["message" => "Invalid request method"]);
}
?>
