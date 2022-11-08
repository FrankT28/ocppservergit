const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/seguro.js');
//var Plotly = require('plotly')("DemoAccount", "lr1c37zw81");
const multer = require('multer');
const path = require('path');


/*router.get('/home/smartCharging/informacionBack', async(req, res) => {
	const datosreservacion = await pool.query('SELECT * FROM smartCharging WHERE id_reservacion!=0;'); 
	res.sendFile(path.join(__dirname, '/../views/' + 'smartCharging.html')); 
});*/
/*
router.get('/home/smartCharging/archivo', async(req, res) => {
	//const datosreservacion = await pool.query('SELECT * FROM smartCharging WHERE id_reservacion!=0;'); 
	res.sendFile(path.join(__dirname, '/../views/' + 'smartCharging.html'));
});
*/

/********************************************************************************************
async function estadoreservacion(id){
	let sql = "SELECT estado_est_espanol FROM estados_smartCharging WHERE id_estado_est=?";
	let result = await pool.query(sql, [id]);
	let estado = result[0].estado_est_espanol;
	return estado
}
/********************************************************************************************/
router.get('/home/smartCharging/informacion', async(req, res) => {
	var data = {};
	let sql1 = "SELECT COUNT(*) as total FROM smartCharging";
	let totalsmartCharging = await pool.query(sql1);
	totalsmartCharging = totalsmartCharging[0].total;
	data.totalsmartCharging = totalsmartCharging;

	//let sql2 = "SELECT * FROM smartCharging re INNER JOIN tarjetas ta ON re.id_tag=ta.id_tarjeta INNER JOIN estaciones es ON re.id_estacion=es.id_estacion INNER JOIN conectores co ON re.id_conector=co.id_conector;"; 
	let sql2 = "SELECT * FROM smartCharging re INNER JOIN estaciones es ON re.id_estacion=es.id_estacion INNER JOIN conectores co ON re.id_conector=co.id_local AND re.id_estacion=co.id_estacion ORDER BY id_reservacion DESC;"; 
	let smartCharging = await pool.query(sql2); 
	
	data.smartCharging = smartCharging;
	data.lastReservationId = await getLastReservationId();
	data.success = true;
	res.send(data);
});

/********************************************************************************************/
async function getLastReservationId(){
	let sql = "SELECT id_reservacion FROM smartCharging ORDER BY id_reservacion DESC LIMIT 1;";
	let result = await pool.query(sql); 
	var id_reservacion = 0;
	if(result.length>0){
		id_reservacion = result[0].id_reservacion;
	}
	return id_reservacion+1;
}

/*router.get('/home/smartCharging/agregar', (req, res) => {
	res.render('smartChargingAgregar.hbs', {'menu': 'si'}); 
});*/

/********************************************************************************************/
router.post('/home/smartCharging/agregar', async(req, res) => {
	let data = {};
	console.log('llama a smartCharging agregar')
	console.log(req.body)
	let id_tarjeta = req.body.id_tarjeta; 
	let id_estacion = req.body.id_estacion;
	let id_conector = req.body.id_conector;
	let expiry_date = req.body.expiry_date;
	let comentario = req.body.comentario
	
	console.log('expiry_date');
	console.log(expiry_date);
	let sql = 'INSERT INTO smartCharging VALUES (null,?,?,?,?,0);';
	await pool.query(sql, [id_tarjeta, id_estacion, id_conector, expiry_date]);

	
	if(comentario.length>0){
		let sqlIdreservacion = "SELECT id_reservacion FROM smartCharging ORDER BY id_reservacion DESC LIMIT 1";
		let idreservacion = await pool.query(sqlIdreservacion);
		idreservacion = idreservacion[0].id_reservacion;
		let sqlComentario = "INSERT INTO COMENTARIOS VALUES(null,?,?,?,?)";
		let insert = await pool.query(sqlComentario, [1, idreservacion, comentario, 1])
	}
	data.success = true;
	data.message = 'La estación se ha agregado exitosamente!';
	res.send(data);
});

/********************************************************************************************/
router.get('/home/smartCharging/eliminar/:id_reservacion', async(req, res) => {
	let data = {};
	let id_reservacion = req.params.id_reservacion;
	console.log('se pide eliminar: ' + id_reservacion);
	let sql = 'DELETE FROM smartCharging WHERE id_reservacion=?;';
	await pool.query(sql, [id_reservacion]);
	data.success = true;
	res.send(data);
});


/********************************************************************************************/
router.get('/home/smartCharging/info/:id', async(req, res) => {
	var ide = req.params.id;
	let select = 'SELECT * FROM smartCharging ';
	let where = 'WHERE id_reservacion="' + ide + '";';
	const datosreservacion = await pool.query(select + where);
	console.log(datosreservacion);
	res.render('smartChargingInformacion.hbs', {datosreservacion: datosreservacion[0], 'menu': 'si', 'info': true});
});

