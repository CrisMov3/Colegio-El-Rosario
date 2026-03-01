<?php
// Página de búsqueda para el sitio web del Colegio El Rosario

$query = isset($_GET['q']) ? htmlspecialchars($_GET['q'], ENT_QUOTES, 'UTF-8') : '';
$encoding = isset($_GET['ie']) ? $_GET['ie'] : 'UTF-8';

// Base de datos de búsqueda con páginas disponibles
$pages = [
    ['url' => 'index.html', 'title' => 'Inicio', 'description' => 'Página principal del Colegio El Rosario', 'keywords' => 'inicio, home, principal'],
    ['url' => 'resena-historica.html', 'title' => 'Reseña Histórica', 'description' => 'Conoce la historia del Colegio El Rosario', 'keywords' => 'historia, reseña, fundación, trayectoria'],
    ['url' => 'mision-vision.html', 'title' => 'Misión y Visión', 'description' => 'Misión, visión y valores de nuestra institución', 'keywords' => 'misión, visión, valores, objetivos'],
    ['url' => 'oferta-academica.html', 'title' => 'Oferta Académica', 'description' => 'Procedimientos y grados que ofrecemos', 'keywords' => 'preescolar, primaria, bachillerato, programas, académica'],
    ['url' => 'plan-estudio.html', 'title' => 'Plan de Estudios', 'description' => 'Plan de estudios y currículum', 'keywords' => 'plan, estudios, currículo, materias, asignaturas'],
    ['url' => 'Evaluación y promoción.html', 'title' => 'Evaluación y Promoción', 'description' => 'Políticas de evaluación y promoción', 'keywords' => 'evaluación, promoción, calificaciones, notas'],
    ['url' => 'Proyectos pedagógicos.html', 'title' => 'Proyectos Pedagógicos', 'description' => 'Conozca nuestros proyectos pedagógicos', 'keywords' => 'proyectos, pedagogía, educación, iniciativas'],
    ['url' => 'Talento humano.html', 'title' => 'Talento Humano', 'description' => 'Información sobre el talento humano de la institución', 'keywords' => 'personal, docentes, talento, equipo'],
    ['url' => 'contratacion.html', 'title' => 'Contratación', 'description' => 'Procesos de contratación y selección', 'keywords' => 'contratación, empleo, vacantes, selección'],
    ['url' => 'presupuesto.html', 'title' => 'Presupuesto', 'description' => 'Información presupuestaria de la institución', 'keywords' => 'presupuesto, financiero, gastos, ingresos'],
    ['url' => 'tramites.html', 'title' => 'Trámites', 'description' => 'Trámites y procedimientos administrativos', 'keywords' => 'trámites, certificados, procedimientos, administrativo'],
    ['url' => 'docentes.html', 'title' => 'Docentes', 'description' => 'Nuestro equipo de docentes', 'keywords' => 'docentes, maestros, profesores, equipo educativo'],
    ['url' => 'atencion-ciudadano.html', 'title' => 'Atención al Ciudadano', 'description' => 'Canales de atención al ciudadano', 'keywords' => 'atención, contacto, comunicación, solicitud'],
    ['url' => 'escuela-padres.html', 'title' => 'Escuela de Padres', 'description' => 'Programa de escuela de padres', 'keywords' => 'padres, familia, educación, talleres'],
    ['url' => 'participacion.html', 'title' => 'Participación', 'description' => 'Mecanismos de participación en la institución', 'keywords' => 'participación, comunidad, involucramiento, consejo'],
    ['url' => 'Gobierno Escolar.html', 'title' => 'Gobierno Escolar', 'description' => 'Estructura del gobierno escolar', 'keywords' => 'gobierno, escolar, estructura, organización'],
    ['url' => 'Símbolos institucionales.html', 'title' => 'Símbolos Institucionales', 'description' => 'Símbolos y emblemas de la institución', 'keywords' => 'símbolos, emblemas, bandera, escudo, insignia'],
];

// Función para buscar en las páginas
function searchPages($query, $pages) {
    if (empty($query)) {
        return [];
    }
    
    $query_lower = strtolower($query);
    $results = [];
    
    foreach ($pages as $page) {
        $title_match = stripos($page['title'], $query) !== false;
        $description_match = stripos($page['description'], $query) !== false;
        $keywords_match = stripos($page['keywords'], $query) !== false;
        
        if ($title_match || $description_match || $keywords_match) {
            $relevance = 0;
            if ($title_match) $relevance += 3;
            if ($description_match) $relevance += 2;
            if ($keywords_match) $relevance += 1;
            
            $results[] = [
                'page' => $page,
                'relevance' => $relevance
            ];
        }
    }
    
    // Ordenar por relevancia
    usort($results, function($a, $b) {
        return $b['relevance'] - $a['relevance'];
    });
    
    return $results;
}

