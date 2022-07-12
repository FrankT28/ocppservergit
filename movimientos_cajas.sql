-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-07-2022 a las 19:43:08
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
-- Base de datos: `cuentas_casa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_cajas`
--

CREATE TABLE `movimientos_cajas` (
  `id_movimiento_caja` int(11) NOT NULL,
  `id_caja_origen` int(3) NOT NULL,
  `id_caja_destino` int(3) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `monto` float(6,2) NOT NULL,
  `tipo` int(1) NOT NULL COMMENT '0 descuento, 1 aumento'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `movimientos_cajas`
--

INSERT INTO `movimientos_cajas` (`id_movimiento_caja`, `id_caja_origen`, `id_caja_destino`, `fecha`, `hora`, `monto`, `tipo`) VALUES
(1, 1, 0, '2022-07-07', '11:16:02', 830.00, 2),
(2, 1, 2, '2022-07-08', '21:01:59', 6.00, 0),
(3, 1, 0, '2022-07-08', '20:03:42', 4.00, 0),
(4, 1, 0, '2022-07-09', '11:16:02', 500.00, 0),
(15, 3, 3, '2022-07-10', '12:41:19', 100.00, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `movimientos_cajas`
--
ALTER TABLE `movimientos_cajas`
  ADD PRIMARY KEY (`id_movimiento_caja`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `movimientos_cajas`
--
ALTER TABLE `movimientos_cajas`
  MODIFY `id_movimiento_caja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
