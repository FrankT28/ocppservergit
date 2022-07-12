-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-07-2022 a las 03:15:41
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
-- Estructura de tabla para la tabla `estados_autorizacion`
--

CREATE TABLE `estados_autorizacion` (
  `id_estado_autorizacion` int(1) NOT NULL,
  `nombre` varchar(25) COLLATE utf8_spanish_ci NOT NULL,
  `alias` varchar(20) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `estados_autorizacion`
--

INSERT INTO `estados_autorizacion` (`id_estado_autorizacion`, `nombre`, `alias`) VALUES
(1, 'Aceptada', 'Accepted'),
(2, 'Bloqueada', 'Blocked'),
(3, 'Expirada', 'Expired'),
(4, 'Invalida', 'Invalid'),
(5, 'Transaccion Concurrente', 'ConcurrentTx');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estados_autorizacion`
--
ALTER TABLE `estados_autorizacion`
  ADD PRIMARY KEY (`id_estado_autorizacion`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
