	angular.module("pages.transacciones", ['ui.bootstrap'])
	.controller("transaccionesController", ['$scope', '$http', 
		function transaccionesController($scope, $http){
		//NO BORRAR ESTA LINEA, NO SE QUE HACE PERO SIRVE PARA NO DESCUADRAR LOS HTML.
		$scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l2';
		/*=========================================================================*/
		//INICIALIZACION DE VARIABLES
		console.log('se ha llamado a transacciones js');
		$scope.formTransaccion = {};
		$scope.verTransacciones = true;
		$scope.verTransaccion = false;
		$scope.verFormAgregarTransaccion = false;
		$scope.verFormEditarTransaccion = false;
		$scope.transaccionesPorPagina = 10;
		/*=========================================================================*/
		function paginacion(total){
			console.log('total: ' + total)
			var paginas = [];
			for (var i=0; i<=total/$scope.transaccionesPorPagina; i++){
				paginas.push(i);
			}
			console.log('Esto es paginas:' );
			console.log(paginas)
			return paginas;
		}
		/*=========================================================================*/
		$scope.agregarTransaccion = function(){
			$scope.accion = 'Nuevo Transaccion';
			$scope.accionPost = 'agregar';
			$scope.formTransaccion = {};	
			$scope.verFormAgregarTransaccion = true;
			$scope.verTransacciones = false;
		}
		/*=========================================================================*/
		$scope.editarTransaccion = function(transaccion){
			$scope.formTransaccion = transaccion;
			$scope.accion = 'Editar Transaccion';
			$scope.accionPost = 'editar';
			$scope.verFormEditarTransaccion = true;
			//$scope.verTransaccion = false;
		}
		/*=========================================================================*/
		$scope.verTransaccion = function(){
			$scope.verFormAgregarTransaccion = false;
			$scope.verTransaccion = true;
			$scope.verFormEditarTransaccion = false;
			$scope.verTransacciones = false;
		}
		/*=========================================================================*/
		$scope.detallesTransaccion = function(transaccion){
			$scope.transaccion = transaccion;
			$scope.verTransacciones = false;
			$scope.verTransaccion = true;
		}
		/*=========================================================================*/
		$scope.agregarAtransacciones = function(){
			console.log('Se llama volver transacciones')
			$scope.verTransaccion = false;
			$scope.verFormAgregarTransaccion = false;
			$scope.verTransacciones = true;
		}
		/*=========================================================================*/
		$scope.editarATransaccion = function(){
			console.log('Se llama volver transacciones')
			$scope.verTransaccion = true;
			$scope.verFormEditarTransaccion = false;
			$scope.verTransacciones = false;
		}
		/*=========================================================================*/
		$scope.alertEliminarTransaccion = function(id_transaccion){
			console.log('id de la Transaccion: ' + id_transaccion);
			var deleteTransaccion = confirm('Esta seguro que desea eliminar los datos de la estación?');
			if(deleteTransaccion){
				$http.get('/home/transacciones/eliminar/' + id_transaccion)
				.success(function(data){
					if(data.success){
						console.log('Se ha eliminado la Transaccion exitosamente');
						transacciones();
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
			console.log('Esto es id: ' + id)
			if($scope.accionPost=='editar'){
				accion = accion + '/' + id;
			}
			console.log('form Transaccion antes de enviar: ' + accion);
			console.log($scope.formTransaccion);
			$http({
				method: 'POST',
				url: '/home/transacciones/' + accion + '/',
				data: parametrar($scope.formTransaccion),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data){
				console.log('respuesta de transacciones agregar');
				console.log(data);
				$scope.verTransacciones = true;
				$scope.verFormAgregarTransaccion = false;
				$scope.successMessage = data.message
				transacciones();
			}).error(function(data){
				console.log('Error HTTP')
			})
		}
		/*=========================================================================*/
		$scope.transacciones = {};
		$scope.listarTransacciones = function(pagina){
			console.log('Se llama a ver transacciones')
			let desde = pagina*$scope.transaccionesPorPagina;
			let cuantos = $scope.transaccionesPorPagina;
			$http.get('/home/transacciones/informacion/' + desde + '/' + cuantos + '/')
			.success(function(data){
				if(data.success){
					$scope.transacciones = data.transacciones;
					$scope.totalTransacciones = data.totalTransacciones;
					$scope.paginasTransacciones = paginacion($scope.totalTransacciones)
					$scope.verTransaccion = false;
					$scope.verTransacciones = true;
				}else{
					console.log('No hay data success')
				}
			})
		}
		$scope.listarTransacciones(0); //PRIMERO SE DECLARA Y LUEGO SE LLAMA
		/*=========================================================================*/
		$scope.volverDetallesTransaccion = function(){
			console.log('Se llama ')
			$scope.verTransacciones = false;
			$scope.verTransaccion = true;
		}
		/*=========================================================================*
		tarjetas()
		function tarjetas(){
			$http.get('/home/transacciones/tarjetas/')
			.success(function(data){
				if(data.success){
					$scope.tarjetas = data.tarjetas;
					//$scope.totalTransacciones = data.total;
					//$scope.paginasTransacciones = paginacion($scope.totalTransacciones)
					console.log('Dato de las transacciones de la Transaccion');
					console.log($scope.tarjetas);
				}else{
					console.log('No hay datos de tarjetas')
				}
			})
		}
		/*=========================================================================*/
		$scope.seleccionarTarjeta = function(){
			console.log('Se llamo a la funcion seleccionarTarjeta')
		}
		/*=========================================================================*/
		$scope.botonAsignarTarjeta = false;
		$scope.activarAsignar = function(){
			console.log('activar asignar');
			$scope.botonAsignarTarjeta = true;
		}
		/*=========================================================================*/
		$scope.asignarTarjeta = function(id_Transaccion, id_tarjeta){
			console.log('tarjeta y Transaccion: ');
			console.log(id_tarjeta);
			console.log(id_Transaccion);
			$http.get('/home/transacciones/asignar_tarjeta/' + id_Transaccion + '/' + id_tarjeta + '/')
			.success(function(data){
				console.log('respuesta de transacciones agregar');
				console.log(data);
				$scope.successMessage = data.message
				$scope.Transaccion.tarjetas = data.tarjetas
				$scope.botonAsignarTarjeta = false;
				$scope.tarjetaSeleccionada = '';
				tarjetas();
			}).error(function(data){
				console.log('Error HTTP')
			})
		}
		/*=========================================================================*
		$scope.desvincularTarjeta = function(id_Transaccion, id_tarjeta){
			var val = prompt('Ingrese la contrasena de administrador: ');
			if(val=='123'){
				$http.get('/home/transacciones/desvincular_tarjeta/' + id_Transaccion + '/' + id_tarjeta + '/')
				.success(function(data){
					console.log('respuesta de transacciones desvincular');
					console.log(data);
					$scope.successMessage = data.message
					$scope.Transaccion.tarjetas = data.tarjetas
					$scope.botonAsignarTarjeta = false;
					$scope.tarjetaSeleccionada = '';
					tarjetas()
				}).error(function(data){
					console.log('Error HTTP')
				})
			}else{
				alert('Contrasena incorrecta!')
			}
		}
		/*=========================================================================*/
		}
	]
)
