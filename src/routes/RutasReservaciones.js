const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/seguro.js');
//var Plotly = require('plotly')("DemoAccount", "lr1c37zw81");
const multer = require('multer');
const path = require('path');


/*router.get('/home/reservaciones/informacionBack', async(req, res) => {
	const datosreservacion = await pool.query('SELECT * FROM reservaciones WHERE id_reservacion!=0;'); 
	res.sendFile(path.join(__dirname, '/../views/' + 'reservaciones.html')); 
});*/
/*
router.get('/home/reservaciones/archivo', async(req, res) => {
	//const datosreservacion = await pool.query('SELECT * FROM reservaciones WHERE id_reservacion!=0;'); 
	res.sendFile(path.join(__dirname, '/../views/' + 'reservaciones.html'));
});
*/

/********************************************************************************************/
async function estadoreservacion(id){
	let sql = "SELECT estado_est_espanol FROM estados_reservaciones WHERE id_estado_est=?";
	let result = await pool.query(sql, [id]);
	let estado = result[0].estado_est_espanol;
	return estado
}
/********************************************************************************************/
router.get('/home/reservaciones/informacion', async(req, res) => {
	var data = {};
	let sql1 = "SELECT COUNT(*) as total FROM reservaciones";
	let totalreservaciones = await pool.query(sql1);
	totalreservaciones = totalreservaciones[0].total;
	data.totalreservaciones = totalreservaciones;

	let sql2 = "SELECT * FROM reservaciones es, estado_reservacion ee WHERE es.id_reservacion!=0 AND es.id_reservacion=ee.id_reservacion;"; 
	let reservaciones = await pool.query(sql2); 
	for(var i=0; i<reservaciones.length; i++){
		reservaciones[i].estado = await estadoreservacion(reservaciones[i].id_estado_est);
	}
	data.reservaciones = reservaciones;
	data.success = true;
	res.send(data);
});

/*router.get('/home/reservaciones/agregar', (req, res) => {
	res.render('reservacionesAgregar.hbs', {'menu': 'si'}); 
});*/

/********************************************************************************************/
router.post('/home/reservaciones/agregar', async(req, res) => {
	var data = {};
	console.log('llama a reservaciones agregar')
	console.log(req.body)
	var ce = req.body.codigoreservacion;
	var ns = req.body.nombrereservacion;
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

	var insert = 'INSERT INTO reservaciones VALUES (null,?,?,?,?,?,?,?,?,?,?,?,?,?);';
	const subirreservacion = await pool.query(insert, [ce, ns, ubi, cc, cs, pmin, pmax, vmin, vmax, cmin, cmax, 3, cs ]);

	
	if(comentario.length>0){
		let sqlIdreservacion = "SELECT id_reservacion FROM reservaciones ORDER BY id_reservacion DESC LIMIT 1";
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
router.get('/home/reservaciones/eliminar/:id', async(req, res) => {
	var data = {};
	var ide = req.params.id;
	console.log('se pide eliminar: ' + ide);
	var delet = 'DELETE FROM reservaciones ';
	var where = 'WHERE id_reservacion="' + ide + '";';
	await pool.query(delet + where);
	data.success = true;
	res.send(data);
});


/********************************************************************************************/
router.get('/home/reservaciones/info/:id', async(req, res) => {
	var ide = req.params.id;
	let select = 'SELECT * FROM reservaciones ';
	let where = 'WHERE id_reservacion="' + ide + '";';
	const datosreservacion = await pool.query(select + where);
	console.log(datosreservacion);
	res.render('reservacionesInformacion.hbs', {datosreservacion: datosreservacion[0], 'menu': 'si', 'info': true});
});

/********************************************************************************************/
router.get('/home/reservaciones/transacciones/:id/:desde/:cuantos', async(req, res) => {
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
router.get('/home/reservaciones/tiempoReal/:id', async(req, res) => {
	var ide = req.params.id;
	let select = 'SELECT * FROM conectores ';
	let where = 'WHERE id_reservacion="' + ide + '";';
	const datosConectores = await pool.query(select + where);
	console.log(datosConectores);
	res.render('reservacionesInformacion.hbs', 
	{datosConectores: datosConectores, 'menu': 'si', 'tiempoReal': true, 'id_reservacion': ide});
});


/********************************************************************************************/
router.post('/home/reservaciones/editar/:id', async(req, res) => {
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

	var update = 'UPDATE reservaciones ';
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
router.post('/home/reservaciones/gestionar/:id', async(req, res) => {
	const ide = req.params.id;
	const v1 = req.body.valor1;
	const v2 = req.body.valor2;
	const v3 = req.body.valor3;
	const datosreservacion = {
		ide, v1, v2, v3
	};
	/*console.log('Estos son los parámetros: ');
	console.log(datosreservacion);*/
	res.render('reservacionesGestionar.hbs',  {datosreservacion: datosreservacion, 'menu': 'si'}); 
});

/********************************************************************************************/
router.get('/home/reservaciones/diagnostico/:id', async(req, res) => {
	var ide = req.params.id;
	console.log('Este es el id enviad: ', ide);
	res.redirect('/home/reservaciones/gestionar/' + ide); 
});


/********************************************************************************************/
router.get('/home/reservaciones/urlprueba', async(req, res) => {
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
	res.redirect('/home/reservaciones/informacion');
})


router.get('/files', upload.single('diagnostico'), (req,res)=> {
	console.log('Esta es la request: ');
	console.log(req.file);
	res.redirect('/home/reservaciones/informacion')
})

module.exports = router; 
