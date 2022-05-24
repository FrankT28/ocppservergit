const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/seguro.js');
var Plotly = require('plotly')("DemoAccount", "lr1c37zw81");
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
router.get('/home/estaciones/informacion', async(req, res) => {
	var data = {};
	let sql1 = "SELECT COUNT(*) as total FROM estaciones";
	let totalEstaciones = await pool.query(sql1);
	totalEstaciones = totalEstaciones[0].total;
	data.totalEstaciones = totalEstaciones;

	let sql2 = "SELECT * FROM estaciones WHERE id_estacion!=0;"; 
	let estaciones = await pool.query(sql2); 
	data.estaciones = estaciones;
	data.success = true;
	res.send(data);
});

/*router.get('/home/estaciones/agregar', (req, res) => {
	res.render('EstacionesAgregar.hbs', {'menu': 'si'}); 
});*/

/********************************************************************************************/
router.post('/home/estaciones/agregar', async(req, res) => {
	var data = {};
	console.log('llama a estaciones agregar')
	console.log(req.body)
	var ce = req.body.codigoEstacion;
	var ns = req.body.nombreEstacion;
	var cc = req.body.cantidadConectores;
	var cs = req.body.cargasSimultaneas;

	var pmax = req.body.potenciaMaxima
	var pmin = req.body.potenciaMinima
	var cmax = req.body.corrienteMaxima
	var cmin = req.body.corrienteMinima
	var vmax = req.body.voltajeMaximo
	var vmin = req.body.voltajeMinimo
	var comentario = req.body.comentario

	var insert = 'INSERT INTO estaciones VALUES (null,?,?,?,?,?,?,?,?,?,?,?,?);';
	const subirEstacion = await pool.query(insert, [ce, ns, cc, cs, pmin, pmax, vmin, vmax, cmin, cmax, 3, cs ]);

	
	if(comentario.length>0){
		let sqlIdEstacion = "SELECT id_estacion FROM estaciones ORDER BY id_estacion DESC LIMIT 1";
		let idEstacion = await pool.query(sqlIdEstacion);
		idEstacion = idEstacion[0].id_estacion;
		let sqlComentario = "INSERT INTO COMENTARIOS VALUES(null,?,?,?,?)";
		let insert = await pool.query(sqlComentario, [1, idEstacion, comentario, 1])
	}
	data.success = true;
	data.message = 'La estación se ha agregado exitosamente!';
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


/********************************************************************************************/
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
	//console.log('Se ha llamado a transacciones id')
	var ide = req.params.id;
	var desde = req.params.desde;
	var cuantos = req.params.cuantos;

	let sqlTotal = 'SELECT COUNT(*) as total FROM transacciones WHERE id_estacion="' + ide + '";';
	let total = await pool.query(sqlTotal);
	total = total[0].total;
	data.total = total

	let sqlSelect = "SELECT tr.*, ta.codigo_rfid FROM transacciones tr, tarjetas ta WHERE id_estacion='" + ide + 
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
	console.log('Estos son los parámetros: ');
	console.log(datosEstacion);
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