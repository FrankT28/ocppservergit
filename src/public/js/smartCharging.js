	angular.module("pages.smartCharging", [])
	.controller("smartChargingController", ['$scope', '$http', 
		function smartChargingController($scope, $http){
		//NO BORRAR ESTA LINEA, NO SE QUE HACE PERO SIRVE PARA NO DESCUADRAR LOS HTML.
		$scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l2';
		/*=========================================================================*/
		//INICIALIZACION DE VARIABLES
		console.log('se ha llamado a smartCharging js');
		$scope.formReservacion = {};
		$scope.versmartCharging = true;
		$scope.verReservacion = false;
		$scope.verFormAgregarReservacion = false;
		$scope.verFormEditarReservacion = false;
		$scope.smartChargingPorPagina = 10;
		$scope.transaccionesPorPagina = 10;
		/*=========================================================================*/
		function paginacion(total){
			var paginas = [];
			for (var i=0; i<=total/$scope.smartChargingPorPagina; i++){
				paginas.push(i);
			}
			console.log('Esto es paginas:' );
			console.log(paginas)
			return paginas;
		}
		/*=========================================================================*/
		smartCharging();
		function smartCharging(){
			console.log('Se llama a la funciona pedir datos')
			$http.get('/home/smartCharging/informacion/')
			.success(function(data){
				$scope.smartCharging = data.smartCharging;
				$scope.lastReservationId = data.lastReservationId;
				$scope.totalsmartCharging = data.totalsmartCharging;
				$scope.verFormEditarReservacion = false;
				$scope.verFormAgregarReservacion = false;
			})
		}
		/*=========================================================================*/
		$scope.agregarReservacion = function(){
			$scope.accion = 'Nueva Estación';
			$scope.accionPost = 'agregar';
			$scope.formReservacion = {};	
			$scope.verFormAgregarReservacion = true;
			console.log('agregar reservacion');
			$scope.versmartCharging = false;
		}
		/*=========================================================================*/
		$scope.editarReservacion = function(Reservacion){
			console.log('Se llama editar Reservacion')
			$scope.formReservacion = Reservacion;
			$scope.accion = 'Editar Estación';
			$scope.accionPost = 'editar';
			$scope.verFormEditarReservacion = true;
			$scope.verReservacion = true;
		}
		/*=========================================================================*/
		$scope.verReservacion = function(){
			$scope.verFormAgregarReservacion = false;
			$scope.verReservacion = true;
			$scope.verFormEditarReservacion = false;
			$scope.versmartCharging = false;
		}
		/*=========================================================================*/
		$scope.detallesReservacion = function(Reservacion){
			$scope.Reservacion = Reservacion;
			$scope.versmartCharging = false;
			$scope.verReservacion = true;
		}
		/*=========================================================================*/
		$scope.agregarAsmartCharging = function(){
			console.log('Se llama volver smartCharging')
			$scope.verReservacion = false;
			$scope.verFormAgregarReservacion = false;
			$scope.versmartCharging = true;
		}
		/*=========================================================================*/
		$scope.editarAReservacion = function(){
			console.log('Se llama volver smartCharging')
			$scope.verReservacion = true;
			$scope.verFormEditarReservacion = false;
			$scope.versmartCharging = false;
		}
		/*=========================================================================*/
		$scope.alertEliminarReservacion = function(id_reservacion){
			console.log('id de la Reservacion: ' + id_reservacion);
			var deleteStation = confirm('Esta seguro que desea eliminar los datos de la reservackón?');
			if(deleteStation){
				$http.get('/home/smartCharging/eliminar/' + id_reservacion)
				.success(function(data){
					if(data.success){
						console.log('Se ha eliminado la Reservacion exitosamente');
						smartCharging();
					}else{
						console.log('Algo salio mal')
					}
				})
			}else{
				console.log('Se eligio no eliminar')
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
        function fechaMysql(fecha){
            let [ month, day, year] = fecha.split('/');
            let result = [year, month, day].join('-');
            return result;
        }
		/*=========================================================================*/
		$scope.enviar = function(accion, id){
			if($scope.accionPost=='editar'){accion = accion + '/' + id;}
			let fechas = $scope.formReservacion.periodo.split(' - ');
			let expira = fechas[1].split(' ');
			let fechaExpira = expira[0].replace('/','-');
			let horaExpira = expira[1];
			let am_pm = expira[2];
			if(am_pm=='PM'){
				let horaMinuto = horaExpira.split(':')
				let soloHora = parseInt(horaMinuto[0]) 
				soloHora +=12;
				horaExpira = soloHora.toString() + ':' + horaMinuto[1]
			}
			$scope.formReservacion.expiryDate = fechaMysql(fechaExpira) + "T" + horaExpira + ":00";
			$scope.formReservacion.stationId = parseInt($scope.formReservacion.stationId);
			$scope.formReservacion.connectorId = parseInt($scope.formReservacion.connectorId);
			$scope.formReservacion.tipo = 'ReserveNow';
			$scope.formReservacion.reservationId = $scope.lastReservationId;
			let ocppMessage = JSON.stringify($scope.formReservacion);
			console.log('ocppMessage');
			console.log(ocppMessage);
			ws.send(ocppMessage);
			// $http({
			// 	method: 'POST',
			// 	url: '/home/smartCharging/' + accion + '/',
			// 	data: $.param($scope.formReservacion),
			// 	headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			// }).success(function(data){
			// 	console.log('respuesta de smartCharging agregar');
			// 	console.log(data);
			// 	$scope.versmartCharging = true;
			// 	$scope.verFormAgregarReservacion = false;
			// 	$scope.successMessage = data.message
			// 	smartCharging();
			// })
		}
		/*=========================================================================*/
		$scope.transacciones = {};
			$scope.listarTransacciones = function(id_reservacion, pagina){
			console.log('Se llama a ver transacciones')
			let desde = pagina*$scope.transaccionesPorPagina;
			let cuantos = $scope.transaccionesPorPagina;
			$http.get('/home/smartCharging/transacciones/' + id_reservacion + '/' + desde + '/' + cuantos + '/')
			.success(function(data){
				if(data.success){
					$scope.transacciones = data.transacciones;
					$scope.totalTransacciones = data.total;
					$scope.paginasTransacciones = paginacion($scope.totalTransacciones)
					console.log('Dato de las transacciones de la Reservacion');
					console.log($scope.transacciones);
					$scope.verReservacion = true;
					$scope.verTransacciones = true;
				}else{
					console.log('No hay data success')
				}
			})
		}
		/*=========================================================================*/
		$scope.volverDetallesReservacion = function(){
			console.log('Se llama ')
			$scope.verTransacciones = false;
			$scope.verReservacion = true;
		}
		/*=========================================================================*/
		tarjetas(0);
		function tarjetas(){
			$http.get('/home/smartCharging/tarjetas/')
			.success(function(data){
				console.log('data informacion tarjetas: ');
				console.log(data);
				$scope.tarjetas = data.tarjetas;
			})
		}
		/*=========================================================================*/
		estaciones(0);
		function estaciones(){
			$http.get('/home/smartCharging/estaciones/')
			.success(function(data){
				console.log('data informacion estaciones: ');
				console.log(data);
				$scope.estaciones = data.estaciones;
			})
		}
		/*=========================================================================*/
		$scope.setConectores = function(stationId){
			console.log('set conetores');
			console.log(stationId);
			for(var i=0; i<$scope.estaciones.length; i++){
				if($scope.estaciones[i].id_estacion == stationId){
					$scope.conectoresEstacion = $scope.estaciones[i].conectores;
				}
			}
		}
		/*=========================================================================*/
		/*=========================================================================*/
		}
	]
)
	