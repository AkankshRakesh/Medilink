<?php
include '../db.php';

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Validate required fields
    if (empty($data['userId'])) {
        echo json_encode(['status' => 'error', 'message' => 'User ID is required']);
        exit;
    }

    $userId = $data['userId'];
    $name = $data['name'] ?? '';
    $experience = $data['experience'] ?? '';
    $biography = $data['biography'] ?? '';
    $picture = $data['picture'] ?? '';
    $specialization = $data['specialization'] ?? '';
    $qualification = $data['qualification'] ?? '';
    $rating = $data['rating'] ?? '';
    $patients = $data['patients'] ?? '';
    $fee = $data['fee'] ?? '';
    $availabilityStart = $data['availabilityStart'] ?? '';
    $availabilityEnd = $data['availabilityEnd'] ?? '';
    $location = $data['location'] ?? '';

    // Validate and standardize specialization
    $specialties = [
        "General Physician", "Dermatology", "Obstetrics & Gynaecology", "Orthopaedics",
        "ENT", "Neurology", "Cardiology", "Urology", "Gastroenterology/GI medicine",
        "Psychiatry", "Paediatrics", "Pulmonology/Respiratory", "Endocrinology",
        "Nephrology", "Neurosurgery", "Rheumatology", "Ophthalmology",
        "Surgical Gastroenterology", "Infectious Disease", "General & Laparoscopic Surgery",
        "Psychology", "Medical Oncology", "Diabetology", "Dentist"
    ];
    
    function getClosestSpecialty($input, $specialties) {
        $closest = null;
        $highestSimilarity = 0;
    
        foreach ($specialties as $spec) {
            similar_text(strtolower($input), strtolower($spec), $percent);
            if ($percent > $highestSimilarity) {
                $highestSimilarity = $percent;
                $closest = $spec;
            }
        }
    
        return $closest;
    }
    
    $specialization = getClosestSpecialty($specialization, $specialties);

    $checkSql = "SELECT userId FROM doctors WHERE userId = :userId";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->bindParam(':userId', $userId);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        $sql = "UPDATE doctors SET 
                name = :name,
                picture = :picture,
                experience = :experience,
                biography = :biography,
                specialization = :specialization,
                qualification = :qualification,
                rating = :rating,
                patients = :patients,
                fee = :fee,
                availabilityStart = :availabilityStart,
                availabilityEnd = :availabilityEnd,
                location = :location
                WHERE userId = :userId";
    } else {
        $sql = "INSERT INTO doctors 
                (userId, name, picture, experience, biography, specialization, 
                 qualification, rating, patients, fee, availabilityStart, 
                 availabilityEnd, location) 
                VALUES 
                (:userId, :name, :picture, :experience, :biography, :specialization, 
                 :qualification, :rating, :patients, :fee, :availabilityStart, 
                 :availabilityEnd, :location)";
    }

    $stmt = $pdo->prepare($sql);

    $stmt->bindParam(':userId', $userId);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':picture', $picture);
    $stmt->bindParam(':experience', $experience);
    $stmt->bindParam(':biography', $biography);
    $stmt->bindParam(':specialization', $specialization);
    $stmt->bindParam(':qualification', $qualification);
    $stmt->bindParam(':rating', $rating);
    $stmt->bindParam(':patients', $patients);
    $stmt->bindParam(':fee', $fee);
    $stmt->bindParam(':availabilityStart', $availabilityStart);
    $stmt->bindParam(':availabilityEnd', $availabilityEnd);
    $stmt->bindParam(':location', $location);

    if ($stmt->execute()) {
        $action = $checkStmt->rowCount() > 0 ? 'updated' : 'added';
        echo json_encode([
            'status' => 'success', 
            'message' => "Doctor details {$action} successfully.",
            'action' => $action
        ]);
    } else {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Failed to save doctor details.',
            'errorInfo' => $stmt->errorInfo()
        ]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>