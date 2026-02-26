-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-02-2026 a las 22:59:33
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `colegio_rosario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `configuracion`
--

CREATE TABLE `configuracion` (
  `id` int(11) NOT NULL,
  `clave` varchar(100) NOT NULL,
  `valor` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `configuracion`
--

INSERT INTO `configuracion` (`id`, `clave`, `valor`, `updated_at`) VALUES
(1, 'nombre_colegio', 'Colegio El Rosario', '2026-02-26 21:05:39'),
(2, 'correo_contacto', 'colegioelrosario.rectoria@gmail.com', '2026-02-26 21:05:39'),
(3, 'telefono_principal', '+57 (604) 300 6076615', '2026-02-26 21:05:39'),
(4, 'max_noticias_portada', '5', '2026-02-26 21:05:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docentes`
--

CREATE TABLE `docentes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `asignatura` varchar(150) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `estado` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `docentes`
--

INSERT INTO `docentes` (`id`, `nombre`, `asignatura`, `correo`, `estado`, `created_at`, `updated_at`) VALUES
(1, 'María García López', 'Matemáticas', 'maria.garcia@elrosario.edu.co', 1, '2026-02-26 21:05:39', '2026-02-26 21:05:39'),
(2, 'Carlos Pérez Rodríguez', 'Ciencias Naturales', 'carlos.perez@elrosario.edu.co', 1, '2026-02-26 21:05:39', '2026-02-26 21:05:39'),
(3, 'Ana Martínez Gómez', 'Lengua Castellana', 'ana.martinez@elrosario.edu.co', 1, '2026-02-26 21:05:39', '2026-02-26 21:05:39'),
(4, 'Jorge Ramírez Díaz', 'Educación Física', 'jorge.ramirez@elrosario.edu.co', 1, '2026-02-26 21:05:39', '2026-02-26 21:05:39'),
(5, 'Laura Sánchez Muñoz', 'Inglés', 'laura.sanchez@elrosario.edu.co', 1, '2026-02-26 21:05:39', '2026-02-26 21:05:39'),
(6, 'Hola', 'Soporte', 'nose@gmail.com', 1, '2026-02-26 21:38:09', '2026-02-26 21:38:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `archivo_nombre` varchar(255) NOT NULL,
  `archivo_ruta` varchar(500) NOT NULL,
  `archivo_tamano` varchar(50) DEFAULT NULL,
  `categoria` enum('academico','administrativo','normativo','otros') DEFAULT 'academico',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`id`, `titulo`, `descripcion`, `archivo_nombre`, `archivo_ruta`, `archivo_tamano`, `categoria`, `created_at`, `updated_at`) VALUES
(1, 'Manual de Convivencia', 'Documento PEI del Colegio El Rosario 2026', 'PEI Colegio El Rosario 2026.pdf', 'PDF/PEI Colegio El Rosario 2026.pdf', NULL, 'normativo', '2026-02-26 21:05:39', '2026-02-26 21:05:39'),
(2, 'Horario Escolar', 'Horario escolar vigente', 'horario escolar.png', 'img/horario escolar.png', NULL, 'academico', '2026-02-26 21:05:39', '2026-02-26 21:05:39'),
(3, 'Lista de Útiles', 'Lista de útiles escolares año 2026', 'mper_205238_LISTA DE UTILES ESCOLARES ANO 2026.pdf', 'PDF/mper_205238_LISTA DE UTILES ESCOLARES ANO 2026.pdf', NULL, 'academico', '2026-02-26 21:05:39', '2026-02-26 21:05:39');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `categoria` enum('general','academico','eventos','anuncios') DEFAULT 'general',
  `estado` enum('publicado','borrador') DEFAULT 'publicado',
  `fecha_publicacion` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `noticias`
--

INSERT INTO `noticias` (`id`, `titulo`, `contenido`, `imagen_url`, `categoria`, `estado`, `fecha_publicacion`, `created_at`, `updated_at`) VALUES
(3, 'Hola', 'asdasdsad', '', 'general', 'publicado', '2026-02-26 16:07:08', '2026-02-26 21:07:08', '2026-02-26 21:07:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pqrs`
--

CREATE TABLE `pqrs` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `correo` varchar(200) NOT NULL,
  `tipo` enum('Peticion','Queja','Reclamo','Sugerencia') NOT NULL,
  `asunto` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `estado` enum('pendiente','en_proceso','resuelto') DEFAULT 'pendiente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pqrs`
--

INSERT INTO `pqrs` (`id`, `nombre`, `correo`, `tipo`, `asunto`, `mensaje`, `estado`, `created_at`) VALUES
(1, 'asdas', 'asdasd@gmail.com', 'Peticion', 'asdad', 'asdasd', 'pendiente', '2026-02-26 21:08:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','editor') DEFAULT 'editor',
  `permisos` text DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `permisos`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Administrador', 'cristian.lp2305@gmail.com', 'Admin1234', 'admin', '[\"noticias\",\"documentos\",\"academica\",\"configuracion\",\"docentes\",\"usuarios\"]', 1, '2026-02-26 21:05:39', '2026-02-26 21:51:27'),
(2, 'Jose', 'jose@gmail.com', '12345', 'editor', '[\"noticias\",\"documentos\",\"academica\"]', 1, '2026-02-26 21:58:00', '2026-02-26 21:58:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `clave` (`clave`);

--
-- Indices de la tabla `docentes`
--
ALTER TABLE `docentes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `noticias`
--
ALTER TABLE `noticias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `docentes`
--
ALTER TABLE `docentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
