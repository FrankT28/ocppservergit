-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-06-2022 a las 21:12:30
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
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `ruc` varchar(13) COLLATE utf8_spanish_ci NOT NULL,
  `razon_social` varchar(200) COLLATE utf8_spanish_ci NOT NULL,
  `ciudad` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `direccion` varchar(150) COLLATE utf8_spanish_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `foto_cliente` int(11) NOT NULL,
  `fecha_registro` date NOT NULL,
  `hora_registro` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `ruc`, `razon_social`, `ciudad`, `direccion`, `telefono`, `email`, `foto_cliente`, `fecha_registro`, `hora_registro`) VALUES
(1, '0705322311001', 'MINISTRO', 'Cuenca', 'Pachacamac 182 y Rumiñahui', '984089527', 'frank.torres2094@gmail.com', 0, '2022-03-13', '12:12:04'),
(5, '0701069288', 'Flor Aguilar', 'Cuenca', 'Don Bosco', '0987138608', 'florfuxia@gmail.com', 0, '2022-05-14', '17:36:17'),
(6, '0705322329', 'Oscar Torres', '0984089527', 'Cuenca', 'El Cebollar', 'oscar.torres@ucuenca.edu.ec', 0, '2022-05-22', '23:38:25'),
(7, '0705322311', 'Frank Leonel Torres Aguilar', '0984089527', 'Cuenca', 'Pachacamac 1-82 y Ru', 'frank.torres2094@gmail.com', 0, '2022-05-23', '16:29:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id_comentario` int(11) NOT NULL,
  `id_modulo` int(11) NOT NULL,
  `id_registro` int(11) NOT NULL,
  `comentario` text COLLATE utf8_spanish_ci NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id_comentario`, `id_modulo`, `id_registro`, `comentario`, `id_usuario`) VALUES
(1, 1, 1, 'Esta es la primera estación de carga rápida de la Centro Sur. Está instalada en el patio de estacionamiento de la emprsa Centro Sur.', 1),
(2, 2, 6, 'coentario en tarhetas', 1),
(3, 2, 7, 'otro comentario de prueba', 1),
(4, 2, 8, 'asdasd', 1),
(5, 2, 9, 'asdadrge', 1),
(6, 2, 10, 'asd', 1),
(7, 2, 11, 'ss', 1),
(8, 2, 12, 'otra', 1),
(9, 1, 2, '7', 1),
(10, 1, 3, 'Comentario de prueba en clientes', 1),
(11, 1, 4, 'Comentario del cliente vistor', 1),
(12, 3, 5, '7', 1),
(13, 3, 6, 'este es un comentario de prueba para oscar', 1),
(14, 3, 7, 'comentario de prueba para frank torres', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conectores`
--

CREATE TABLE `conectores` (
  `id_conector` int(11) NOT NULL,
  `id_estacion` int(11) NOT NULL,
  `id_local` int(2) NOT NULL,
  `potencia` varchar(10) COLLATE utf8_spanish_ci NOT NULL,
  `estado` varchar(30) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `conectores`
--

INSERT INTO `conectores` (`id_conector`, `id_estacion`, `id_local`, `potencia`, `estado`) VALUES
(1, 1, 1, ' 40 Kw', 'Dispomible'),
(2, 1, 2, '30 Kw', 'No disponible');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estaciones`
--

CREATE TABLE `estaciones` (
  `id_estacion` int(4) NOT NULL,
  `codigoEstacion` varchar(20) NOT NULL,
  `nombreEstacion` varchar(50) NOT NULL,
  `ubicacion` varchar(150) NOT NULL,
  `cantidadConectores` int(2) NOT NULL,
  `fotoEstacion` varchar(60) NOT NULL,
  `potenciaMinima` varchar(10) NOT NULL,
  `potenciaMaxima` varchar(10) NOT NULL,
  `voltajeMinimo` varchar(10) NOT NULL,
  `voltajeMaximo` varchar(10) NOT NULL,
  `corrienteMinima` varchar(10) NOT NULL,
  `corrienteMaxima` varchar(10) NOT NULL,
  `fases` int(1) NOT NULL,
  `cargasSimultaneas` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estaciones`
--

INSERT INTO `estaciones` (`id_estacion`, `codigoEstacion`, `nombreEstacion`, `ubicacion`, `cantidadConectores`, `fotoEstacion`, `potenciaMinima`, `potenciaMaxima`, `voltajeMinimo`, `voltajeMaximo`, `corrienteMinima`, `corrienteMaxima`, `fases`, `cargasSimultaneas`) VALUES
(1, 'EC_CENTRO_SUR_1', 'Estación de carga rápida Centro Sur 1', 'Ave Max Uhle y Pumapungo, Cuenca', 3, 'si', '10', '50', '127', '220', '1', '60', 3, 'si');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_estaciones`
--

CREATE TABLE `estados_estaciones` (
  `id_estado_est` int(2) NOT NULL,
  `estado_est_ingles` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `estado_est_espanol` varchar(35) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `estados_estaciones`
--

INSERT INTO `estados_estaciones` (`id_estado_est`, `estado_est_ingles`, `estado_est_espanol`) VALUES
(1, 'Available', 'Disponible'),
(2, 'Preparing', 'Preparando'),
(3, 'Charging', 'Cargando'),
(4, 'SuspendedEV', 'Vehiculo Electrico Suspendido'),
(5, 'SuspendedEVSE', 'Punto de Carga Suspendido'),
(6, 'Finishing', 'Finalizando'),
(7, 'Reserved', 'Reservada'),
(8, 'Unavailable', 'No Disponible'),
(9, 'Faulted', 'Deectuosa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_estacion`
--

CREATE TABLE `estado_estacion` (
  `id_estado_estacion` int(11) NOT NULL,
  `id_estacion` int(11) NOT NULL,
  `id_estado_est` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `estado_estacion`
--

INSERT INTO `estado_estacion` (`id_estado_estacion`, `id_estacion`, `id_estado_est`) VALUES
(1, 1, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `meter_values`
--

CREATE TABLE `meter_values` (
  `id_meter_value` int(3) NOT NULL,
  `nombre_meter_value` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `measurand` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `unit` varchar(30) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `meter_values`
--

INSERT INTO `meter_values` (`id_meter_value`, `nombre_meter_value`, `measurand`, `unit`) VALUES
(1, 'voltage', 'Voltage', 'V'),
(2, 'current', 'Current.Import', 'A'),
(3, 'energy', 'Energy.Active.Import.Register', 'kWh'),
(4, 'power', 'Power.Active.Export', 'kW'),
(5, 'frequency', 'Frequency', 'Hz'),
(6, 'temperature', 'Temperature', 'Celcius'),
(7, 'State of charge', 'soc', '%');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modulos`
--

CREATE TABLE `modulos` (
  `id_modulo` int(11) NOT NULL,
  `nombreModulo` varchar(100) COLLATE utf8_spanish_ci NOT NULL,
  `claveModulo` varchar(50) COLLATE utf8_spanish_ci NOT NULL,
  `activo` int(1) NOT NULL COMMENT '0 activo, 1 inactivo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `modulos`
--

INSERT INTO `modulos` (`id_modulo`, `nombreModulo`, `claveModulo`, `activo`) VALUES
(1, 'Estaciones', 'estaciones', 0),
(2, 'Tarjetas', 'tarjetas', 0),
(3, 'Clientes', 'clientes', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarjetas`
--

CREATE TABLE `tarjetas` (
  `id_tarjeta` int(7) NOT NULL,
  `codigo_rfid` varchar(20) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `saldo` float(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tarjetas`
--

INSERT INTO `tarjetas` (`id_tarjeta`, `codigo_rfid`, `estado`, `id_cliente`, `saldo`) VALUES
(1, '0002020030000813', 'Accepted', 7, 253.25),
(2, '0002020030000814', 'Accepted', 6, 100.75),
(3, '7240E49A', 'Accepted', 5, 75.25),
(4, '63F4CFC7', 'Accepted', 6, 87.98),
(15, '123456789', 'Accepted', 1, 10.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transacciones`
--

CREATE TABLE `transacciones` (
  `id_transaccion` int(8) NOT NULL,
  `id_estacion` int(4) NOT NULL,
  `id_conector` int(2) NOT NULL,
  `id_tarjeta` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `energiaInicio` decimal(10,2) NOT NULL,
  `energiaFin` decimal(10,2) NOT NULL,
  `energiaConsumida` decimal(5,2) NOT NULL,
  `estado` varchar(20) NOT NULL,
  `razon` varchar(20) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `transacciones`
--

INSERT INTO `transacciones` (`id_transaccion`, `id_estacion`, `id_conector`, `id_tarjeta`, `fecha`, `hora_inicio`, `hora_fin`, `energiaInicio`, `energiaFin`, `energiaConsumida`, `estado`, `razon`) VALUES
(1, 1, 1, 2, '2022-05-23', '15:29:55', '15:29:55', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(2, 1, 1, 1, '2022-05-23', '15:57:00', '15:57:00', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(3, 1, 1, 1, '2022-05-23', '15:58:26', '15:58:26', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(4, 1, 1, 1, '2022-05-23', '15:59:50', '15:59:50', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(5, 1, 1, 1, '2022-05-23', '15:59:59', '15:59:59', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(6, 1, 1, 1, '2022-05-23', '16:24:08', '16:24:08', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(7, 1, 1, 1, '2022-05-23', '16:37:52', '16:37:52', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(8, 1, 1, 1, '2022-05-23', '16:40:26', '16:40:26', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(9, 1, 1, 1, '2022-05-23', '16:41:24', '16:41:24', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(10, 1, 1, 1, '2022-05-23', '16:42:47', '16:42:49', '4.00', '5.00', '0.00', 'Finalizada', 'Local'),
(11, 1, 1, 1, '2022-05-23', '16:47:49', '16:47:51', '4.00', '5.00', '1.00', 'Finalizada', 'Local'),
(12, 1, 1, 1, '2022-05-23', '19:05:11', '19:05:13', '4.00', '5.00', '1.00', 'Finalizada', 'Local'),
(13, 1, 1, 1, '2022-05-29', '13:19:28', '13:19:28', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(14, 1, 1, 1, '2022-05-29', '13:21:32', '13:21:32', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(15, 1, 1, 1, '2022-05-29', '13:27:19', '13:27:19', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(16, 1, 1, 1, '2022-05-29', '13:31:14', '13:31:14', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(17, 1, 1, 1, '2022-05-29', '13:40:50', '13:40:50', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(18, 1, 1, 1, '2022-05-29', '13:47:17', '13:47:17', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(19, 1, 1, 1, '2022-05-29', '13:49:37', '13:49:37', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(20, 1, 1, 1, '2022-05-29', '13:50:32', '13:50:32', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(21, 1, 1, 1, '2022-05-29', '13:50:51', '13:50:51', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(22, 1, 1, 1, '2022-05-29', '13:57:10', '13:57:10', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(23, 1, 1, 1, '2022-05-29', '13:57:35', '13:57:35', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(24, 1, 1, 1, '2022-05-29', '14:03:35', '14:03:35', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(25, 1, 1, 1, '2022-05-29', '14:06:13', '14:06:13', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(26, 1, 1, 1, '2022-05-29', '14:07:22', '14:07:22', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(27, 1, 1, 1, '2022-05-29', '14:12:40', '14:12:40', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(28, 1, 1, 1, '2022-05-29', '14:13:27', '14:13:27', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(29, 1, 1, 1, '2022-05-29', '14:17:24', '14:17:24', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(30, 1, 1, 1, '2022-05-29', '14:17:51', '14:17:51', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(31, 1, 1, 1, '2022-05-29', '17:54:59', '17:54:59', '4.00', '4.00', '0.00', 'Iniciada', 'Iniciada'),
(32, 1, 1, 1, '2022-05-29', '18:10:21', '18:11:30', '4.00', '5.00', '1.00', 'Finalizada', 'Local'),
(33, 1, 1, 1, '2022-05-29', '18:12:15', '18:19:17', '4.00', '5.00', '1.00', 'Finalizada', 'Local'),
(34, 1, 1, 1, '2022-05-29', '18:20:09', '18:20:19', '4.00', '5.00', '1.00', 'Finalizada', 'Local'),
(35, 1, 1, 1, '2022-05-29', '18:31:44', '18:32:03', '4.00', '5.00', '1.00', 'Finalizada', 'Local');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transacciones_ci_l1`
--

CREATE TABLE `transacciones_ci_l1` (
  `id_transaccion_ci_l1` int(11) NOT NULL,
  `id_transaccion` int(11) NOT NULL,
  `id_estacion` int(11) NOT NULL,
  `id_conector` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `contexto` varchar(50) NOT NULL,
  `unidad` varchar(10) NOT NULL,
  `valor` float(12,6) NOT NULL,
  `formato` varchar(30) NOT NULL,
  `ubicacion` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `transacciones_ci_l1`
--

INSERT INTO `transacciones_ci_l1` (`id_transaccion_ci_l1`, `id_transaccion`, `id_estacion`, `id_conector`, `timestamp`, `contexto`, `unidad`, `valor`, `formato`, `ubicacion`) VALUES
(1, 1, 1, 1, '0000-00-00 00:00:00', 'Sample.Periodic', 'A', 74.000000, 'Raw', 'inlet'),
(2, 1, 1, 1, '0000-00-00 00:00:00', 'Sample.Periodic', 'A', 78.000000, 'Raw', 'inlet'),
(3, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet'),
(4, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet'),
(5, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet'),
(6, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet'),
(7, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transacciones_ci_l2`
--

CREATE TABLE `transacciones_ci_l2` (
  `id_transaccion_ci_l2` int(11) NOT NULL,
  `id_transaccion` int(11) NOT NULL,
  `id_estacion` int(11) NOT NULL,
  `id_conector` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `contexto` varchar(50) NOT NULL,
  `unidad` varchar(10) NOT NULL,
  `valor` float(12,6) NOT NULL,
  `formato` varchar(30) NOT NULL,
  `ubicacion` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `transacciones_ci_l2`
--

INSERT INTO `transacciones_ci_l2` (`id_transaccion_ci_l2`, `id_transaccion`, `id_estacion`, `id_conector`, `timestamp`, `contexto`, `unidad`, `valor`, `formato`, `ubicacion`) VALUES
(1, 1, 1, 1, '0000-00-00 00:00:00', 'Sample.Periodic', 'A', 74.000000, 'Raw', 'inlet'),
(2, 1, 1, 1, '0000-00-00 00:00:00', 'Sample.Periodic', 'A', 78.000000, 'Raw', 'inlet'),
(3, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet'),
(4, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet'),
(5, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet'),
(6, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet'),
(7, 1, 1, 1, '2022-02-20 02:40:41', 'Sample.Periodic', 'A', 73.000000, 'Raw', 'inlet');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(3) NOT NULL,
  `username` varchar(60) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `username`, `password`) VALUES
(1, 'frank', '1234'),
(2, 'david', '1234'),
(3, 'sebastian', '1234');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id_comentario`);

--
-- Indices de la tabla `conectores`
--
ALTER TABLE `conectores`
  ADD PRIMARY KEY (`id_conector`);

--
-- Indices de la tabla `estaciones`
--
ALTER TABLE `estaciones`
  ADD PRIMARY KEY (`id_estacion`);

--
-- Indices de la tabla `estados_estaciones`
--
ALTER TABLE `estados_estaciones`
  ADD PRIMARY KEY (`id_estado_est`);

--
-- Indices de la tabla `meter_values`
--
ALTER TABLE `meter_values`
  ADD PRIMARY KEY (`id_meter_value`);

--
-- Indices de la tabla `modulos`
--
ALTER TABLE `modulos`
  ADD PRIMARY KEY (`id_modulo`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tarjetas`
--
ALTER TABLE `tarjetas`
  ADD PRIMARY KEY (`id_tarjeta`);

--
-- Indices de la tabla `transacciones`
--
ALTER TABLE `transacciones`
  ADD PRIMARY KEY (`id_transaccion`);

--
-- Indices de la tabla `transacciones_ci_l1`
--
ALTER TABLE `transacciones_ci_l1`
  ADD PRIMARY KEY (`id_transaccion_ci_l1`);

--
-- Indices de la tabla `transacciones_ci_l2`
--
ALTER TABLE `transacciones_ci_l2`
  ADD PRIMARY KEY (`id_transaccion_ci_l2`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id_comentario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `conectores`
--
ALTER TABLE `conectores`
  MODIFY `id_conector` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `estaciones`
--
ALTER TABLE `estaciones`
  MODIFY `id_estacion` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `estados_estaciones`
--
ALTER TABLE `estados_estaciones`
  MODIFY `id_estado_est` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `meter_values`
--
ALTER TABLE `meter_values`
  MODIFY `id_meter_value` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `modulos`
--
ALTER TABLE `modulos`
  MODIFY `id_modulo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tarjetas`
--
ALTER TABLE `tarjetas`
  MODIFY `id_tarjeta` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `transacciones`
--
ALTER TABLE `transacciones`
  MODIFY `id_transaccion` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `transacciones_ci_l1`
--
ALTER TABLE `transacciones_ci_l1`
  MODIFY `id_transaccion_ci_l1` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `transacciones_ci_l2`
--
ALTER TABLE `transacciones_ci_l2`
  MODIFY `id_transaccion_ci_l2` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
