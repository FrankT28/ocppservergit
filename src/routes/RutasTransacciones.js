const express = require('express');
const router = express.Router();
const pool = require('../database');

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
	let sql = 'SELECT tr.*, ta.codigo_rfid, cl.razon_social FROM transacciones tr, tarjetas ta, clientes cl WHERE tr.id_tarjeta=ta.id_tarjeta AND ta.id_cliente=cl.id_cliente ORDER BY id_transaccion DESC LIMIT ?, ?';
	var transacciones = await pool.query(sql, [desde, cuantos]); 

	for (var i=0; i<transacciones.length; i++){
		console.log('transaccion: ');
		console.log(transacciones[i]);
		//ESTO ES PARA SACAR SOLO LA FECHA Y QUE NO VENGA CON 'T00:00:00Z'
		transacciones[i].fecha = transacciones[i].fecha.toISOString().split('T')[0];
		transacciones[i].fecha = formatDate(transacciones[i].fecha);
	};

	data.success = true;
	data.transacciones = transacciones;
	data.totalTransacciones = totalTransacciones[0].total;

	res.send(data); 
}); 

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