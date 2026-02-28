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
        // Crear noticia (acepta FormData con archivos)
        $data = $_POST;
        if (empty($data['titulo']) || empty($data['contenido'])) {
            // Intentar JSON como fallback
            $jsonData = json_decode(file_get_contents('php://input'), true);
            if ($jsonData) $data = $jsonData;
        }

        if (empty($data['titulo']) || empty($data['contenido'])) {
            jsonResponse(['error' => 'Título y contenido son obligatorios'], 400);
        }

        // Procesar imagen
        $imagenUrl = null;
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $imgDir = __DIR__ . '/../img/noticias/';
            if (!is_dir($imgDir)) mkdir($imgDir, 0777, true);
            
            $ext = strtolower(pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION));
            $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            if (!in_array($ext, $allowed)) {
                jsonResponse(['error' => 'Formato de imagen no válido. Use: jpg, png, gif, webp'], 400);
            }
            
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $_FILES['imagen']['name']);
            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $imgDir . $fileName)) {
                $imagenUrl = 'img/noticias/' . $fileName;
            }
        }

        // Procesar archivo adjunto (PDF, Word)
        $archivoNombre = null;
        $archivoRuta = null;
        if (isset($_FILES['archivo_adjunto']) && $_FILES['archivo_adjunto']['error'] === UPLOAD_ERR_OK) {
            $archDir = __DIR__ . '/../uploads/noticias_archivos/';
            if (!is_dir($archDir)) mkdir($archDir, 0777, true);
            
            $ext = strtolower(pathinfo($_FILES['archivo_adjunto']['name'], PATHINFO_EXTENSION));
            $allowed = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
            if (!in_array($ext, $allowed)) {
                jsonResponse(['error' => 'Formato de archivo no válido. Use: pdf, doc, docx, xls, xlsx'], 400);
            }
            
            $archivoNombre = $_FILES['archivo_adjunto']['name'];
            $safeFileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '', $archivoNombre);
            if (move_uploaded_file($_FILES['archivo_adjunto']['tmp_name'], $archDir . $safeFileName)) {
                $archivoRuta = 'uploads/noticias_archivos/' . $safeFileName;
            }
        }

        $stmt = $pdo->prepare("INSERT INTO noticias (titulo, contenido, imagen_url, archivo_adjunto_nombre, archivo_adjunto_ruta, categoria, estado) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['titulo'],
            $data['contenido'],
            $imagenUrl,
            $archivoNombre,
            $archivoRuta,
            $data['categoria'] ?? 'general',
            $data['estado'] ?? 'publicado'
        ]);

        $user = getRequestUser();
        logActivity($pdo, 'crear', 'noticias', 'Publicó la noticia: "' . $data['titulo'] . '"', json_encode(['titulo' => $data['titulo'], 'categoria' => $data['categoria'] ?? 'general', 'estado' => $data['estado'] ?? 'publicado', 'imagen' => $imagenUrl ? 'Sí' : 'No', 'archivo' => $archivoNombre ?? 'No']), $user['id'], $user['nombre'], $user['email']);

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

        $user = getRequestUser();
        logActivity($pdo, 'editar', 'noticias', 'Editó la noticia: "' . $data['titulo'] . '"', json_encode(['id' => $data['id'], 'titulo' => $data['titulo']]), $user['id'], $user['nombre'], $user['email']);

        jsonResponse(['success' => true, 'message' => 'Noticia actualizada']);
        break;

    case 'DELETE':
        // Eliminar noticia
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) parse_str(file_get_contents('php://input'), $data);

        if (empty($data['id'])) {
            jsonResponse(['error' => 'ID es obligatorio'], 400);
        }

        // Obtener título y archivos antes de eliminar
        $info = $pdo->prepare("SELECT titulo, imagen_url, archivo_adjunto_ruta FROM noticias WHERE id = ?");
        $info->execute([$data['id']]);
        $noticiaInfo = $info->fetch();
        $tituloEliminado = $noticiaInfo ? $noticiaInfo['titulo'] : 'ID ' . $data['id'];

        // Eliminar archivos físicos
        if ($noticiaInfo) {
            if ($noticiaInfo['imagen_url'] && file_exists(__DIR__ . '/../' . $noticiaInfo['imagen_url'])) {
                unlink(__DIR__ . '/../' . $noticiaInfo['imagen_url']);
            }
            if ($noticiaInfo['archivo_adjunto_ruta'] && file_exists(__DIR__ . '/../' . $noticiaInfo['archivo_adjunto_ruta'])) {
                unlink(__DIR__ . '/../' . $noticiaInfo['archivo_adjunto_ruta']);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM noticias WHERE id = ?");
        $stmt->execute([$data['id']]);

        $user = getRequestUser();
        logActivity($pdo, 'eliminar', 'noticias', 'Eliminó la noticia: "' . $tituloEliminado . '"', json_encode(['id' => $data['id'], 'titulo' => $tituloEliminado]), $user['id'], $user['nombre'], $user['email']);

        jsonResponse(['success' => true, 'message' => 'Noticia eliminada']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
