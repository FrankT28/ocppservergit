const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/seguro.js');
//var Plotly = require('plotly')("DemoAccount", "lr1c37zw81");
const multer = require('multer');
const path = require('path');


/*router.get('/home/estaciones/informacionBack', async(req, res) => {
	const datosEstacion = await pool.query('SELECT * FROM estaciones WHERE id_estacion!=0;'); 
	res.sendFile(path.join(__dirname, '/../views/' + 'Estaciones.html')); 
});*/
/*
router.get('/home/estaciones/archivo', async(req, res) => {
	//const datosEstacion = await pool.query('SELECT * FROM estaciones WHERE id_estacion!=0;'); 
	res.sendFile(path.join(__dirname, '/../views/' + 'Estaciones.html'));
});
*/

/********************************************************************************************/
function invierte_fecha(fecha){
    const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    let year = fecha.getFullYear()
    let month = months[fecha.getMonth()];
    let day = fecha.getDate()
    let fecha_invertida = day + '-' + month + '-' + year;
    return fecha_invertida
}

/********************************************************************************************/
async function estadoEstacion(id){
	let sql = "SELECT estado_est_espanol FROM estados_estaciones WHERE id_estado_est=?";
	let result = await pool.query(sql, [id]);
	let estado = result[0].estado_est_espanol;
	return estado
}
/********************************************************************************************/
function formatearFechaYMD(fecha){
	let mes = fecha.getMonth()+1;
	dia = ('00' + fecha.getDate()).slice(-2);
	mes = ('00' + mes).slice(-2);
	anio = fecha.getFullYear();
	let fechaFormato = anio + '-' + mes + '-' + dia;
	return fechaFormato;
}
/******************************************************************************/
function formatDate (input) {
	var datePart = input.match(/\d+/g),
	year = datePart[0], // get only two digits
	month = datePart[1], 
	day = datePart[2];
  
	return day+'-'+month+'-'+year;
}
/********************************************************************************************/
router.get('/home/estaciones/informacion', async(req, res) => {
	var data = {};
	let sql1 = "SELECT COUNT(*) as total FROM estaciones";
	let totalEstaciones = await pool.query(sql1);
	totalEstaciones = totalEstaciones[0].total;
	data.totalEstaciones = totalEstaciones;
 
	let sql2 = "SELECT es.*, ee.*, pe.fecha fecha_ping, pe.hora hora_ping FROM estaciones es, estado_estacion ee, ping_estacion pe WHERE es.id_estacion!=0 AND es.id_estacion=ee.id_estacion AND es.id_estacion=pe.id_estacion;"; 
	let estaciones = await pool.query(sql2); 
	let estacion;
	let fechaFormato;
	for(var i=0; i<estaciones.length; i++){
		estacion = estaciones[i];
		estaciones[i].estado = await estadoEstacion(estaciones[i].id_estado_est);
		fechaFormatoYmd = formatearFechaYMD(estaciones[i].fecha_ping);
		console.log('fechaFormatoYmd: ' + fechaFormatoYmd);
		estaciones[i].conexion = getEstadoConexion(fechaFormatoYmd, estacion.hora_ping);
	}
	data.estaciones = estaciones;
	data.success = true;
	res.send(data);
});

/********************************************************************************************/
function getEstadoConexion(fecha, hora){
	let estado = 'Conectada';
	let union = fecha + 'T' + hora;
	union = new Date(union);
	let previousTimeStamp = union.getTime();	
	let currentTimestamp = new Date().getTime();
	let diff = (currentTimestamp - previousTimeStamp)/1000;
	console.log('diff: ' + diff);
	if(diff>20){ 
		estado = 'Desconectada';
	}
	return estado;
}
/********************************************************************************************/
router.post('/home/estaciones/agregar', async(req, res) => {
	var data = {};
	console.log('llama a estaciones agregar')
	console.log(req.body)
	var ce = req.body.codigoEstacion;
	var ns = req.body.nombreEstacion;
	var ubi = req.body.ubicacion;
	var cc = req.body.cantidadConectores;
	var cs = req.body.cargasSimultaneas;

	var pmax = req.body.potenciaMaxima
	var pmin = req.body.potenciaMinima
	var cmax = req.body.corrienteMaxima
	var cmin = req.body.corrienteMinima
	var vmax = req.body.voltajeMaximo
	var vmin = req.body.voltajeMinimo
	var comentario = req.body.comentario

	var insert = 'INSERT INTO estaciones VALUES (null,?,?,?,?,?,?,?,?,?,?,?,?,?);';
	const subirEstacion = await pool.query(insert, [ce, ns, ubi, cc, cs, pmin, pmax, vmin, vmax, cmin, cmax, 3, cs ]);

	
	if(comentario.length>0){
		let sqlIdEstacion = "SELECT id_estacion FROM estaciones ORDER BY id_estacion DESC LIMIT 1";
		let idEstacion = await pool.query(sqlIdEstacion);
		idEstacion = idEstacion[0].id_estacion;
		let sqlComentario = "INSERT INTO COMENTARIOS VALUES(null,?,?,?,?)";
		let insert = await pool.query(sqlComentario, [1, idEstacion, comentario, 1])
	}
	data.success = true;
	data.message = 'La estaci??n se ha agregado exitosamente!';
	res.send(data);
});

/********************************************************************************************/
router.get('/home/estaciones/eliminar/:id', async(req, res) => {
	var data = {};
	var ide = req.params.id;
	console.log('se pide eliminar: ' + ide);
	var delet = 'DELETE FROM estaciones ';
	var where = 'WHERE id_estacion="' + ide + '";';
	await pool.query(delet + where);
	data.success = true;
	res.send(data);
});


