const http = new XMLHttpRequest();

function changeConfiguration(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "ChangeConfiguration", "stationId": stationId});
	ws.send(PayloadRequest);
}

function setChargingProfile(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "SetChargingProfile", "stationId": stationId});
	ws.send(PayloadRequest);
}


function clearChargingProfile(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "ClearChargingProfile", "stationId": stationId});
	ws.send(PayloadRequest);
}

function getLocalListVersion(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "GetLocalListVersion", "stationId": stationId});
	ws.send(PayloadRequest);
}

function sendLocalList(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "SendLocalList", "stationId": stationId});
	ws.send(PayloadRequest);
}

function getCompositeSchedule(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "GetCompositeSchedule", "stationId": stationId});
	ws.send(PayloadRequest);
}

function cancelReservation(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "CancelReservation", "stationId": stationId, "reservationId": 100});
	ws.send(PayloadRequest);
}

function getDiagnostics(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "GetDiagnostics", "stationId": stationId});
	ws.send(PayloadRequest);
}

function getConfiguration(stationId){

	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "GetConfiguration", "stationId": stationId});
	ws.send(PayloadRequest);
}

function changeConfiguration(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "ChangeConfiguration", "stationId": stationId});
	ws.send(PayloadRequest);
}

function buttons_startRemoteTransaction(){
	ocultar_bloques();
	document.getElementById("ventana_startremote").style.display="block";

}

function buttons_changeAvailability(){

	ocultar_bloques();
	document.getElementById("ventana_disponibilidad").style.display="block";

}


function ChangeAvailability(stationId,id){
	//console.log('Hola');
	
	var checkBox= document.getElementById(id);
	var idConector;
	console.log('stationId: ' + stationId);
	if(id=="CCS"){
		idConector=1;


	}else if(id=="Chademo"){

		idConector=2;

	}else if(id=="AC"){
		idConector=3;
	}
	if(checkBox.checked==true){
		var PayloadRequest = JSON.stringify({"tipo": "ChangeAvailability","Estado":"Operative","Conector":idConector,"stationId": stationId});
		ws.send(PayloadRequest);
	}
	else{
		var PayloadRequest = JSON.stringify({"tipo": "ChangeAvailability","Estado":"Inoperative","Conector":idConector, "stationId": stationId});
		ws.send(PayloadRequest);
	}
	
}

function buttons_unlockConnector(){

	ocultar_bloques();
	document.getElementById("ventana_desbloqueo").style.display="block";
	

}

function UnlockConnector(stationId, id){
	//var conectorbutton= document.getElementById(id).id;
	var idConector;
	console.log('stationId: ' + stationId);
	if(id=="UnCCS"){
		idConector=1;
	}else if(id=="UnChademo"){
		idConector=2;
	}else if(id=="UnAC"){
		idConector=3;
	}
	var PayloadRequest = JSON.stringify({"tipo": "UnlockConnector","Conector":idConector,"stationId": stationId});
	ws.send(PayloadRequest);

}

function remoteStartTransaction(stationId){
	var idtag=document.getElementById("id_startremote").value;
	var conector=parseInt(document.getElementById("conector_startremote").value);
	var PayloadRequest = JSON.stringify({"tipo": "RemoteStartTransaction","idtag":idtag,"Conector":conector,"stationId": stationId});
	ws.send(PayloadRequest);
}

function remoteStopTransaction(stationId){
	var PayloadRequest = JSON.stringify({"tipo": "RemoteStopTransaction","idtag":"7240E49A", "stationId": stationId});
	ws.send(PayloadRequest);
}

function buttons_reset(stationId){
	ocultar_bloques();
	document.getElementById('ventana_reset').style.display="block";
}

function reset(stationId,id){
	if (id=='SoftReset'){
		var PayloadRequest = JSON.stringify({"tipo": "Reset", "Type": 'Soft',"stationId": stationId});
		ws.send(PayloadRequest);



	}
	else if(id=='HardReset'){
		var PayloadRequest = JSON.stringify({"tipo": "Reset", "Type": 'Hard',"stationId": stationId});
		ws.send(PayloadRequest);



	}

}

function clearCache(stationId){
	
	var PayloadRequest = JSON.stringify({"tipo": "ClearCache", "stationId": stationId});
	ws.send(PayloadRequest);

}

function david(stationId){
	console.log('stationId: ' + stationId);
	var PayloadRequest = JSON.stringify({"tipo": "ReserveNow", "stationId": stationId});
	ws.send(PayloadRequest);
	
}

function buttons_reserveNow(stationId){
	ocultar_bloques();
	var currentDate = new Date();
	document.getElementById('ventana_reserva').style.display="block";
	document.getElementById('fecha_reserva').value=currentDate.toISOString().slice(0,10);
}

