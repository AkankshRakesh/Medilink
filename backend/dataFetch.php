<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Get input data
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['state']) || !isset($input['district']) || !isset($input['market'])) {
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$state = urlencode($input['state']);
$district = urlencode($input['district']);
$market = urlencode($input['market']);

// API key (replace with your valid API key)
$apiKey = "579b464db66ec23bdd000001556554ee2261452b48fec3ffd6aa8e79";

// Construct API URL
$url = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=$apiKey&format=json&filters%5Bstate.keyword%5D=$state&filters%5Bdistrict%5D=$district&filters%5Bmarket%5D=$market";

// Fetch data from API
$response = file_get_contents($url);

if ($response === FALSE) {
    echo json_encode(["error" => "Failed to fetch data"]);
    exit;
}

// Return API response
echo $response;
?>