/********************************************************************************************
router.get('/home/estaciones/info/:id', async(req, res) => {
	var ide = req.params.id;
	let select = 'SELECT * FROM estaciones ';
	let where = 'WHERE id_estacion="' + ide + '";';
	const datosEstacion = await pool.query(select + where);
	console.log(datosEstacion);
	res.render('EstacionesInformacion.hbs', {datosEstacion: datosEstacion[0], 'menu': 'si', 'info': true});
});

/********************************************************************************************/
router.get('/home/estaciones/transacciones/:id/:desde/:cuantos', async(req, res) => {
	var data = {};
	var ide = req.params.id;
	var desde = req.params.desde;
	var cuantos = req.params.cuantos;
	let transacciones = [];
	let sqlTotal = 'SELECT COUNT(*) as total FROM transacciones WHERE id_estacion="' + ide + '";';
	let total = await pool.query(sqlTotal);
	total = total[0].total;
	data.total = total

	let sqlSelect = "SELECT tr.*, ta.codigo_rfid FROM transacciones tr, tarjetas ta WHERE id_estacion='" + ide + 
	"' AND tr.id_tarjeta = ta.id_tarjeta ORDER BY id_transaccion DESC LIMIT " + desde + ", " + cuantos + ";";
	console.log('sqlSelect: ');
	console.log(sqlSelect);
	let result = await pool.query(sqlSelect);
	for(let i=0; i<result.length; i++){
		transacciones[i] = result[i];
		transacciones[i].fecha = invierte_fecha(transacciones[i].fecha);
		transacciones[i].energiaInicio = transacciones[i].energiaInicio/1000;
		transacciones[i].energiaFin = transacciones[i].energiaFin/1000;
		transacciones[i].energiaConsumida = transacciones[i].energiaConsumida/1000;
	}
	data.success = true;
	data.transacciones = transacciones;
	res.send(data);
});

/********************************************************************************************/
router.get('/home/estaciones/tiempoReal/:id', async(req, res) => {
	var ide = req.params.id;
	let select = 'SELECT * FROM conectores ';
	let where = 'WHERE id_estacion="' + ide + '";';
	const datosConectores = await pool.query(select + where);
	console.log(datosConectores);
	res.render('EstacionesInformacion.hbs', 
	{datosConectores: datosConectores, 'menu': 'si', 'tiempoReal': true, 'id_estacion': ide});
});


/********************************************************************************************/
router.post('/home/estaciones/editar/:id', async(req, res) => {
	var data = {};
	console.log('sisi')
	console.log('Datos enviados para actualizar: ');
	console.log(req.body);

	var id = req.params.id;
	var ce = req.body.codigoEstacion
	var ne = req.body.nombreEstacion
	var ubi = req.body.ubicacion
	var cc = req.body.cantidadConectores
	var cs = req.body.cargasSimultaneas

	var pmax = req.body.potenciaMaxima
	var pmin = req.body.potenciaMinima
	var cmax = req.body.corrienteMaxima
	var cmin = req.body.corrienteMinima
	var vmax = req.body.voltajeMaximo
	var vmin = req.body.voltajeMinimo

	var update = 'UPDATE estaciones ';
	var set = 'SET codigoEstacion="' + ce + 
	'", nombreEstacion="' + ne + 
	'", ubicacion="' + ubi + 
	'", cantidadConectores="' + cc + 
	'", cargasSimultaneas="' + cs + 

	'", potenciaMaxima="' + pmax + 
	'", potenciaMinima="' + pmin + 
	'", corrienteMaxima="' + cmax + 
	'", corrienteMinima="' + cmin + 
	'", voltajeMaximo="' + vmax + 
	'", voltajeMinimo="' + vmin + 
	'"';

	var where = ' WHERE id_estacion="' + id + '";';
	var query = update + set + where;
	console.log(query); 
	await pool.query(query);
	data.success = true;
    res.send(data); 
});

/********************************************************************************************/
router.post('/home/estaciones/gestionar/:id', async(req, res) => {
	const ide = req.params.id;
	const v1 = req.body.valor1;
	const v2 = req.body.valor2;
	const v3 = req.body.valor3;
	const datosEstacion = {
		ide, v1, v2, v3
	};
	/*console.log('Estos son los par??metros: ');
	console.log(datosEstacion);*/
	res.render('EstacionesGestionar.hbs',  {datosEstacion: datosEstacion, 'menu': 'si'}); 
});

/********************************************************************************************/
router.get('/home/estaciones/diagnostico/:id', async(req, res) => {
	var ide = req.params.id;
	console.log('Este es el id enviad: ', ide);
	res.redirect('/home/estaciones/gestionar/' + ide); 
});


/********************************************************************************************/
router.get('/home/estaciones/urlprueba', async(req, res) => {
	//console.log('Se ha solicitado url de prueba');
	res.send('hola que tal');
})

/***************para subir archivos*********************/

const upload = multer({
	dest: path.join(__dirname + '/diagnostics')
})


router.post('/files', upload.single('diagnostico'), (req,res)=> {
	console.log('Esta es la request: ');
	console.log(req.file);
	res.redirect('/home/estaciones/informacion');
})


router.get('/files', upload.single('diagnostico'), (req,res)=> {
	console.log('Esta es la request: ');
	console.log(req.file);
	res.redirect('/home/estaciones/informacion')
})

module.exports = router; 
