<?php
// ============================================
// API: Docentes
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM docentes WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $docente = $stmt->fetch();
            if ($docente) {
                jsonResponse($docente);
            } else {
                jsonResponse(['error' => 'Docente no encontrado'], 404);
            }
        } else {
            // Por defecto solo activos, salvo que pidan todos
            $soloActivos = isset($_GET['todos']) ? false : true;
            if ($soloActivos) {
                $stmt = $pdo->query("SELECT * FROM docentes WHERE estado = 1 ORDER BY nombre ASC");
            } else {
                $stmt = $pdo->query("SELECT * FROM docentes ORDER BY nombre ASC");
            }
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) $data = $_POST;

        if (empty($data['nombre']) || empty($data['asignatura']) || empty($data['correo'])) {
            jsonResponse(['error' => 'Nombre, asignatura y correo son obligatorios'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO docentes (nombre, asignatura, correo) VALUES (?, ?, ?)");
        $stmt->execute([
            $data['nombre'],
            $data['asignatura'],
            $data['correo']
        ]);

        jsonResponse(['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'Docente agregado exitosamente'], 201);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id'])) {
            jsonResponse(['error' => 'ID es obligatorio'], 400);
        }

        $stmt = $pdo->prepare("UPDATE docentes SET nombre = ?, asignatura = ?, correo = ?, estado = ? WHERE id = ?");
        $stmt->execute([
            $data['nombre'],
            $data['asignatura'],
            $data['correo'],
            $data['estado'] ?? 1,
            $data['id']
        ]);

        jsonResponse(['success' => true, 'message' => 'Docente actualizado']);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id'])) {
            jsonResponse(['error' => 'ID es obligatorio'], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM docentes WHERE id = ?");
        $stmt->execute([$data['id']]);

        jsonResponse(['success' => true, 'message' => 'Docente eliminado']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
