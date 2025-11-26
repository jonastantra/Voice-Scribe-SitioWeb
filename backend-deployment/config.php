<?php
// Cargar variables de entorno
function loadEnv($path) {
    if (!file_exists($path)) {
        throw new Exception('.env file not found');
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        if (!array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
        }
    }
}

// Cargar el archivo .env
// Nota: En el servidor, asegúrate de renombrar env_config.txt a .env
if (file_exists(__DIR__ . '/.env')) {
    loadEnv(__DIR__ . '/.env');
} elseif (file_exists(__DIR__ . '/env_config.txt')) {
    loadEnv(__DIR__ . '/env_config.txt');
}

// Configuración
define('API_KEY', getenv('API_KEY'));
define('ALLOWED_EXTENSION_ID', getenv('ALLOWED_EXTENSION_ID'));
define('API_ENDPOINT', 'https://api.openai.com/v1/chat/completions'); // OpenAI API

// La verificación de la API Key se ha movido a proxy.php para permitir manejo de OPTIONS
?>