$results = searchPages($query, $pages);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados de búsqueda - Colegio El Rosario</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="icon" href="img/logo.png" type="image/x-icon">
    <style>
        .search-results-container {
            max-width: 900px;
            margin: 60px auto;
            padding: 0 20px;
        }
        
        .search-header {
            margin-bottom: 40px;
        }
        
        .search-header h1 {
            color: var(--primary-color);
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .search-query {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 5px;
        }
        
        .search-query strong {
            color: var(--dark-text);
            font-weight: 600;
        }
        
        .results-count {
            color: #888;
            font-size: 0.95rem;
        }
        
        .search-box {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .search-box form {
            display: flex;
            gap: 10px;
        }
        
        .search-box input {
            flex: 1;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
        }
        
        .search-box button {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .search-box button:hover {
            background: #006064;
            transform: translateY(-2px);
        }
        
        .no-results {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            color: #856404;
        }
        
        .no-results i {
            font-size: 3rem;
            margin-bottom: 15px;
            color: #ffc107;
        }
        
        .no-results h2 {
            color: #856404;
            margin-bottom: 10px;
        }
        
        .search-results {
            display: grid;
            gap: 20px;
        }
        
        .search-result-item {
            background: white;
            border-left: 4px solid var(--primary-color);
            padding: 20px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        
        .search-result-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        
        .result-title {
            display: inline-block;
            color: var(--primary-color);
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 8px;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .search-result-item:hover .result-title {
            color: #006064;
            text-decoration: underline;
        }
        
        .result-description {
            color: #666;
            margin-bottom: 12px;
            line-height: 1.6;
        }
        
        .result-url {
            color: #08a;
            font-size: 0.9rem;
            word-break: break-all;
        }
        
        main {
            min-height: calc(100vh - 400px);
        }
    </style>
</head>
<body>

<!-- BARRA GOV.CO -->
<div class="gov-bar">
    <div class="gov-container">
        <img src="https://govco-prod-webutils.s3.us-east-1.amazonaws.com/uploads/2025-08-29/f2b1a485-5e1a-4ac3-a002-067b69bed7aa-1imagen_noticia.png"
             alt="GOV.CO"
             class="gov-logo">
        <div class="gov-right">
            <a href="index.html" class="lang-btn active">ES</a>
            <a href="index-en.html" class="lang-btn">EN</a>
        </div>
    </div>
</div>

<!-- HEADER PRINCIPAL -->
<header class="main-header">
    <div class="container header-content">
        <div class="logo-container">
            <img src="img/logo.png" alt="Logo Institucional" class="logo-img">
            <div class="logo-text">
                <h1>Colegio El Rosario de Itagüí</h1>
                <span>Itagüí · Antioquia</span>
            </div>
        </div>
        <nav class="main-nav">
            <ul class="nav-links">
                <li><a href="index.html">Inicio</a></li>
                <li class="dropdown">
                    <a href="#">Institucional</a>
                    <ul class="dropdown-menu">
                        <li><a href="resena-historica.html">Reseña histórica</a></li>
                        <li><a href="mision-vision.html">Misión, visión y valores</a></li>
                        <li><a href="Gobierno Escolar.html">Gobierno Escolar</a></li>
                        <li><a href="Símbolos institucionales.html">Símbolos institucionales</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#">Académica</a>
                    <ul class="dropdown-menu">
                        <li><a href="oferta-academica.html">Oferta académica</a></li>
                        <li><a href="plan-estudio.html">Plan de estudios</a></li>
                        <li><a href="Evaluación y promoción.html">Evaluación y promoción</a></li>
                    </ul>
                </li>
                <li class="search-item">
                    <div class="search-container">
                        <input type="text" class="search-input" id="nav-search" placeholder="Buscar...">
                        <button class="search-btn" type="button"><i class="fas fa-search"></i></button>
                    </div>
                </li>
            </ul>
            <div class="hamburger">
                <i class="fas fa-bars"></i>
            </div>
        </nav>
    </div>
</header>

<main>
    <div class="search-results-container">
        <div class="search-header">
            <h1><i class="fas fa-search"></i> Resultados de Búsqueda</h1>
            <?php if (!empty($query)): ?>
                <div class="search-query">Búsqueda para: <strong><?php echo $query; ?></strong></div>
                <div class="results-count">
                    <?php 
                    if (count($results) > 0) {
                        echo count($results) . ' resultado' . (count($results) != 1 ? 's encontrado' : ' encontrado') . 's';
                    }
                    ?>
                </div>
            <?php endif; ?>
        </div>
        
        <div class="search-box">
            <form method="GET" action="buscarWeb.php">
                <input type="text" name="q" placeholder="Buscar en el sitio..." value="<?php echo $query; ?>" autofocus>
                <button type="submit"><i class="fas fa-search"></i> Buscar</button>
            </form>
        </div>
        
        <?php if (empty($query)): ?>
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h2>Ingresa un término de búsqueda</h2>
                <p>Usa la barra de búsqueda arriba para encontrar lo que buscas en nuestro sitio.</p>
            </div>
        <?php elseif (count($results) === 0): ?>
            <div class="no-results">
                <i class="fas fa-exclamation-circle"></i>
                <h2>No se encontraron resultados para el texto '<?php echo $query; ?>'</h2>
                <p>Intenta con otros términos de búsqueda o navega por nuestras secciones principales.</p>
            </div>
        <?php else: ?>
            <div class="search-results">
                <?php foreach ($results as $result): ?>
                    <div class="search-result-item">
                        <a href="<?php echo $result['page']['url']; ?>" class="result-title">
                            <?php echo $result['page']['title']; ?>
                        </a>
                        <div class="result-description">
                            <?php echo $result['page']['description']; ?>
                        </div>
                        <div class="result-url">
                            <?php echo $result['page']['url']; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</main>

</body>
</html>
