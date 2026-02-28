<?php
// ============================================
// API: Documentos
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM documentos WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $doc = $stmt->fetch();
            if ($doc) {
                jsonResponse($doc);
            } else {
                jsonResponse(['error' => 'Documento no encontrado'], 404);
            }
        } else {
            $stmt = $pdo->query("SELECT * FROM documentos ORDER BY created_at DESC");
            jsonResponse($stmt->fetchAll());
        }
        break;

    case 'POST':
        // Subir documento
        $titulo = $_POST['titulo'] ?? '';
        $descripcion = $_POST['descripcion'] ?? '';
        $categoria = $_POST['categoria'] ?? 'academico';

        if (empty($titulo)) {
            jsonResponse(['error' => 'El título es obligatorio'], 400);
        }

        $archivoNombre = '';
        $archivoRuta = '';
        $archivoTamano = '';

        if (isset($_FILES['archivo']) && $_FILES['archivo']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . '/../PDF/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $archivoNombre = basename($_FILES['archivo']['name']);
            $archivoRuta = 'PDF/' . $archivoNombre;
            $archivoTamano = round($_FILES['archivo']['size'] / 1024 / 1024, 2) . ' MB';

            move_uploaded_file($_FILES['archivo']['tmp_name'], $uploadDir . $archivoNombre);
        }

        $stmt = $pdo->prepare("INSERT INTO documentos (titulo, descripcion, archivo_nombre, archivo_ruta, archivo_tamano, categoria) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$titulo, $descripcion, $archivoNombre, $archivoRuta, $archivoTamano, $categoria]);

        $user = getRequestUser();
        logActivity($pdo, 'crear', 'documentos', 'Subió el documento: "' . $titulo . '"', json_encode(['titulo' => $titulo, 'archivo' => $archivoNombre, 'categoria' => $categoria, 'tamano' => $archivoTamano]), $user['id'], $user['nombre'], $user['email']);

        jsonResponse(['success' => true, 'id' => $pdo->lastInsertId(), 'message' => 'Documento subido exitosamente'], 201);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['id'])) {
            jsonResponse(['error' => 'ID es obligatorio'], 400);
        }

        // Obtener info antes de eliminar
        $info = $pdo->prepare("SELECT titulo, archivo_nombre FROM documentos WHERE id = ?");
        $info->execute([$data['id']]);
        $docInfo = $info->fetch();
        $tituloDoc = $docInfo ? $docInfo['titulo'] : 'ID ' . $data['id'];

        // Obtener ruta del archivo para eliminarlo
        $stmt = $pdo->prepare("SELECT archivo_ruta FROM documentos WHERE id = ?");
        $stmt->execute([$data['id']]);
        $doc = $stmt->fetch();

        if ($doc && file_exists(__DIR__ . '/../' . $doc['archivo_ruta'])) {
            unlink(__DIR__ . '/../' . $doc['archivo_ruta']);
        }

        $stmt = $pdo->prepare("DELETE FROM documentos WHERE id = ?");
        $stmt->execute([$data['id']]);

        $user = getRequestUser();
        logActivity($pdo, 'eliminar', 'documentos', 'Eliminó el documento: "' . $tituloDoc . '"', json_encode(['id' => $data['id'], 'titulo' => $tituloDoc, 'archivo' => $docInfo ? $docInfo['archivo_nombre'] : '']), $user['id'], $user['nombre'], $user['email']);

        jsonResponse(['success' => true, 'message' => 'Documento eliminado']);
        break;

    default:
        jsonResponse(['error' => 'Método no permitido'], 405);
}