/********************************************************************************************/
router.get('/home/smartCharging/tarjetas/', async(req, res) => {
	let data = {};
	let sql = "SELECT * FROM tarjetas";
	let result = await pool.query(sql);
	data.tarjetas = result;
	data.success = true;
	res.send(data);  
})
/********************************************************************************************/
router.get('/home/smartCharging/estaciones/', async(req, res) => {
	let data = {};
	let sql = "SELECT * FROM estaciones";
	let result = await pool.query(sql);
	for( var i=0; i<result.length; i++){
		result[i].conectores = await getConectores(result[i].id_estacion);
	}
	data.estaciones = result;
	data.success = true;
	res.send(data);  
})

async function getConectores(id_estacion){
	let sql = "SELECT * FROM conectores WHERE id_estacion=?;";
	let result = await pool.query(sql, [id_estacion]);
	return result;
}

/********************************************************************************************/
router.get('/home/smartCharging/transacciones/:id/:desde/:cuantos', async(req, res) => {
	var data = {};
	//console.log('Se ha llamado a transacciones id')
	var ide = req.params.id;
	var desde = req.params.desde;
	var cuantos = req.params.cuantos;

	let sqlTotal = 'SELECT COUNT(*) as total FROM transacciones WHERE id_reservacion="' + ide + '";';
	let total = await pool.query(sqlTotal);
	total = total[0].total;
	data.total = total

	let sqlSelect = "SELECT tr.*, ta.codigo_rfid FROM transacciones tr, tarjetas ta WHERE id_reservacion='" + ide + 
	"' AND tr.id_tarjeta = ta.id_tarjeta ORDER BY id_transaccion DESC LIMIT " + desde + ", " + cuantos + ";";
	console.log('sqlSelect: ');
	console.log(sqlSelect);
	const transacciones = await pool.query(sqlSelect);
	//console.log(transacciones);
	data.success = true;
	data.transacciones = transacciones;
	res.send(data);
});

/********************************************************************************************/
router.get('/home/smartCharging/tiempoReal/:id', async(req, res) => {
	var ide = req.params.id;
	let select = 'SELECT * FROM conectores ';
	let where = 'WHERE id_reservacion="' + ide + '";';
	const datosConectores = await pool.query(select + where);
	console.log(datosConectores);
	res.render('smartChargingInformacion.hbs', 
	{datosConectores: datosConectores, 'menu': 'si', 'tiempoReal': true, 'id_reservacion': ide});
});


/********************************************************************************************/
router.post('/home/smartCharging/editar/:id', async(req, res) => {
	var data = {};
	console.log('sisi')
	console.log('Datos enviados para actualizar: ');
	console.log(req.body);

	var id = req.params.id;
	var ce = req.body.codigoreservacion
	var ne = req.body.nombrereservacion
	var ubi = req.body.ubicacion
	var cc = req.body.cantidadConectores
	var cs = req.body.cargasSimultaneas

	var pmax = req.body.potenciaMaxima
	var pmin = req.body.potenciaMinima
	var cmax = req.body.corrienteMaxima
	var cmin = req.body.corrienteMinima
	var vmax = req.body.voltajeMaximo
	var vmin = req.body.voltajeMinimo

	var update = 'UPDATE smartCharging ';
	var set = 'SET codigoreservacion="' + ce + 
	'", nombrereservacion="' + ne + 
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

	var where = ' WHERE id_reservacion="' + id + '";';
	var query = update + set + where;
	console.log(query); 
	await pool.query(query);
	data.success = true;
    res.send(data); 
});

/********************************************************************************************/
router.post('/home/smartCharging/gestionar/:id', async(req, res) => {
	const ide = req.params.id;
	const v1 = req.body.valor1;
	const v2 = req.body.valor2;
	const v3 = req.body.valor3;
	const datosreservacion = {
		ide, v1, v2, v3
	};
	/*console.log('Estos son los parámetros: ');
	console.log(datosreservacion);*/
	res.render('smartChargingGestionar.hbs',  {datosreservacion: datosreservacion, 'menu': 'si'}); 
});

/********************************************************************************************/
router.get('/home/smartCharging/diagnostico/:id', async(req, res) => {
	var ide = req.params.id;
	console.log('Este es el id enviad: ', ide);
	res.redirect('/home/smartCharging/gestionar/' + ide); 
});


/********************************************************************************************/
router.get('/home/smartCharging/urlprueba', async(req, res) => {
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
	res.redirect('/home/smartCharging/informacion');
})


router.get('/files', upload.single('diagnostico'), (req,res)=> {
	console.log('Esta es la request: ');
	console.log(req.file);
	res.redirect('/home/smartCharging/informacion')
})

module.exports = router; 
