<?php
// ============================================
// Conexión a la Base de Datos
// ============================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-User');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

define('DB_HOST', 'localhost');
define('DB_NAME', 'colegio_rosario');
define('DB_USER', 'root');
define('DB_PASS', '');

function getConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error de conexión: ' . $e->getMessage()]);
        exit();
    }
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * Registrar actividad en el log
 */
function logActivity($pdo, $tipo, $seccion, $descripcion, $detalles = null, $usuarioId = null, $usuarioNombre = null, $usuarioEmail = null) {
    try {
        $stmt = $pdo->prepare("INSERT INTO actividad (tipo, seccion, descripcion, detalles, usuario_id, usuario_nombre, usuario_email) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$tipo, $seccion, $descripcion, $detalles, $usuarioId, $usuarioNombre, $usuarioEmail]);
    } catch (Exception $e) {
        // No interrumpir el flujo si falla el log
    }
}

/**
 * Obtener datos del usuario desde el header X-User (enviado desde el frontend)
 */
function getRequestUser() {
    $userHeader = $_SERVER['HTTP_X_USER'] ?? null;
    if ($userHeader) {
        $user = json_decode($userHeader, true);
        if ($user) return $user;
    }
    return ['id' => null, 'nombre' => 'Sistema', 'email' => ''];
}
