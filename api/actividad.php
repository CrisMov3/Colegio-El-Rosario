<?php
// ============================================
// API: Actividad Reciente (Log)
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $stmt = $pdo->prepare("SELECT * FROM actividad ORDER BY created_at DESC LIMIT ?");
    $stmt->bindValue(1, $limit, PDO::PARAM_INT);
    $stmt->execute();
    jsonResponse($stmt->fetchAll());
}

jsonResponse(['error' => 'Método no permitido'], 405);
