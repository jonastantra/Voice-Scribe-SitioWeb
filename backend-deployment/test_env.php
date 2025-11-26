<?php
// Script de diagnóstico para verificar el archivo .env
header('Content-Type: text/plain');

echo "--- DIAGNÓSTICO DE ARCHIVO .ENV ---\n\n";

$envFile = __DIR__ . '/.env';

// 1. Verificar existencia
if (file_exists($envFile)) {
    echo "✅ El archivo .env EXISTE en: " . $envFile . "\n";
    
    // 2. Verificar permisos de lectura
    if (is_readable($envFile)) {
        echo "✅ El archivo es LLEGIBLE por PHP.\n";
        
        // 3. Intentar leer contenido (sin mostrar la clave completa)
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        echo "📄 El archivo tiene " . count($lines) . " líneas con contenido.\n\n";
        
        $apiKeyFound = false;
        foreach ($lines as $line) {
            if (strpos(trim($line), 'API_KEY=') === 0) {
                $apiKeyFound = true;
                $parts = explode('=', $line, 2);
                $key = trim($parts[1]);
                $preview = substr($key, 0, 10) . '...' . substr($key, -4);
                echo "🔑 Se encontró API_KEY: " . $preview . "\n";
                echo "📏 Longitud de la clave: " . strlen($key) . " caracteres\n";
            }
        }
        
        if (!$apiKeyFound) {
            echo "❌ NO se encontró la línea que empieza con 'API_KEY='.\n";
            echo "Contenido de las líneas (solo nombres de variables):\n";
            foreach ($lines as $line) {
                $parts = explode('=', $line);
                echo "- " . $parts[0] . "\n";
            }
        }
        
    } else {
        echo "❌ El archivo EXISTE pero NO ES LLEGIBLE (Revisa permisos chmod, debería ser 644 o 600).\n";
    }
} else {
    echo "❌ El archivo .env NO SE ENCUENTRA.\n";
    echo "   Archivos en este directorio:\n";
    $files = scandir(__DIR__);
    foreach ($files as $file) {
        if ($file != '.' && $file != '..') {
            echo "   - " . $file . "\n";
        }
    }
}
?>

