<?php
$host = 'monorail.proxy.rlwy.net'; // Hostname provided by Railway
$dbname = 'railway'; // Database name
$username = 'root'; // Username
$password = 'NiCzDipmEBNMcTEAwczlKtgrmlChhCZe'; // Password provided
$port = 50702; // Port number for the connection
//mysql://root:NiCzDipmEBNMcTEAwczlKtgrmlChhCZe@monorail.proxy.rlwy.net:50702/railway
try {
    // Use the port in the DSN string for the connection
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
