<?php
// ============================================
// API: Noticias
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Obtener noticias
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM noticias WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $noticia = $stmt->fetch();
            if ($noticia) {
                jsonResponse($noticia);
            } else {
                jsonResponse(['error' => 'Noticia no encontrada'], 404);
            }
        } else {
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $estado = isset($_GET['estado']) ? $_GET['estado'] : 'publicado';
            $stmt = $pdo->prepare("SELECT * FROM noticias WHERE estado = ? ORDER BY fecha_publicacion DESC LIMIT ?");
            $stmt->bindValue(1, $estado, PDO::PARAM_STR);
            $stmt->bindValue(2, $limit, PDO::PARAM_INT);
            $stmt->execute();
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'POST':
        // Crear noticia
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) $data = $_POST;

        if (empty($data['titulo']) || empty($data['contenido'])) {
            jsonResponse(['error' => 'Título y contenido son obligatorios'], 400);
        }

        $stmt = $pdo->prepare("INSERT INTO noticias (titulo, contenido, imagen_url, categoria, estado) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['titulo'],
            $data['contenido'],
            $data['imagen_url'] ?? null,
            $data['categoria'] ?? 'general',
            $data['estado'] ?? 'publicado'
        ]);

        jsonResponse(['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'Noticia creada exitosamente'], 201);
        break;

    case 'PUT':
        // Actualizar noticia
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id'])) {
            jsonResponse(['error' => 'ID es obligatorio'], 400);
        }

        $stmt = $pdo->prepare("UPDATE noticias SET titulo = ?, contenido = ?, imagen_url = ?, categoria = ?, estado = ? WHERE id = ?");
        $stmt->execute([
            $data['titulo'],
            $data['contenido'],
            $data['imagen_url'] ?? null,
            $data['categoria'] ?? 'general',
            $data['estado'] ?? 'publicado',
            $data['id']
        ]);

        jsonResponse(['success' => true, 'message' => 'Noticia actualizada']);
        break;

    case 'DELETE':
        // Eliminar noticia
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) parse_str(file_get_contents('php://input'), $data);

        if (empty($data['id'])) {
            jsonResponse(['error' => 'ID es obligatorio'], 400);
        }

        $stmt = $pdo->prepare("DELETE FROM noticias WHERE id = ?");
        $stmt->execute([$data['id']]);

        jsonResponse(['success' => true, 'message' => 'Noticia eliminada']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
