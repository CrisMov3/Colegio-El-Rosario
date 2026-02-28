-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-02-2026 a las 04:06:32
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
-- Estructura de tabla para la tabla `actividad`
--

CREATE TABLE `actividad` (
  `id` int(11) NOT NULL,
  `tipo` enum('crear','editar','eliminar') NOT NULL,
  `seccion` varchar(50) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `detalles` text DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `usuario_nombre` varchar(100) DEFAULT NULL,
  `usuario_email` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `actividad`
--

INSERT INTO `actividad` (`id`, `tipo`, `seccion`, `descripcion`, `detalles`, `usuario_id`, `usuario_nombre`, `usuario_email`, `created_at`) VALUES
(1, 'crear', 'noticias', 'Publicó la noticia: \"Buenas noches\"', '{\"titulo\":\"Buenas noches\",\"categoria\":\"anuncios\",\"estado\":\"publicado\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 18:30:25'),
(2, 'crear', 'noticias', 'Publicó la noticia: \"Inicio m,a\"', '{\"titulo\":\"Inicio m,a\",\"categoria\":\"eventos\",\"estado\":\"publicado\",\"imagen\":\"S\\u00ed\",\"archivo\":\"Libro.pdf\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 18:45:50'),
(3, 'eliminar', 'noticias', 'Eliminó la noticia: \"Buenas noches\"', '{\"id\":4,\"titulo\":\"Buenas noches\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 18:53:46'),
(4, 'eliminar', 'noticias', 'Eliminó la noticia: \"Hola\"', '{\"id\":3,\"titulo\":\"Hola\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 18:53:49'),
(5, 'eliminar', 'noticias', 'Eliminó la noticia: \"Inicio m,a\"', '{\"id\":5,\"titulo\":\"Inicio m,a\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 19:00:07'),
(6, 'crear', 'noticias', 'Publicó la noticia: \"Buenas noches\"', '{\"titulo\":\"Buenas noches\",\"categoria\":\"general\",\"estado\":\"publicado\",\"imagen\":\"No\",\"archivo\":\"No\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 19:06:14'),
(7, 'eliminar', 'noticias', 'Eliminó la noticia: \"Buenas noches\"', '{\"id\":6,\"titulo\":\"Buenas noches\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 19:06:34'),
(8, 'crear', 'documentos', 'Subió el documento: \"Notas academicas\"', '{\"titulo\":\"Notas academicas\",\"archivo\":\"Notas.docx\",\"categoria\":\"academico\",\"tamano\":\"0.24 MB\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 19:12:06'),
(9, 'crear', 'documentos', 'Subió el documento: \"Asistencia del dia....\"', '{\"titulo\":\"Asistencia del dia....\",\"archivo\":\"Asistencia.pdf\",\"categoria\":\"administrativo\",\"tamano\":\"1.24 MB\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 19:12:33'),
(10, 'crear', 'documentos', 'Subió el documento: \"su papa se baña en tangas\"', '{\"titulo\":\"su papa se ba\\u00f1a en tangas\",\"archivo\":\"Soporte IT Moderno.pdf\",\"categoria\":\"normativo\",\"tamano\":\"2.81 MB\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 19:13:16'),
(11, 'editar', 'pqrs', 'Estado PQRS #1 cambiado a \'anulado\'', 'Array', NULL, NULL, NULL, '2026-02-27 19:29:42'),
(12, 'editar', 'pqrs', 'Estado PQRS #1 cambiado a \'resuelto\'', 'Array', NULL, NULL, NULL, '2026-02-27 19:29:45'),
(13, 'editar', 'pqrs', 'Estado PQRS #1 cambiado a \'resuelto\'', 'Array', NULL, NULL, NULL, '2026-02-27 19:35:40'),
(14, 'editar', 'pqrs', 'Estado PQRS #1 cambiado a \'en_proceso\'', 'Array', NULL, NULL, NULL, '2026-02-27 19:35:52'),
(15, 'editar', 'pqrs', 'Estado PQRS #1 cambiado a \'pendiente\'', 'Array', NULL, NULL, NULL, '2026-02-27 19:35:54'),
(16, 'editar', 'pqrs', 'Estado PQRS #1 cambiado a \'anulado\'', 'Array', NULL, NULL, NULL, '2026-02-27 19:35:56'),
(17, 'editar', 'pqrs', 'Estado PQRS #1 cambiado a \'en_proceso\'', '{\"pqrs_id\":1,\"tipo\":\"Peticion\",\"asunto\":\"asdad\",\"estado_anterior\":\"anulado\",\"estado_nuevo\":\"en_proceso\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 19:38:41'),
(18, 'eliminar', 'pqrs', 'PQRS #1 eliminado: asdad', '{\"pqrs_id\":1,\"tipo\":\"Peticion\",\"asunto\":\"asdad\",\"nombre\":\"asdas\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-27 19:49:03'),
(19, 'eliminar', 'documentos', 'Eliminó el documento: \"su papa se baña en tangas\"', '{\"id\":7,\"titulo\":\"su papa se ba\\u00f1a en tangas\",\"archivo\":\"Soporte IT Moderno.pdf\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-28 03:00:34'),
(20, 'editar', 'pqrs', 'Estado PQRS #2 cambiado a \'anulado\'', '{\"pqrs_id\":2,\"tipo\":\"Reclamo\",\"asunto\":\"hjhjhjhj\",\"estado_anterior\":\"pendiente\",\"estado_nuevo\":\"anulado\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-28 03:02:09'),
(21, 'editar', 'pqrs', 'Estado PQRS #2 cambiado a \'en_proceso\'', '{\"pqrs_id\":2,\"tipo\":\"Reclamo\",\"asunto\":\"hjhjhjhj\",\"estado_anterior\":\"anulado\",\"estado_nuevo\":\"en_proceso\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-28 03:02:33'),
(22, 'editar', 'pqrs', 'Estado PQRS #2 cambiado a \'resuelto\'', '{\"pqrs_id\":2,\"tipo\":\"Reclamo\",\"asunto\":\"hjhjhjhj\",\"estado_anterior\":\"en_proceso\",\"estado_nuevo\":\"resuelto\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-28 03:02:52'),
(23, 'crear', 'usuarios', 'Creó al usuario: \"Ali David\"', '{\"id\":\"3\",\"nombre\":\"Ali David\",\"email\":\"Lamarpitter@gmail.com\",\"rol\":\"admin\"}', 1, 'Administrador', 'cristian.lp2305@gmail.com', '2026-02-28 03:05:40');

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
(5, 'Notas academicas', 'Nose', 'Notas.docx', 'PDF/Notas.docx', '0.24 MB', 'academico', '2026-02-27 19:12:06', '2026-02-27 19:12:06'),
(6, 'Asistencia del dia....', '', 'Asistencia.pdf', 'PDF/Asistencia.pdf', '1.24 MB', 'administrativo', '2026-02-27 19:12:33', '2026-02-27 19:12:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticias`
--

CREATE TABLE `noticias` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` text NOT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `archivo_adjunto_nombre` varchar(255) DEFAULT NULL,
  `archivo_adjunto_ruta` varchar(500) DEFAULT NULL,
  `categoria` enum('general','academico','eventos','anuncios') DEFAULT 'general',
  `estado` enum('publicado','borrador') DEFAULT 'publicado',
  `fecha_publicacion` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `estado` enum('pendiente','en_proceso','resuelto','anulado') DEFAULT 'pendiente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `pqrs`
--

INSERT INTO `pqrs` (`id`, `nombre`, `correo`, `tipo`, `asunto`, `mensaje`, `estado`, `created_at`) VALUES
(2, 'jose', 'jose@gmail.com', 'Reclamo', 'hjhjhjhj', 'hiojhbvjiobhjihbhi', 'resuelto', '2026-02-28 03:01:30');

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
(2, 'Jose', 'jose@gmail.com', '12345', 'editor', '[\"noticias\",\"documentos\",\"academica\"]', 1, '2026-02-26 21:58:00', '2026-02-26 21:58:00'),
(3, 'Ali David', 'Lamarpitter@gmail.com', 'Admin1234', 'admin', '[\"noticias\",\"documentos\",\"academica\",\"configuracion\",\"docentes\",\"pqrs\",\"usuarios\"]', 1, '2026-02-28 03:05:40', '2026-02-28 03:05:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividad`
--
ALTER TABLE `actividad`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT de la tabla `actividad`
--
ALTER TABLE `actividad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `noticias`
--
ALTER TABLE `noticias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `pqrs`
--
ALTER TABLE `pqrs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