function reserveNow(stationId){
	
	//"connectorId": 1,"expiryDate":"2022-02-28T11:10:00.000Z","idTag":"7240E49A","reservationId":100

	var hora_res=document.getElementById('hora_reserva').value;
	var fecha_res=document.getElementById('fecha_reserva').value;
	var conector_res=parseInt(document.getElementById('conector_reserva').value);
	var id_res=document.getElementById('id_reserva').value;
	var expiracion=fecha_res+"T"+hora_res+":00.000Z";

	console.log('hora reserva')
	console.log(hora_res)
	console.log('fecha reserva')
	console.log(fecha_res)
	console.log('conector reserva')
	console.log(conector_res)
	console.log('id reserva')
	console.log(id_res)

	console.log(expiracion)

	//var PayloadRequest = {"tipo": "ReserveNow", "stationId": stationId, "connectorId":conector_res, "expiryDate":expiracion, "idTag":id_res, "reservationId":100};
	var PayloadRequest = JSON.stringify({"tipo": "ReserveNow", "stationId": stationId, "connectorId":conector_res, "expiryDate":expiracion, "idTag":id_res, "reservationId":100});
	ws.send(PayloadRequest);

}

function buttons_changeConfiguration(){
	document.getElementById("ventana_cambiarconfiguracion").style.display="block";

	//document.getElementById("box_AllowOfflineTxForUnknownId").value='false'


}

function prueba_boton(){
	document.getElementById("box_AllowOfflineTxForUnknownId").value='false'

}

function ocultar_bloques(){
	document.getElementById("ventana_cambiarconfiguracion").style.display="none";
	document.getElementById("ventana_desbloqueo").style.display="none";
	document.getElementById("ventana_disponibilidad").style.display="none";
	document.getElementById('ventana_reserva').style.display="none";
	document.getElementById('ventana_reset').style.display="none";
	document.getElementById("ventana_startremote").style.display="none";

}


function xhr(){
	console.log('se llama a xhr')
	const url = '/home/estaciones/urlprueba';
	http.open("get", url);
	http.send();

	http.onreadystatechange=(e)=>{
		console.log('Respuesta desde el server: ' + http.responseText);
	}
}


function fromStationsToRealTime(){
	document.getElementById('').style.display = 'none';
	document.getElementById('').style.display = 'block';
}
/******************************************************************************
function toStationDetails(id){

	ocultar_bloques();
	//document.getElementById("ventana_disponibilidad").style.display="none";
	//document.getElementById('ventana_reserva').style.display="none";

	console.log('datos estacion: ');
	const url = '/home/estaciones/editar/'+id;
	http.open("get", url);
	http.send();

	http.onreadystatechange=(e)=>{
		var a = 1;
		//console.log('Respuesta desde el server: ' + http.responseText);
	}
	document.getElementById('stationDetails').style.display = 'block';
	document.getElementById('stationsDetails').style.display = 'none';
}

/******************************************************************************/
function toStationsDetails(){
	document.getElementById('stationDetails').style.display = 'none';
	document.getElementById('stationsDetails').style.display = 'block';
}
function toStationEdit(){
	document.getElementById('stationEdit').style.display = 'block';
	document.getElementById('stationDetails').style.display = 'none';
}

function sendFirstWsResponse(){
	document.getElementById('acceptWsHandshake');
	var storedAcceptKey = localStorage.getItem("acceptKey");
	var storedProtocol = localStorage.getItem("protocol");
	console.log('Si llega hasta aca: '); 
	console.log(storedAcceptKey);
	console.log(storedProtocol);
	console.log('Se va a aceptar la conexion:');
	const jsons = JSON.stringify({"tipo": "acceptWsHandshake", 
	'text':'conexion aceptada', 'message':'Esto es mensaje',
	'acceptKey': storedAcceptKey, 'protocol': storedProtocol});
	ws.send(jsons);
}

/************************************************************************
function setPageAddStation(){
	console.log('set page add station')
	document.getElementById('pageAddStation').style.display = 'block';
	document.getElementById('stationsDetails').style.display = 'none';
}

/************************************************************************/
function fromAddToDetailsStations(){
	console.log('ir a pagina detalles estaciones')
	document.getElementById('pageAddStation').style.display = 'none';
	document.getElementById('stationsDetails').style.display = 'block';
}
function fromAdd2ToAdd1(){
	console.log('Pagina 1 add')
	document.getElementById('addStation1').style.display = 'block';
	document.getElementById('addStation2').style.display = 'none';
}

function addStation1(){
	var stationCode = document.getElementById("stationCode");
	var stationName = document.getElementById("stationName");
	var connectorNumber = document.getElementById("connectorNumber");
	//if(stationCode.value==="" || stationName.value==="" || connectorNumber.value===""){
		//alert('Debe llenar todos los campos para poder continuar')
	//}else{
		localStorage.setItem("stationCode", stationCode.value);
		localStorage.setItem("stationName", stationName.value);
		localStorage.setItem("connectorNumber", connectorNumber.value);
		document.getElementById("addStation1").style.display = "none";
		document.getElementById("addStation2").style.display = "block";
		console.log('Se ha dado click al boton siguiente');
	//}
}

function setFirstWS(){
	console.log('Primer ws')
	document.getElementById('waitingHS').style.display="block";
}

function addStation2(){
	console.log('Entra a addStation2');
}

function seeAntValues(){
	var storedValueCode = localStorage.getItem("stationCode");
	var storedValueName = localStorage.getItem("stationName");
	var storedValueConnector = localStorage.getItem("connectorNumber");
	console.log('Valores almacenados');
	console.log(storedValueCode);
	console.log(storedValueName);
	console.log(storedValueConnector);
}