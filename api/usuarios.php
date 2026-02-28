<?php
// ============================================
// API: Gestión de Usuarios Administradores
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ===== GET: Listar usuarios =====
if ($method === 'GET') {
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT id, nombre, email, rol, permisos, activo, created_at FROM usuarios WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $user = $stmt->fetch();
        if ($user) {
            $user['permisos'] = $user['permisos'] ? json_decode($user['permisos'], true) : [];
            jsonResponse($user);
        } else {
            jsonResponse(['error' => 'Usuario no encontrado'], 404);
        }
    } else {
        $stmt = $pdo->query("SELECT id, nombre, email, rol, permisos, activo, created_at FROM usuarios ORDER BY created_at DESC");
        $usuarios = $stmt->fetchAll();
        foreach ($usuarios as &$u) {
            $u['permisos'] = $u['permisos'] ? json_decode($u['permisos'], true) : [];
        }
        jsonResponse($usuarios);
    }
}

// ===== POST: Crear usuario =====
if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['nombre']) || empty($data['email']) || empty($data['password'])) {
        jsonResponse(['error' => 'Nombre, email y contraseña son obligatorios'], 400);
    }

    // Verificar que el email no exista
    $check = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $check->execute([trim($data['email'])]);
    if ($check->fetch()) {
        jsonResponse(['error' => 'Ya existe un usuario con ese correo electrónico'], 400);
    }

    $rol = $data['rol'] ?? 'editor';
    $permisos = isset($data['permisos']) ? json_encode($data['permisos']) : '[]';
    $activo = isset($data['activo']) ? (int)$data['activo'] : 1;

    $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, password, rol, permisos, activo) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        trim($data['nombre']),
        trim($data['email']),
        $data['password'],
        $rol,
        $permisos,
        $activo
    ]);

    $newId = $pdo->lastInsertId();
    $user = getRequestUser();
    logActivity($pdo, 'crear', 'usuarios', 'Creó al usuario: "' . trim($data['nombre']) . '"', json_encode(['id' => $newId, 'nombre' => trim($data['nombre']), 'email' => trim($data['email']), 'rol' => $rol]), $user['id'], $user['nombre'], $user['email']);

    jsonResponse(['success' => true, 'id' => $newId, 'message' => 'Usuario creado correctamente']);
}

// ===== PUT: Actualizar usuario =====
if ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['id'])) {
        jsonResponse(['error' => 'ID de usuario requerido'], 400);
    }

    $id = (int)$data['id'];

    // Verificar que el usuario exista
    $check = $pdo->prepare("SELECT id, email FROM usuarios WHERE id = ?");
    $check->execute([$id]);
    $existing = $check->fetch();
    if (!$existing) {
        jsonResponse(['error' => 'Usuario no encontrado'], 404);
    }

    // Si cambia el email, verificar que no esté en uso
    if (!empty($data['email']) && trim($data['email']) !== $existing['email']) {
        $emailCheck = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
        $emailCheck->execute([trim($data['email']), $id]);
        if ($emailCheck->fetch()) {
            jsonResponse(['error' => 'Ya existe otro usuario con ese correo electrónico'], 400);
        }
    }

    // Construir actualización dinámica
    $fields = [];
    $values = [];

    if (!empty($data['nombre'])) {
        $fields[] = "nombre = ?";
        $values[] = trim($data['nombre']);
    }
    if (!empty($data['email'])) {
        $fields[] = "email = ?";
        $values[] = trim($data['email']);
    }
    if (!empty($data['password'])) {
        $fields[] = "password = ?";
        $values[] = $data['password'];
    }
    if (isset($data['rol'])) {
        $fields[] = "rol = ?";
        $values[] = $data['rol'];
    }
    if (isset($data['permisos'])) {
        $fields[] = "permisos = ?";
        $values[] = json_encode($data['permisos']);
    }
    if (isset($data['activo'])) {
        $fields[] = "activo = ?";
        $values[] = (int)$data['activo'];
    }

    if (empty($fields)) {
        jsonResponse(['error' => 'No hay campos para actualizar'], 400);
    }

    $values[] = $id;
    $sql = "UPDATE usuarios SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);

    $user = getRequestUser();
    logActivity($pdo, 'editar', 'usuarios', 'Editó al usuario: "' . ($data['nombre'] ?? 'ID '.$id) . '"', json_encode(['id' => $id, 'campos_editados' => array_keys(array_filter($data, fn($k) => $k !== 'id', ARRAY_FILTER_USE_KEY))]), $user['id'], $user['nombre'], $user['email']);

    jsonResponse(['success' => true, 'message' => 'Usuario actualizado correctamente']);
}

// ===== DELETE: Eliminar usuario =====
if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['id'])) {
        jsonResponse(['error' => 'ID de usuario requerido'], 400);
    }

    $id = (int)$data['id'];

    // No permitir eliminar al propio usuario que está logueado (protección básica)
    // Verificar que no sea el último admin activo
    $adminCount = $pdo->query("SELECT COUNT(*) FROM usuarios WHERE rol = 'admin' AND activo = 1")->fetchColumn();
    $targetUser = $pdo->prepare("SELECT rol, activo FROM usuarios WHERE id = ?");
    $targetUser->execute([$id]);
    $target = $targetUser->fetch();

    if (!$target) {
        jsonResponse(['error' => 'Usuario no encontrado'], 404);
    }

    if ($target['rol'] === 'admin' && $target['activo'] == 1 && $adminCount <= 1) {
        jsonResponse(['error' => 'No se puede eliminar el último administrador activo'], 400);
    }

    // Obtener info antes de eliminar
    $info = $pdo->prepare("SELECT nombre, email FROM usuarios WHERE id = ?");
    $info->execute([$id]);
    $userInfo = $info->fetch();
    $nombreElim = $userInfo ? $userInfo['nombre'] : 'ID ' . $id;

    $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt->execute([$id]);

    $user = getRequestUser();
    logActivity($pdo, 'eliminar', 'usuarios', 'Eliminó al usuario: "' . $nombreElim . '"', json_encode(['id' => $id, 'nombre' => $nombreElim, 'email' => $userInfo ? $userInfo['email'] : '']), $user['id'], $user['nombre'], $user['email']);

    jsonResponse(['success' => true, 'message' => 'Usuario eliminado correctamente']);
}
