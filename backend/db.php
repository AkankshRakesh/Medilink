<?php
// $host = 'localhost';
// $dbname = 'moodl';
// $username = 'root'; 
// $password = ''; 

$host = 'sql12.freesqldatabase.com';
$dbname = 'sql12770743';
$username = 'sql12770743'; 
$password = "UBPDqGn3xc";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
