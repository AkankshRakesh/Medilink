<?php
include 'db.php';

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');

    $data = json_decode($json, true);
    $userId = $data['userId'];
    $name = $data['name'];
    $experience = $data['experience'];
    $biography = $data['biography'];
    $picture = $data['picture'];
    $specialization = $data['specialization'];
    $qualification = $data['qualification'];
    $rating = $data['rating'];
    $patients = $data['patients'];
    $fee = $data['fee'];
    $availabilityStart = $data['availabilityStart'];
    $availabilityEnd = $data['availabilityEnd'];
    $location = $data['location'];

    $sql = "INSERT INTO doctors (userId, name,picture, experience, biography, specialization, qualification, rating, patients, fee, availabilityStart, availabilityEnd, location) 
            VALUES (:userId, :name, :picture, :experience, :biography, :specialization, :qualification, :rating, :patients, :fee, :availabilityStart, :availabilityEnd, :location)";

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':userId', $userId);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':picture', $picture);
    $stmt->bindParam(':experience', $experience);
    $stmt->bindParam(":biography", $biography);
    $stmt->bindParam(':specialization', $specialization);
    $stmt->bindParam(':qualification', $qualification);
    $stmt->bindParam(':rating', $rating);
    $stmt->bindParam(':patients', $patients);
    $stmt->bindParam(':fee', $fee);
    $stmt->bindParam(':availabilityStart', $availabilityStart);
    $stmt->bindParam(':availabilityEnd', $availabilityEnd);
    $stmt->bindParam(':location', $location);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Doctor details added successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add doctor details.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>