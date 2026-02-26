<?php
// ============================================
// API: PQRS
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM pqrs ORDER BY created_at DESC");
        jsonResponse($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) $data = $_POST;

        if (empty($data['nombre']) || empty($data['correo']) || empty($data['tipo']) || empty($data['asunto']) || empty($data['mensaje'])) {
            jsonResponse(['error' => 'Todos los campos son obligatorios'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO pqrs (nombre, correo, tipo, asunto, mensaje) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['nombre'],
            $data['correo'],
            $data['tipo'],
            $data['asunto'],
            $data['mensaje']
        ]);

        jsonResponse(['success' => true, 'message' => 'PQRS registrado exitosamente'], 201);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id']) || empty($data['estado'])) {
            jsonResponse(['error' => 'ID y estado son obligatorios'], 400);
        }

        $stmt = $pdo->prepare("UPDATE pqrs SET estado = ? WHERE id = ?");
        $stmt->execute([$data['estado'], $data['id']]);

        jsonResponse(['success' => true, 'message' => 'Estado actualizado']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
