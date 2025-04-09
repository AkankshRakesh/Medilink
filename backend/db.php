<?php
// $host = 'localhost';
// $dbname = 'moodl';
// $username = 'root'; 
// $password = ''; 

$host = 'sql12.freesqldatabase.com';
$dbname = 'sql12771973';
$username = 'sql12771973'; 
$password = "H3S3Kie3Bz";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
