<?php
// ============================================
// API: PQRS
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM pqrs WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $pqrs = $stmt->fetch();
            if ($pqrs) {
                jsonResponse($pqrs);
            } else {
                jsonResponse(['error' => 'PQRS no encontrado'], 404);
            }
        } else {
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
            $estado = $_GET['estado'] ?? null;
            
            if ($estado && in_array($estado, ['pendiente', 'en_proceso', 'resuelto', 'anulado'])) {
                $stmt = $pdo->prepare("SELECT * FROM pqrs WHERE estado = ? ORDER BY created_at DESC LIMIT ?");
                $stmt->execute([$estado, $limit]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM pqrs ORDER BY created_at DESC LIMIT ?");
                $stmt->execute([$limit]);
            }
            jsonResponse($stmt->fetchAll());
        }
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

        $validEstados = ['pendiente', 'en_proceso', 'resuelto', 'anulado'];
        if (!in_array($data['estado'], $validEstados)) {
            jsonResponse(['error' => 'Estado no válido'], 400);
        }

        // Obtener datos actuales para log
        $stmtCurrent = $pdo->prepare("SELECT * FROM pqrs WHERE id = ?");
        $stmtCurrent->execute([$data['id']]);
        $current = $stmtCurrent->fetch();

        if (!$current) {
            jsonResponse(['error' => 'PQRS no encontrado'], 404);
        }

        $stmt = $pdo->prepare("UPDATE pqrs SET estado = ? WHERE id = ?");
        $stmt->execute([$data['estado'], $data['id']]);

        $user = getRequestUser();

        logActivity($pdo, 'editar', 'pqrs', "Estado PQRS #{$data['id']} cambiado a '{$data['estado']}'", json_encode([
            'pqrs_id' => $data['id'],
            'tipo' => $current['tipo'],
            'asunto' => $current['asunto'],
            'estado_anterior' => $current['estado'],
            'estado_nuevo' => $data['estado']
        ]), $user['id'] ?? null, $user['nombre'] ?? 'Sistema', $user['email'] ?? '');

        jsonResponse(['success' => true, 'message' => 'Estado actualizado']);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id'])) {
            jsonResponse(['error' => 'ID es obligatorio'], 400);
        }

        // Obtener datos para log
        $stmtCurrent = $pdo->prepare("SELECT * FROM pqrs WHERE id = ?");
        $stmtCurrent->execute([$data['id']]);
        $current = $stmtCurrent->fetch();

        if (!$current) {
            jsonResponse(['error' => 'PQRS no encontrado'], 404);
        }

        $stmt = $pdo->prepare("DELETE FROM pqrs WHERE id = ?");
        $stmt->execute([$data['id']]);

        $user = getRequestUser();

        logActivity($pdo, 'eliminar', 'pqrs', "PQRS #{$data['id']} eliminado: {$current['asunto']}", json_encode([
            'pqrs_id' => $data['id'],
            'tipo' => $current['tipo'],
            'asunto' => $current['asunto'],
            'nombre' => $current['nombre']
        ]), $user['id'] ?? null, $user['nombre'] ?? 'Sistema', $user['email'] ?? '');

        jsonResponse(['success' => true, 'message' => 'PQRS eliminado']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
