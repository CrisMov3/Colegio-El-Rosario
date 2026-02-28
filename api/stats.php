<?php
// ============================================
// API: Estadísticas del Dashboard
// ============================================
require_once __DIR__ . '/db.php';

$pdo = getConnection();

$noticias = $pdo->query("SELECT COUNT(*) FROM noticias")->fetchColumn();
$documentos = $pdo->query("SELECT COUNT(*) FROM documentos")->fetchColumn();
$docentes = $pdo->query("SELECT COUNT(*) FROM docentes WHERE estado = 1")->fetchColumn();
$usuarios = $pdo->query("SELECT COUNT(*) FROM usuarios WHERE activo = 1")->fetchColumn();
$pqrs_pendientes = $pdo->query("SELECT COUNT(*) FROM pqrs WHERE estado = 'pendiente'")->fetchColumn();

jsonResponse([
    'noticias' => (int)$noticias,
    'documentos' => (int)$documentos,
    'docentes' => (int)$docentes,
    'usuarios' => (int)$usuarios,
    'pqrs_pendientes' => (int)$pqrs_pendientes
]);
