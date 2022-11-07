const express = require('express');
const router = express.Router();
const pool = require('../database');


/********************************************************************************************/
async function getComentario(modulo, id){
    let sql = "SELECT comentario FROM comentarios WHERE id_modulo=" + modulo + " AND id_registro=" + id + "; ";
    let comentario = await pool.query(sql);
    if(comentario.length>0){
        comentario = comentario[0].comentario;
    }else{
        comentario = '';
    }
    return comentario;
}
/****************************SECCION DE FUNCIONES**********************
async function clientePorId(id){
    let sql = "SELECT razon_social FROM clientes WHERE id_cliente=" + id + "; ";
    let cliente = await pool.query(sql);
    if(cliente.length>0){
        cliente = cliente[0].razon_social;
    }else{
        cliente = 'Sin Asignar';
    }
    return cliente;
}
/**************************************************/
async function clientePorId(id_cliente){
    let cliente = {};
    let sql = "SELECT * FROM clientes WHERE id_cliente=?;";
    cliente = await pool.query(sql, [id_cliente]);
    if(cliente.length<0){
        cliente.razon_social = 'Sin Asignar';
    }else{ 
        cliente = cliente[0];
    }
    return cliente;
}
/****************************SECCION DE FUNCIONES**********************/
/*Rutas definitivas*/
router.get('/home/tarjetas/informacion/:desde/:cuantos', async(req, res) => {
    var data = {};
    let sql = "SELECT COUNT(*) as total FROM tarjetas";
    let total = await pool.query(sql);
    let desde = parseInt(req.params.desde);
    let cuantos = parseInt(req.params.cuantos);
    data.totalTarjetas = total[0].total;

    sql = 'SELECT ta.*, ea.nombre estadoAutorizacion, ea.alias FROM tarjetas ta, estados_autorizacion ea WHERE ta.id_estado_autorizacion=ea.id_estado_autorizacion ORDER BY id_tarjeta DESC LIMIT ?, ?;';
	var tarjetas = await pool.query(sql, [desde, cuantos]);
    var i = 0;
    for(const row of tarjetas){ 
        tarjetas[i].saldo = (Math.round(tarjetas[i].saldo * 100) / 100).toFixed(2);
        //tarjetas[i].razon_social = await clientePorId(tarjetas[i].id_cliente)
        tarjetas[i].cliente = await clientePorId(tarjetas[i].id_cliente)
        tarjetas[i].comentario = await getComentario(2, tarjetas[i].id_tarjeta); 
        i++;
    };
    data.success = true;
    data.tarjetas = tarjetas;
    res.send(data); 
});

/*************************************************************************/
router.post('/home/tarjetas/agregar', async (req, res) => {
    var data = {};
    console.log('El formulario ha enviado lo siguiente: ');
    console.log(req.body)
    let codigo_rfid = req.body.codigo_rfid;
    let id_estado_autorizacion = req.body.id_estado_autorizacion;
    let saldo = req.body.saldo;
    let comentario = req.body.comentario;


    let insert = await pool.query('INSERT INTO tarjetas VALUES (null,?,?,0,?);', [id_estado_autorizacion, codigo_rfid, saldo]);
    //console.log(it.insertId);
    if(insert.insertId){
        let mensaje = 'Tarjeta añadida exitósamente';
    }else{
        let mensaje = 'Ha ocurrido un problema al intentar subir la información'
    }

    if(comentario!=undefined && comentario.length>0){
        let sqlIdTarjeta = "SELECT id_tarjeta FROM tarjetas ORDER BY id_tarjeta DESC LIMIT 1";
        let idtarjeta = await pool.query(sqlIdTarjeta);
        idtarjeta = idtarjeta[0].id_tarjeta;
        let sqlComentario = "INSERT INTO COMENTARIOS VALUES(null,?,?,?,?)";
        let insert = await pool.query(sqlComentario, [ 2, idtarjeta, comentario, 1])
    }

    data.success = true;
    res.send(data); 
});

/*************************************************************************/
router.get('/home/tarjetas/estados_autorizacion', async (req, res) => {
    var data = {};
    let sql = "SELECT * FROM estados_autorizacion;";
    let result = await pool.query(sql);
 
    data.success = true;
    data.estadosAutorizacion = result;
    res.send(data);
})


/*************************************************************************/
router.get('/home/tarjetas/eliminar/:id_tarjeta', async(req, res) => {
    let data = {};
	let id_tarjeta = req.params.id_tarjeta;
    let sql = 'DELETE FROM tarjetas WHERE id_tarjeta=?';
	await pool.query(sql, [id_tarjeta]);
    data.success = true;
	// res.redirect('/home/tarjetas/informacion');
    res.send(data);
});

