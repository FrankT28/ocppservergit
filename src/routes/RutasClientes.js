const express = require('express');
const router = express.Router();
const pool = require('../database');

/********************************************************************************************/
function invierte_fecha(fecha){
    const months = ["Enero","Febrero","Marzo","Abril","May","June","July","August","September","October","November","December"];
    console.log('tipo de dato: ' + typeof(fecha));
    console.log('fecha original: ');
    console.log(fecha);
    let year = fecha.getFullYear()
    let month = months[fecha.getMonth()];
    let day = fecha.getDate()
    let fecha_invertida = day + '-' + month + '-' + year;
    return fecha_invertida
}

/********************************************************************************************/
async function tarjetasCliente(id){
    var tarjetas = [];
    let sql = "SELECT * FROM tarjetas WHERE id_cliente=" + id + "; ";
    tarjetas = await pool.query(sql);
    if(tarjetas.length==0){
        /*tarjetas[0] = {};
        tarjetas[0].codigo_rfid = 'Sin Asignar';*/
		tarjetas = [];
    }
    return tarjetas;
}
/********************************************************************************************/
async function comentario(modulo, id){
    let sql = "SELECT comentario FROM comentarios WHERE id_modulo=" + modulo + " AND id_registro=" + id + "; ";
    let comentario = await pool.query(sql);
    if(comentario.length>0){
        comentario = comentario[0].comentario;
    }else{
        comentario = '';
    }
    return comentario;
}
/*Rutas definitivas*/
/********************************************************************************************
router.get('/home/clientes', async(req, res) => {
	const datosClientes = await pool.query('SELECT * FROM clientes');
    console.log('Este es el resultado de clientes: ');
    
    datosClientes.forEach(element => {
        console.log(element);
        element.fecha_registro = invierte_fecha(element.fecha_registro);
    });
    res.render('Clientes.hbs', {datosClientes: datosClientes, 'menu': 'si'}); 
});

/********************************************************************************************/
router.get('/home/clientes/informacion', async(req, res) => {
	var data = {};
	let sql1 = "SELECT COUNT(*) as total FROM clientes";
	let totalClientes = await pool.query(sql1);
	totalClientes = totalClientes[0].total;
	data.totalClientes = totalClientes;

	let sql2 = "SELECT * FROM clientes  ;"; 
	let clientes = await pool.query(sql2); 

    var i = 0;
    for(const row of clientes){
        //clientes[i].codigo_rfid = await tarjetaPorId(clientes[i].id_cliente)
        clientes[i].tarjetas = await tarjetasCliente(clientes[i].id_cliente)
        clientes[i].comentario = await comentario(3, clientes[i].id_cliente)
        i++;
    };

	data.clientes = clientes;
	data.success = true;
	res.send(data);
});


/********************************************************************************************/
router.post('/home/clientes/agregar', async(req, res) => {
	var data = {};
	console.log('llama a clientes agregar')
	console.log(req.body)
	var ruc = req.body.ruc;
	var razon_social = req.body.razon_social;
	var telefono = req.body.telefono;
	var ciudad = req.body.ciudad
	var direccion = req.body.direccion;
	var email = req.body.email
	var comentario = req.body.comentario

	var insert = 'INSERT INTO clientes VALUES (null,?,?,?,?,?,?,?,now(),now());';
	const subirCliente = await pool.query(insert, [ruc, razon_social, telefono, ciudad, direccion, email, '']);

	
	if(comentario.length>0){
		let sqlIdCliente = "SELECT id_cliente FROM clientes ORDER BY id_cliente DESC LIMIT 1";
		let idCliente = await pool.query(sqlIdCliente);
		idCliente = idCliente[0].id_cliente;
		let sqlComentario = "INSERT INTO COMENTARIOS VALUES(null,?,?,?,?)";
		let insert = await pool.query(sqlComentario, [3, idCliente, comentario, 1])
	}
	data.success = true;
	data.message = 'La estación se ha agregado exitosamente!';
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
router.post('/home/clientes/editar/:id', async(req, res) => {
	var data = {};

	var id = req.params.id;
	var ruc = req.body.ruc
	var razon_social = req.body.razon_social
	var telefono = req.body.telefono
	var ciudad = req.body.ciudad
	var direccion = req.body.direccion
	var email = req.body.email

	let sql1 = 'UPDATE clientes SET ' +
    ' ruc="' + ruc + 
	'", razon_social="' + razon_social + 
	'", telefono="' + telefono + 
	'", ciudad="' + ciudad + 
	'", direccion="' + direccion + 
	'", email="' + email + 
	'"';

	var sql2 = ' WHERE id_cliente="' + id + '";';
	var query = sql1 + sql2;
	await pool.query(query);
    data.success = true;
    res.send(data); 
});

/********************************************************************************************/
router.get('/home/clientes/eliminar/:id', async(req, res) => {
	var data = {};
	var ide = req.params.id;
	console.log('se pide eliminar: ' + ide);
	var delet = 'DELETE FROM clientes ';
	var where = 'WHERE id_cliente="' + ide + '";';
	await pool.query(delet + where);
	data.success = true;
	res.send(data);
});

/********************************************************************************************/
router.get('/home/clientes/tarjetas/', async(req, res) => {
    var data = {};
    let sql = "SELECT id_tarjeta, codigo_rfid, saldo FROM tarjetas WHERE id_cliente=0";
    var tarjetas = await pool.query(sql);
    for(var i=0; i<tarjetas.length; i++){
		tarjetas[i].busqueda = tarjetas[i].id_tarjeta + ' - ' + tarjetas[i].codigo_rfid;
	}
	console.log('tarjetas')
    console.log(tarjetas)
	
    data.tarjetas = tarjetas;
    data.success = true;
    res.send(data);
});
/********************************************************************************************/

/********************************************************************************************/
router.get('/home/clientes/asignar_tarjeta/:idc/:idt', async(req, res) => {
	var data = {};
	console.log('llama a clientes asignar')
	console.log(req.body)
	var id_cliente = req.params.idc;
	var id_tarjeta = req.params.idt;
	
	var sql = 'UPDATE tarjetas SET id_cliente = ? WHERE id_tarjeta = ?;';
	const asignarTarjeta = await pool.query(sql, [id_cliente, id_tarjeta]);

	data.success = true;
	data.message = 'Tarjeta asignada correctamente!';
	data.tarjetas = await tarjetasCliente(id_cliente);
	res.send(data);
}); 

/********************************************************************************************/
router.get('/home/clientes/desvincular_tarjeta/:idc/:idt', async(req, res) => {
	var data = {};
	console.log('llama a clientes desvincular')
	console.log(req.body)
	var id_cliente = req.params.idc;
	var id_tarjeta = req.params.idt;
	
	var sql = 'UPDATE tarjetas SET id_cliente = 0 WHERE id_tarjeta = ?;';
	const desvincularTarjeta = await pool.query(sql, [id_tarjeta]);

	data.success = true;
	data.message = 'Tarjeta asignada correctamente!';
	data.tarjetas = await tarjetasCliente(id_cliente);
	res.send(data);
}); 
/********************************************************************************************/

module.exports = router; 