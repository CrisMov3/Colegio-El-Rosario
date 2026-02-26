<?php
// ============================================
// API: Login / Autenticación
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    jsonResponse(['error' => 'Método no permitido'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['email']) || empty($data['password'])) {
    jsonResponse(['error' => 'Correo y contraseña son obligatorios'], 400);
}

$email = trim($data['email']);
$password = $data['password'];

// Buscar usuario por email
$stmt = $pdo->prepare("SELECT id, nombre, email, password, rol, permisos, activo FROM usuarios WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    jsonResponse(['error' => 'Credenciales incorrectas'], 401);
}

if ($user['activo'] != 1) {
    jsonResponse(['error' => 'Esta cuenta está desactivada'], 403);
}

// Verificar contraseña (texto plano)
if ($password !== $user['password']) {
    jsonResponse(['error' => 'Credenciales incorrectas'], 401);
}

// Login exitoso
$permisos = $user['permisos'] ? json_decode($user['permisos'], true) : [];

jsonResponse([
    'success' => true,
    'message' => 'Inicio de sesión exitoso',
    'user' => [
        'id' => $user['id'],
        'nombre' => $user['nombre'],
        'email' => $user['email'],
        'rol' => $user['rol'],
        'permisos' => $permisos
    ]
]);
