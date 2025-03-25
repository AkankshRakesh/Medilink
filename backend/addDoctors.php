<?php
include 'db.php';

header("Access-Control-Allow-Origin: *"); // Use specific domain in production
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow Content-Type header


// add_doctor.php - Script to add doctor details
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');

    // Decode the JSON data
    $data = json_decode($json, true);
    // Get data from the frontend
    $userId = $data['userId'];
    $name = $data['name'];
    $experience = $data['experience'];
    $picture = $data['picture'];
    $specialization = $data['specialization'];
    $qualification = $data['qualification'];
    $rating = $data['rating'];
    $patients = $data['patients'];
    $fee = $data['fee'];
    $availabilityStart = $data['availabilityStart'];
    $availabilityEnd = $data['availabilityEnd'];
    $location = $data['location'];

    // Prepare SQL statement
    $sql = "INSERT INTO doctors (userId, name,picture, experience, specialization, qualification, rating, patients, fee, availabilityStart, availabilityEnd, location) 
            VALUES (:userId, :name, :picture, :experience, :specialization, :qualification, :rating, :patients, :fee, :availabilityStart, :availabilityEnd, :location)";

    // Prepare the statement
    $stmt = $pdo->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':userId', $userId);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':picture', $picture);
    $stmt->bindParam(':experience', $experience);
    $stmt->bindParam(':specialization', $specialization);
    $stmt->bindParam(':qualification', $qualification);
    $stmt->bindParam(':rating', $rating);
    $stmt->bindParam(':patients', $patients);
    $stmt->bindParam(':fee', $fee);
    $stmt->bindParam(':availabilityStart', $availabilityStart);
    $stmt->bindParam(':availabilityEnd', $availabilityEnd);
    $stmt->bindParam(':location', $location);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Doctor details added successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add doctor details.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>