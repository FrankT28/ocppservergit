
/*function toClientProfile(id_cliente){
	document.getElementById('clientsDetails').style.display = 'none';
	
	
	var idc = 'cliente' + id_cliente; 
	var cliente = document.getElementById(idc).innerHTML;

	console.log('Estos son los datos del cliente especifico: ');
	console.log(cliente);

	var template = document.getElementById('clientProfile').innerHTML;
	console.log('Esto es templage: ');
	console.log(template);
	var compile = Handlebars.compile(template)
	var data = {'cliente': cliente}
	var compiledHTML = compile(data)
	document.getElementById('clientes').innerHTML += compiledHTML;
	//document.getElementById('clientProfile').style.display = 'block';

}*/


function toClientProfile(id_cliente){
	document.getElementById('clientsDetails').style.display = 'none';
	var idc = 'cliente' + id_cliente; 
	var cliente = JSON.parse(document.getElementById(idc).innerHTML);
	console.log('Esto es cliente: ');
	console.log(cliente);
	console.log(cliente.ruc);
	document.getElementById('ruc').innerHTML = cliente.ruc;
	document.getElementById('razon_social').innerHTML = cliente.razon_social;
	document.getElementById('telefono').innerHTML = cliente.telefono;
	document.getElementById('direccion').innerHTML = cliente.direccion;
	document.getElementById('fecha_registro').innerHTML = cliente.fecha_registro;
	document.getElementById('hora_registro').innerHTML = cliente.hora_registro;
	document.getElementById('clientProfile').style.display = 'block';
}

function toClientsDetails(){
	document.getElementById('clientProfile').style.display = 'none';
	document.getElementById('clientsDetails').style.display = 'block';

}

function clientes(){
	var dqq = document.getElementById('datosquequiero').innerHTML;
	console.log('Estos son los datos del cliente: ');
	//var algo = window.datosClientes;
	console.log(dqq);

}