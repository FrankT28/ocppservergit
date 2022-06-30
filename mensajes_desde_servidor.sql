-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-07-2022 a las 00:01:33
-- Versión del servidor: 10.4.13-MariaDB-log
-- Versión de PHP: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_central`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes_desde_servidor`
--

CREATE TABLE `mensajes_desde_servidor` (
  `id_mensaje_servidor` int(11) NOT NULL,
  `id_estacion` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `mensaje` text COLLATE utf8_spanish_ci NOT NULL,
  `estado` int(1) NOT NULL COMMENT '0 sin responder, uno respondido'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `mensajes_desde_servidor`
--

INSERT INTO `mensajes_desde_servidor` (`id_mensaje_servidor`, `id_estacion`, `fecha`, `hora`, `mensaje`, `estado`) VALUES
(1, 1, '2022-06-30', '17:00:00', 'Este es un mensaje arbitrario para que funcionen los uniqueId cuando se envia un mensaje desde el servidor.', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `mensajes_desde_servidor`
--
ALTER TABLE `mensajes_desde_servidor`
  ADD PRIMARY KEY (`id_mensaje_servidor`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `mensajes_desde_servidor`
--
ALTER TABLE `mensajes_desde_servidor`
  MODIFY `id_mensaje_servidor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
