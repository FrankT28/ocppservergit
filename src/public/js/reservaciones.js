	angular.module("pages.reservaciones", [])
	.controller("reservacionesController", ['$scope', '$http', 
		function reservacionesController($scope, $http){
		//NO BORRAR ESTA LINEA, NO SE QUE HACE PERO SIRVE PARA NO DESCUADRAR LOS HTML.
		$scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l2';
		/*=========================================================================*/
		//INICIALIZACION DE VARIABLES
		console.log('se ha llamado a reservaciones js');
		$scope.formReservacion = {};
		$scope.verreservaciones = true;
		$scope.verReservacion = false;
		$scope.verFormAgregarReservacion = false;
		$scope.verFormEditarReservacion = false;
		$scope.reservacionesPorPagina = 10;
		$scope.transaccionesPorPagina = 10;
		/*=========================================================================*/
		function paginacion(total){
			var paginas = [];
			for (var i=0; i<=total/$scope.reservacionesPorPagina; i++){
				paginas.push(i);
			}
			console.log('Esto es paginas:' );
			console.log(paginas)
			return paginas;
		}
		/*=========================================================================*/
		reservaciones();
		function reservaciones(){
			console.log('Se llama a la funciona pedir datos')
			$http.get('/home/reservaciones/informacion/')
			.success(function(data){
				$scope.reservaciones = data.reservaciones;
				$scope.totalreservaciones = data.totalreservaciones;
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
			//$scope.verreservaciones = false;
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
			$scope.verreservaciones = false;
		}
		/*=========================================================================*/
		$scope.detallesReservacion = function(Reservacion){
			$scope.Reservacion = Reservacion;
			$scope.verreservaciones = false;
			$scope.verReservacion = true;
		}
		/*=========================================================================*/
		$scope.agregarAreservaciones = function(){
			console.log('Se llama volver reservaciones')
			$scope.verReservacion = false;
			$scope.verFormAgregarReservacion = false;
			$scope.verreservaciones = true;
		}
		/*=========================================================================*/
		$scope.editarAReservacion = function(){
			console.log('Se llama volver reservaciones')
			$scope.verReservacion = true;
			$scope.verFormEditarReservacion = false;
			$scope.verreservaciones = false;
		}
		/*=========================================================================*/
		$scope.alertEliminarReservacion = function(id_Reservacion){
			console.log('id de la Reservacion: ' + id_Reservacion);
			var deleteStation = confirm('Esta seguro que desea eliminar los datos de la estación?');
			if(deleteStation){
				$http.get('/home/reservaciones/eliminar/' + id_Reservacion)
				.success(function(data){
					if(data.success){
						console.log('Se ha eliminado la Reservacion exitosamente');
						reservaciones();
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
		$scope.enviar = function(accion, id){
			if($scope.accionPost=='editar'){
				accion = accion + '/' + id;
			}
			console.log('form Reservacion antes de enviar: ' + accion);
			console.log($scope.formReservacion);
			$http({
				method: 'POST',
				url: '/home/reservaciones/' + accion + '/',
				data: parametrar($scope.formReservacion),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data){
				console.log('respuesta de reservaciones agregar');
				console.log(data);
				$scope.verreservaciones = true;
				$scope.verFormAgregarReservacion = false;
				$scope.successMessage = data.message
				reservaciones();
			}).error(function(data){
				console.log('Error HTTP')
			})
		}
		/*=========================================================================*/
		$scope.transacciones = {};
			$scope.listarTransacciones = function(id_Reservacion, pagina){
			console.log('Se llama a ver transacciones')
			let desde = pagina*$scope.transaccionesPorPagina;
			let cuantos = $scope.transaccionesPorPagina;
			$http.get('/home/reservaciones/transacciones/' + id_Reservacion + '/' + desde + '/' + cuantos + '/')
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
		}
	]
)
	