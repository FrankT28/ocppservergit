const express = require('express');
const router = express.Router();
const path = require('path');

const passport = require('passport');
const pool = require('../database');
const nbd = pool.config.connectionConfig.database;

const {isLoggedIn} = require('../lib/seguro');

router.get('/home/dashboard/informacion', async(req, res) =>{
	data = {};
	console.log('se pide /home/dashboard/informacion');
	let result = await pool.query('SELECT table_name AS nombre FROM information_schema.tables WHERE table_schema = "' + nbd + '";'); 
	let  cantidades = [];
	
	const diccionario = ['gestionadas','', 'usadas', 'realizadas'];
	var tablas = [];
	for (var i=0; i<result.length;i++){
		tablas[i] = {};
		tablas[i].nombre = result[i].nombre;
		var cantidad = await pool.query('SELECT count(*) as c FROM ' + result[i].nombre + ';');
		tablas[i].cant = cantidad[0].c;
		console.log('La cantidad de ' + result[i].nombre + ' es ' + cantidad[0].c);
	}
	data['tablas'] = tablas;
	res.send(data); 

})

module.exports = router; 