const express = require('express');
const router = express.Router();
const path = require('path');

const passport = require('passport');
const pool = require('../database');
//console.log(pool);
const nbd = pool.config.connectionConfig.database;
const {isLoggedIn} = require('../lib/seguro');



router.get('/', (req, res) =>{
	//let rutaIndex = path.join(__dirname, '/../public/pages/login.html');
	let rutaIndex = path.join(__dirname, '/../public/pages/login.html');
	console.log('se pide el archivo: ' + rutaIndex)
	res.sendFile(rutaIndex);
})

router.post('/', async(req, res) =>{
	let username = req.body.username;
	let password = req.body.password;
	let sql = "SELECT id_usuario FROM usuarios WHERE username=? AND password=?";
	let result = await pool.query(sql,[username, password]);
	if(result.length>0){
		console.log('Existe el usuario')
		res.sendFile(path.join(__dirname, '/../index.html'));
	}else{
		console.log('login fail')
		res.sendFile(path.join(__dirname, '/../public/pages/login.html'));
	}
})

router.get('/Estaciones.html', (req, res) =>{
	console.log('se ha pidod estaciones xdxdxd')
	res.sendFile(path.join(__dirname, '/../views/' + 'Estaciones.html'));
	//res.sendFile(path.join(__dirname, '/../views/Estaciones.html'));
})

/*router.get('*', function(req, res) {
	res.sendFile('./public/index.html');
 });
*/
router.get('/contact', (req, res) =>{
	console.log('se ha pidod contact')
	res.sendFile(path.join(__dirname, '/../views/contact.html'));
})

router.get('/apk/home/', async(req, res) =>{
	console.log('APK ha pedido datos');
	let query = "SELECT * FROM clientes";
	var clientes = await pool.query(query);
	var data = {};
	data.clientes = clientes;
	console.log('data: ')
	console.log(data)
	res.send(data);
})

router.get('/apk', async(req, res) =>{
	var data = {};
	console.log('apk ha hecho una solicitud')
	var query = "SELECT * FROM clientes c, tarjetas t WHERE c.id_cliente='1' AND c.id_cliente=t.id_cliente";
	var cliente = await pool.query(query);
	data.cliente = cliente;
	data.cliente[0].saldo = data.cliente[0].saldo.toString();
	data.cliente[0].telefono = " " + data.cliente[0].telefono.toString();
	console.log('esto es data cliente: ');
	console.log(data);
	res.send(cliente);
})

router.get('/urlprueba', isLoggedIn, async(req, res) =>{
	console.log('Se ha pedido prueba')
	res.sendFile(path.join(__dirname, '/../views/prueba.html'));
})

router.get('/home/prueba', isLoggedIn, async(req, res) =>{
	const datosEstacion = await pool.query('SELECT * FROM estaciones WHERE id_estacion!=0;'); 
	res.send({datosEstacion: datosEstacion, 'menu': 'si'});
})

/*
router.get('/Home', isLoggedIn , async(req, res) => {
	
	let tablas = await pool.query('SELECT table_name AS nombre FROM information_schema.tables WHERE table_schema = "' + nbd + '";'); 
	
	//console.log(tablas);
	let  cantidades = [];
	delete tablas[1];
	console.log('Estas son las tablas: ');
	for (const prop in tablas){
		console.log(prop)
	}
	const diccionario = ['gestionadas','', 'usadas', 'realizadas']
	for (const n in tablas){
		var cantidad = await pool.query('SELECT count(*) as c FROM ' + tablas[n].nombre + ';');
		tablas[n].cant = cantidad[0].c;
		console.log('La cantidad de ' + tablas[n].Tables_in_sistema_central + ' es ' + cantidad[0].c);
		tablas[n].dict = diccionario[n];	
	}
	
	res.render('Home_respaldo.hbs', {'menu': 'si', 'tablas': tablas}); 

});
*/

router.post('/Home', (req, res, next) => {
	var username = req.body.cred_admin;
	var password = req.body.contr_admin;
	passport.authenticate('local.signin', {
		successRedirect: '/Home',
		failureRedirect: '/'
	})(req, res, next);
	/*
	if(username=='Administrador'){
		if(password=='contraadmin'){
			res.render('Home.hbs', {'menu': 'si'}); 
		};
	};*/
});

module.exports = router; 