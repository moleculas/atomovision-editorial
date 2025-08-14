<?php
/**
 * CORS Proxy para archivos de Archillect
 * Coloca este archivo en la raíz de tu WordPress: anomaliagravitatoria.net/cors-archillect.php
 */

// Configurar headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Si es una petición OPTIONS (preflight), terminar aquí
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Obtener el nombre del archivo solicitado
$file = isset($_GET['file']) ? $_GET['file'] : '';

// Validar que se proporcionó un archivo
if (empty($file)) {
    http_response_code(400);
    echo json_encode(['error' => 'No file specified']);
    exit();
}

// Sanitizar el nombre del archivo (prevenir path traversal)
$file = basename($file);

// Construir la ruta completa al archivo
$basePath = $_SERVER['DOCUMENT_ROOT'] . '/repositorio/assets/images/archillect/';
$filePath = $basePath . $file;

// Verificar que el archivo existe y está dentro del directorio permitido
if (!file_exists($filePath) || !is_file($filePath)) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit();
}

// Verificar que el archivo está dentro del directorio permitido
$realPath = realpath($filePath);
$realBasePath = realpath($basePath);
if (strpos($realPath, $realBasePath) !== 0) {
    http_response_code(403);
    echo json_encode(['error' => 'Access denied']);
    exit();
}

// Detectar el tipo MIME del archivo
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $filePath);
finfo_close($finfo);

// Configurar headers para la respuesta
header('Content-Type: ' . $mimeType);
header('Content-Length: ' . filesize($filePath));
header('Cache-Control: public, max-age=3600'); // Cache por 1 hora

// Enviar el archivo
readfile($filePath);
exit();