/*
router.get('/home/tarjetas/editar/:id', async(req, res) => {
	var idt = req.params.id;
    var select = 'SELECT * FROM tarjetas ';
	var where = 'WHERE id_tarjeta="' + idt + '";';
	const datosTarjeta = await pool.query(select + where);
	console.log(datosTarjeta);
	res.render('TarjetasEditar.hbs', {datosTarjeta: datosTarjeta[0], 'menu': 'si'}); 
});
*/

router.post('/home/tarjetas/editar/:id_tarjeta', async(req, res) => {
    let data = {};
	let id_tarjeta = req.params.id_tarjeta;
    let idTag = req.body.codigo_rfid
    let id_estado_autorizacion = req.body.id_estado_autorizacion
    let saldo = req.body.saldo
	let sql = 'UPDATE tarjetas SET codigo_rfid=?, id_estado_autorizacion=?, saldo=? WHERE id_tarjeta=?;';
	await pool.query(sql, [idTag, id_estado_autorizacion, saldo, id_tarjeta]);
    data.success = true;
    res.send(data); 
}); 




 













/* En prueba aun*/
 

router.get('/IngresarSaldo:idt', async(req, res) => {
    const idt = req.params.idt;
    const saldo = 100;
    console.log('Esto es id: ' + idt);
    const query = 'UPDATE tarjeta_usuario SET saldo=' + saldo + ' WHERE codigo_tarjeta="' + idt + '";';
    console.log('Esta es la query: ' + query)
    const insert = await pool.query(query);
    console.log(insert);
    res.send('Se ha ingresado el saldo');
});


router.get('/VerTarjetas:idu', async(req, res) => {
    const idu = req.params.idu;
    console.log('Esto es id: ' + idu);
    const query = 'SELECT * FROM tarjeta_usuario WHERE id_usuario=' + idu + ';'
	const TarjetasUsuario = await pool.query(query);
    res.render('TarjetasUsuario.hbs', {TarjetasUsuario: TarjetasUsuario, 'menuadmin': 'si'}); 
});








router.get('/Tarjetas/eliminar/:id', async(req, res) => {
    var idt = req.params.id;
    console.log(idt);
    var delet = 'DELETE FROM tarjetas ';
    var where = 'WHERE id_tarjeta="' + idt + '";';
    var query = delet + where;
    console.log(query)
    const dt = await pool.query(query);
    console.log(dt);
	res.redirect('/Tarjetas')
});




router.get('/Tarjetas/editar/:id', async(req, res) => {
    var idt = req.params.id;
    console.log(idt);
    var select = 'SELECT * FROM tarjetas ';
    var where = 'WHERE id_tarjeta="' + idt + '";';
    var query = select + where;
    console.log(query)
	const datosTarjeta = await pool.query(query);
	console.log(datosTarjeta)
	res.render('TarjetasEditar.hbs',  {datosTarjeta: datosTarjeta[0], 'menuadmin': 'si'})
});



router.post('/TarjetasActualizar/:id', async(req, res) => {
	var idt = req.params.id;
	var ct = req.body.codigo_tarjeta;
	var et = req.body.estado_tarjeta;
	
    var update = 'UPDATE tarjetas ';
    var set = 'SET codigo_tarjeta="' + ct + '", estado_tarjeta="' + et + '" ';
	var where = 'WHERE id_tarjeta="' + idt + '";';
	var query = update + set + where;
	console.log(query); 
    const ut = await pool.query(query);
    console.log(ut)
    res.redirect('/Tarjetas'); 
});



router.get('/tarjetas/adjuntar/:id', function(req, res) {
    var idu = req.params.id;
    console.log('el idu es: '+ idu)
    res.render('TarjetasAdjuntar.hbs', {'idu': idu, 'menuadmin': 'si'}); 
});


router.post('/tarjetas/adjuntar/:idu', async(req, res) => {
    var idu = req.params.idu;
    var cdt = req.body.ctl;
    var saldo = req.body.saldo_tarjeta;

    var insert = 'INSERT INTO tarjeta_usuario (codigo_tarjeta, id_usuario, saldo) ';
    var values = 'VALUES ("' + cdt + '", "' + idu + '", "' + saldo + '");';

    var query = insert + values;
    console.log('Resultados de la consulta: ');
    console.log(query)
    const atu = await pool.query(query);
    console.log(atu);
    
    res.render('TarjetasAdjuntar.hbs', {'mensaje': 'Tarjeta adjuntada exitósamente', 'menuadmin': 'si'}); 
});


module.exports = router; 