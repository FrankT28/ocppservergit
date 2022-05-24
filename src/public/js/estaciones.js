	angular.module("pages.estaciones", [])
	.controller("estacionesController", ['$scope', '$http', 
		function estacionesController($scope, $http){
		//NO BORRAR ESTA LINEA, NO SE QUE HACE PERO SIRVE PARA NO DESCUADRAR LOS HTML.
		$scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l2';
		/*=========================================================================*/
		//INICIALIZACION DE VARIABLES
		console.log('se ha llamado a estaciones js');
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
			console.log('Esto es paginas:' );
			console.log(paginas)
			return paginas;
		}
		/*=========================================================================*/
		estaciones();
		function estaciones(){
			console.log('Se llama a la funciona pedir datos')
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
			$scope.verFormAgregarEstacion = true;
			$scope.verEstaciones = false;
		}
		/*=========================================================================*/
		$scope.editarEstacion = function(estacion){
			$scope.formEstacion = estacion;
			$scope.accion = 'Editar Estación';
			$scope.accionPost = 'editar';
			$scope.verFormEditarEstacion = true;
			$scope.verEstacion = false;
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
			$scope.estacion = estacion;
			$scope.verEstaciones = false;
			$scope.verEstacion = true;
		}
		/*=========================================================================*/
		$scope.agregarAestaciones = function(){
			console.log('Se llama volver estaciones')
			$scope.verEstacion = false;
			$scope.verFormAgregarEstacion = false;
			$scope.verEstaciones = true;
		}
		/*=========================================================================*/
		$scope.editarAestacion = function(){
			console.log('Se llama volver estaciones')
			$scope.verEstacion = true;
			$scope.verFormEditarEstacion = false;
			$scope.verEstaciones = false;
		}
		/*=========================================================================*/
		$scope.alertEliminarEstacion = function(id_estacion){
			console.log('id de la estacion: ' + id_estacion);
			var deleteStation = confirm('Esta seguro que desea eliminar los datos de la estación?');
			if(deleteStation){
				$http.get('/home/estaciones/eliminar/' + id_estacion)
				.success(function(data){
					if(data.success){
						console.log('Se ha eliminado la estacion exitosamente');
						estaciones();
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
			console.log('form Estacion antes de enviar: ' + accion);
			console.log($scope.formEstacion);
			$http({
				method: 'POST',
				url: '/home/estaciones/' + accion + '/',
				data: parametrar($scope.formEstacion),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data){
				console.log('respuesta de estaciones agregar');
				console.log(data);
				$scope.verEstaciones = true;
				$scope.verFormAgregarEstacion = false;
				$scope.successMessage = data.message
				estaciones();
			}).error(function(data){
				console.log('Error HTTP')
			})
		}
		/*=========================================================================*/
		$scope.transacciones = {};
			$scope.listarTransacciones = function(id_estacion, pagina){
			console.log('Se llama a ver transacciones')
			let desde = pagina*$scope.transaccionesPorPagina;
			let cuantos = $scope.transaccionesPorPagina;
			$http.get('/home/estaciones/transacciones/' + id_estacion + '/' + desde + '/' + cuantos + '/')
			.success(function(data){
				if(data.success){
					$scope.transacciones = data.transacciones;
					$scope.totalTransacciones = data.total;
					$scope.paginasTransacciones = paginacion($scope.totalTransacciones)
					console.log('Dato de las transacciones de la estacion');
					console.log($scope.transacciones);
					$scope.verEstacion = false;
					$scope.verTransacciones = true;
				}else{
					console.log('No hay data success')
				}
			})
		}
		/*=========================================================================*/
		$scope.volverDetallesEstacion = function(){
			console.log('Se llama ')
			$scope.verTransacciones = false;
			$scope.verEstacion = true;
		}
		/*=========================================================================*/
		}
	]
)
	