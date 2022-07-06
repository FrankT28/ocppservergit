const express = require('express');
const router = express.Router();
const pool = require('../database');
var fs = require('fs');
const path = require('path');


function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp);
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec ;
	return time;
  }

/******************************************************************************/
function formatDate (input) {
	var datePart = input.match(/\d+/g),
	year = datePart[0], // get only two digits
	month = datePart[1], 
	day = datePart[2];
  
	return day+'-'+month+'-'+year;
}
/******************************************************************************/
router.get('/home/transacciones/informacion/:desde/:cuantos', async(req, res) => {
	var data = {};
	let totalTransacciones = await pool.query('SELECT COUNT(*) as total FROM transacciones;'); 
	let desde = parseInt(req.params.desde); 
	let cuantos = parseInt(req.params.cuantos);
	let sql = 'SELECT tr.*, SUBTIME(tr.hora_fin, tr.hora_inicio) duracion, ta.codigo_rfid, cl.razon_social, es.codigoEstacion FROM transacciones tr, tarjetas ta, clientes cl, estaciones es WHERE tr.id_tarjeta=ta.id_tarjeta AND ta.id_cliente=cl.id_cliente AND tr.id_estacion=es.id_estacion ORDER BY id_transaccion DESC LIMIT ?, ?';
	var transacciones = await pool.query(sql, [desde, cuantos]); 

	let transaccion;
	for (var i=0; i<transacciones.length; i++){
		transaccion = transacciones[i];
		//ESTO ES PARA SACAR SOLO LA FECHA Y QUE NO VENGA CON 'T00:00:00Z'
		transacciones[i].fecha = transaccion.fecha.toISOString().split('T')[0];
		transacciones[i].fecha = formatDate(transaccion.fecha);
		transacciones[i].energiaConsumida = transaccion.energiaConsumida/1000;
		//transacciones[i].duracion = duracionTransaccion(transaccion.hora_fin, transaccion.hora_inicio);
	};

	data.success = true;
	data.transacciones = transacciones;
	data.totalTransacciones = totalTransacciones[0].total;

	res.send(data); 
});

/******************************************************************************/
router.get('/home/transacciones/get_grafica/:id', async(req, res)=> { 
	let id = req.params.id;
	//let sql = "SELECT * FROM energy_active_import_register WHERE id_transaccion=?;";
	let sql = "SELECT * FROM energy_active_import_register WHERE id_transaccion=?;";
	let arr = await pool.query(sql, [id]);
	var matrix = [];
	let fila;
	let elemento;
	for(var i=0; i<arr.length; i++) {
		fila = arr[i];
		console.log('fila');
		console.log(fila);
		var obj = {};
		hora = fila.hora.toISOString();
		console.log('hora');
		console.log(hora);
		hora = hora.split('T');
		obj.dia = hora[0];
		obj.hora = hora[1].substring(0,8);

		//VALOR
		valor = fila.valor;
		console.log('valor');
		console.log(valor);
		valor = parseInt(valor, 10)/1000;
		obj.valor = valor;

		//ASIGNAMOS EL OBJECTO
		matrix[i] = obj;
	}	

	console.log('matrix');
	console.log(matrix)

	res.send(matrix);
});

/******************************************************************************
router.get('/home/transacciones/get_grafica/:id', (req, res)=> { 
	let id = req.params.id;
	var matrix = [];
	try {  
		var data = fs.readFileSync(path.join(__dirname + '/graficas/' + id + '_energia.txt'), 'utf8');
		const arr = data.toString().replace(/\r\n/g,'\n').split('\n');
		let fila;
		let elemento;
		for(var i=0; i<arr.length-1; i++) {
			fila = arr[i];
			fila = fila.split('Z ');
			matrix[i] = [];
			cont=0;
			var obj = {};
			for (var j=0; j<fila.length; j++){
				elemento = fila[j].replace(/ /g,'');
				if(j==0){
					elemento = elemento.split('T');
					cont++;
					obj.dia = elemento[0];
					obj.hora = elemento[1].substring(0,8);
				}else if(j==1) {
					elemento = parseInt(elemento, 10)/1000;
					obj.valor = elemento;
				}
				cont++;
				matrix[i] = obj;
			}
		}	

		console.log('matrix');
		console.log(matrix)
	} catch(e) {
		console.log('Error:', e.stack);
	}

	res.send(matrix);
});

/******************************************************************************/
function duracionTransaccion(inicio, fin){
	console.log('inicio');
	console.log(inicio);

	console.log('fin');
	console.log(fin);

	var hora1 = (inicio).split(":");
	var hora2 = (fin).split(":");
	var diferencia = '';
	let horas = parseInt(hora1[0]) - parseInt(hora2[0]);
	let minutos = parseInt(hora1[1]) - parseInt(hora2[1]);
	let segundos = parseInt(hora1[2]) - parseInt(hora2[2]);

	diferencia = horas + ':' + minutos + ':' + segundos;
	console.log('diferencia');
	console.log(diferencia);
	return diferencia;
}

/******************************************************************************/
async function tarjetaTransaccion(id){
    var tarjetas = [];
    let sql = "SELECT codigo_rfid FROM tarjetas WHERE id_cliente=" + id + "; ";
    tarjetas = await pool.query(sql);
    if(tarjetas.length==0){
        /*tarjetas[0] = {};
        tarjetas[0].codigo_rfid = 'Sin Asignar';*/
		tarjetas = [];
    }
    return tarjetas;
}
/******************************************************************************/
router.get('/home/transacciones/eliminar/:id', async(req, res) => {
	var idt = req.params.id;
	await pool.query('DELETE FROM transacciones WHERE id_transaccion=?', idt);
	res.redirect('/home/transacciones/informacion');
});




module.exports = router; 