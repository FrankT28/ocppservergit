	angular.module("pages.estaciones", [])
	.controller("estacionesController", ['$scope', '$http', 
		function estacionesController($scope, $http){
		//NO BORRAR ESTA LINEA, NO SE QUE HACE PERO SIRVE PARA NO DESCUADRAR LOS HTML.
		$scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l2';
		/*=========================================================================*/
		//INICIALIZACION DE VARIABLES
		$scope.formEstacion = {};
		$scope.verEstaciones = true;
		$scope.verEstacion = false;
		$scope.verFormAgregarEstacion = false;
		$scope.verFormEditarEstacion = false;
		$scope.estacionesPorPagina = 10;
		$scope.transaccionesPorPagina = 10;
		/*=========================================================================*/
		function paginacion(total){
			var paginas = [];
			for (var i=0; i<=total/$scope.estacionesPorPagina; i++){
				paginas.push(i);
			}
			return paginas;
		}
		/*=========================================================================*/
		estaciones();
		function estaciones(){ 
			$http.get('/home/estaciones/informacion/')
			.success(function(data){
				$scope.estaciones = data.estaciones;
				$scope.totalEstaciones = data.totalEstaciones;
				$scope.verFormEditarEstacion = false;
				$scope.verFormAgregarEstacion = false;
			})
		}
		/*=========================================================================*/
		$scope.agregarEstacion = function(){
			$scope.accion = 'Nueva Estación';
			$scope.accionPost = 'agregar';
			$scope.formEstacion = {};	
			$scope.formEstacion.conectores = [];
			$scope.conector = {};	
			$scope.verFormAgregarEstacion = true;
			$scope.verEstaciones = false;
		}
		/*=========================================================================*/
		$scope.editarEstacion = function(estacion){
			$scope.formEstacion = estacion;
			$scope.accion = 'Editar Estación';
			$scope.accionPost = 'editar';
			$scope.verFormEditarEstacion = true;
			$scope.verEstacion = true;
		}
		/*=========================================================================*/
		$scope.verEstacion = function(){
			$scope.verFormAgregarEstacion = false;
			$scope.verEstacion = true;
			$scope.verFormEditarEstacion = false;
			$scope.verEstaciones = false;
		}
		/*=========================================================================*/
		$scope.detallesEstacion = function(estacion){
			console.log('estacion');
			console.log(estacion);
			$scope.estacion = estacion;
			$scope.verEstaciones = false;
			$scope.verEstacion = true;
		}
		/*=========================================================================*/
		$scope.agregarAestaciones = function(){
			$scope.verEstacion = false;
			$scope.verFormAgregarEstacion = false;
			$scope.verEstaciones = true;
		}
		/*=========================================================================*/
		$scope.editarAestacion = function(){
			$scope.verEstacion = true;
			$scope.verFormEditarEstacion = false;
			$scope.verEstaciones = false;
		}
		/*=========================================================================*/
		listarTiposConectores();
		function listarTiposConectores(){
			$http.get('/home/estaciones/listar_tipos_conectores/')
			.success(function(data){
				if(data.success){
					$scope.tiposConectores = data.tiposConectores;
				}
			})
		}
		/*=========================================================================*/
		$scope.agregarConectorEstacion = function(){
			console.log('$scope.conector');
			console.log($scope.conector);
			$scope.formEstacion.conectores.push($scope.conector);
			console.log('conectores form');
			console.log($scope.formEstacion.conectores);
			$scope.conector = {};
		}
		/*=========================================================================*/
		$scope.alertEliminarEstacion = function(id_estacion){
			var deleteStation = confirm('Esta seguro que desea eliminar los datos de la estación?');
			if(deleteStation){
				$http.get('/home/estaciones/eliminar/' + id_estacion)
				.success(function(data){
					if(data.success){
						estaciones();
					}else{
					}
				})
			}else{
			}
		}
		
		/*=========================================================================*/
		function parametrar(obj) {
			var p = [];
			for (var key in obj) {
				p.push(key + '=' + encodeURIComponent(obj[key]));
			}
			return p.join('&');
		};
		/*=========================================================================*/
		$scope.mostrarCoreOperations = 'SI';
		$scope.cambiarOCPPOperations = function(id){
			if(id==1){
				$scope.mostrarCoreOperations = 'SI';
				$scope.mostrarSmartChargingOperations = 'NO';
				$scope.mostrarLocalListOperations = 'NO';
			} else if(id==2){
				$scope.mostrarCoreOperations = 'NO';
				$scope.mostrarSmartChargingOperations = 'SI';
				$scope.mostrarLocalListOperations = 'NO';
			} else if(id==3){
				$scope.mostrarCoreOperations = 'NO';
				$scope.mostrarSmartChargingOperations = 'NO';
				$scope.mostrarLocalListOperations = 'SI';
			}
		}
		/*=========================================================================*/
		$scope.buildOcppMessage = function(operation){
			console.log('build odpp message');
			console.log(operation);
			$scope.formMessageOcpp = {};
			$scope.formMessageOcppJson = {};
			$scope.operation = operation;
			//let stationId = $scope.estacion.id_estacion;
			if(operation=='SetChargingProfile'){
				$scope.SetChargingProfileMessage();
				//$scope.formMessageOcpp = JSON.stringify({"tipo": "SetChargingProfile", "stationId": stationId});
			}else if(operation=='ClearChargingProfile'){
				$scope.ClearChargingProfileMessage();
			}else if(operation=='GetCompositeSchedule'){
				$scope.GetCompositeScheduleMessage();
			}else if(operation=='GetLocalListVersion'){
				$scope.GetLocalListVersionMessage();
			}else if(operation=='SendLocalList'){
				$scope.SendLocalListMessage();
			}
		}
		/*=========================================================================*/
		$scope.SetChargingProfileMessage = function(){
			$scope.formMessageOcppJson.texto = {
				"connectorId": 1,
				"csChargingProfiles": {
					"chargingProfileId": 2,
					//"transactionId": 1,
					"stackLevel": 1,
					"chargingProfilePurpose": "TxDefaultProfile",
					"chargingProfileKind": "Relative",
					//"recurrencyKind": "Daily",
					//"validFrom": '2022-03-06T17:10:00.000Z',
					//"validTo": '2022-03-16T17:20:00.000Z',
					"chargingSchedule": {
						//"duration": 100,
						//"startSchedule": '2022-03-6T10:00:00.000Z',
						"chargingRateUnit": "A",
						"chargingSchedulePeriod": [
							{"startPeriod": 0, 
							 "limit": 10, 
							"numberPhases": 3},
							//{"startPeriod": 1, "limit": 2, "numberPhases": 3}
						],
						"minChargingRate": 6
					}
				}
			}
			$scope.formMessageOcpp.texto = JSON.stringify($scope.formMessageOcppJson.texto);
		}
		/*=========================================================================*/
		$scope.ClearChargingProfileMessage = function(){
			$scope.formMessageOcppJson.texto = {
				"id": 1,
				"connectorId": 1,
				"chargingProfilePurpose": "TxDefault",
				"stackLevel": 1
			}
			$scope.formMessageOcpp.texto = JSON.stringify($scope.formMessageOcppJson.texto);
		}
		/*=========================================================================*/
		$scope.GetCompositeScheduleMessage = function(){
			$scope.formMessageOcppJson.texto = {
				"connectorId": 1, 
				"duration": 0,
				'chargingRateUnit': 'A'
			}
			$scope.formMessageOcpp.texto = JSON.stringify($scope.formMessageOcppJson.texto);
		}
		/*=========================================================================*/
		$scope.GetLocalListVersionMessage = function(){
			$scope.formMessageOcppJson.texto = {}
			$scope.formMessageOcpp.texto = JSON.stringify($scope.formMessageOcppJson.texto);
		}
		/*=========================================================================*/
		$scope.SendLocalListMessage = function(){
			$scope.formMessageOcppJson.texto = {
				"listVersion": 1,
				"localAuthorizationList": [
					{
						"idTag": "7240E49A",
						"idTagInfo": 
							{
								"expiryDate": "2022-02-29T11:10:00.000Z",
								"status": "Accepted"
							}
					}
				],
				"updateType": "Differential"
			}
			$scope.formMessageOcpp.texto = JSON.stringify($scope.formMessageOcppJson.texto);
		}
		/*=========================================================================*/
		$scope.setConector = function(id_conector){
			if($scope.operation=='SetChargingProfile' || $scope.operation=='GetCompositeSchedule'){
				$scope.formMessageOcppJson.texto.connectorId = id_conector;
			}else if($scope.operation=='ClearChargingProfile'){
				$scope.formMessageOcppJson.texto.connectorId = id_conector;
			}
			// else if($scope.operation=='GetLocalListVersion'){
			// 	$scope.formMessageOcppJson.texto.connectorId = id_conector;
			// }
			$scope.formMessageOcpp.texto = JSON.stringify($scope.formMessageOcppJson.texto);
			console.log($scope.formMessageOcppJson);
		}
		/*=========================================================================*/
		$scope.sendOcppMessage = function(){ 
			console.log('$scope.formMessageOcpp antes de enviar por ws');
			$scope.formMessageOcpp.tipo = $scope.operation;
			$scope.formMessageOcpp.stationId = $scope.estacion.id_estacion;
			$scope.formMessageOcpp.texto = JSON.parse($scope.formMessageOcpp.texto);
			console.log($scope.formMessageOcpp); 
			ws.send(JSON.stringify($scope.formMessageOcpp));
		}
		/*=========================================================================*/
		ws.addEventListener('message', event => {
			let message = event.data;
			console.log('Mensaje desde el servidor:', message);
			try {
				var parsedMessage = JSON.parse(message);
			} catch (error) {
				console.error('No se pudo parsear a JSON el mensaje');
			}
			document.getElementById('responseFromStation').innerHTML = parsedMessage.texto;
		});
		// $scope.responseFromStation = rfs;
		// console.log('$scope.responseFromStation');
		// console.log($scope.responseFromStation);
		/*=========================================================================*/
		$scope.enviar = function(accion, id){
			if($scope.accionPost=='editar'){
				accion = accion + '/' + id;
			}
			console.log('$scope.formEstacion');
			console.log($scope.formEstacion);
			$http({
				method: 'POST',
				url: '/home/estaciones/' + accion + '/',
				data: $.param($scope.formEstacion),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data){
				$scope.verEstaciones = true;
				$scope.verFormAgregarEstacion = false;
				$scope.successMessage = data.message
				estaciones();
			}).error(function(data){
			})
		}
		/*=========================================================================*/
		$scope.transacciones = {};
			$scope.listarTransacciones = function(id_estacion, pagina){
			let desde = pagina*$scope.transaccionesPorPagina;
			let cuantos = $scope.transaccionesPorPagina;
			$http.get('/home/estaciones/transacciones/' + id_estacion + '/' + desde + '/' + cuantos + '/')
			.success(function(data){
				if(data.success){
					$scope.transacciones = data.transacciones;
					$scope.totalTransacciones = data.total;
					$scope.paginasTransacciones = paginacion($scope.totalTransacciones)
					$scope.verEstacion = true;
					$scope.verTransacciones = true;
				}else{
				}
			})
		}
		/*=========================================================================*/
		$scope.volverDetallesEstacion = function(){
			$scope.verTransacciones = false;
			$scope.verEstacion = true;
		}
		/*=========================================================================*/
		}
	]
)
	