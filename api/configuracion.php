<?php
// ============================================
// API: Configuración
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT clave, valor FROM configuracion");
        $config = [];
        while ($row = $stmt->fetch()) {
            $config[$row['clave']] = $row['valor'];
        }
        jsonResponse($config);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data) || !is_array($data)) {
            jsonResponse(['error' => 'Datos inválidos'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO configuracion (clave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = ?");
        
        foreach ($data as $clave => $valor) {
            $stmt->execute([$clave, $valor, $valor]);
        }

        jsonResponse(['success' => true, 'message' => 'Configuración actualizada']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
