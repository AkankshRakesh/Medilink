<?php
$host = 'sql111.infinityfree.com';
$dbname = 'if0_38181120_moodl'; // Change to your database name
$username = 'if0_38181120'; // Default XAMPP username
$password = 'POv09AmE6Hv2ewt'; // Default XAMPP password is empty

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
