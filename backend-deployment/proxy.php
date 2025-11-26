<?php
require_once 'config.php';

// Solo permitir POST y OPTIONS
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verificar que la API key existe (después del preflight)
if (!defined('API_KEY') || !API_KEY || API_KEY === 'tu_api_key_aqui') {
    http_response_code(500);
    die(json_encode(['error' => 'API key not configured in server']));
}

// Verificar origen (Seguridad Extra)
// Descomentar y configurar en producción para mayor seguridad
/*
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (strpos($origin, ALLOWED_EXTENSION_ID) === false && ALLOWED_EXTENSION_ID !== 'chrome-extension://id_de_tu_extension') {
    http_response_code(403);
    die(json_encode(['error' => 'Forbidden origin']));
}
*/

// Leer el body de la petición
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON']));
}

// Rate limiting básico (opcional)
session_start();
$maxRequests = 100;
$timeWindow = 3600; // 1 hora

if (!isset($_SESSION['request_count'])) {
    $_SESSION['request_count'] = 0;
    $_SESSION['window_start'] = time();
}

if (time() - $_SESSION['window_start'] > $timeWindow) {
    $_SESSION['request_count'] = 0;
    $_SESSION['window_start'] = time();
}

if ($_SESSION['request_count'] >= $maxRequests) {
    http_response_code(429);
    die(json_encode(['error' => 'Rate limit exceeded']));
}

$_SESSION['request_count']++;

// Hacer la petición a OpenAI
$ch = curl_init(API_ENDPOINT);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . API_KEY
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Devolver la respuesta
http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;
?>

