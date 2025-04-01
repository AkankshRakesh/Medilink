<?php
$host = 'localhost';
$dbname = 'moodl';
$username = 'root'; 
$password = ''; 

try {
    echo "YEEE";
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
