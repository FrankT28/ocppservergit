	angular.module("pages.clientes", ['ui.bootstrap'])
	.controller("clientesController", ['$scope', '$http', 
		function clientesController($scope, $http){
		//NO BORRAR ESTA LINEA, NO SE QUE HACE PERO SIRVE PARA NO DESCUADRAR LOS HTML.
		$scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l2';
		/*=========================================================================*/
		//INICIALIZACION DE VARIABLES
		console.log('se ha llamado a clientes js');
		$scope.formCliente = {};
		$scope.verClientes = true;
		$scope.verCliente = false;
		$scope.verFormAgregarCliente = false;
		$scope.verFormEditarCliente = false;
		$scope.clientesPorPagina = 10;
		$scope.transaccionesPorPagina = 10;
		/*=========================================================================*/
		function paginacion(total){
			var paginas = [];
			for (var i=0; i<=total/$scope.clientesPorPagina; i++){
				paginas.push(i);
			}
			console.log('Esto es paginas:' );
			console.log(paginas)
			return paginas;
		}
		/*=========================================================================*/
		clientes();
		function clientes(){
			console.log('Se llama a la funciona pedir datos')
			$http.get('/home/clientes/informacion/')
			.success(function(data){
				$scope.clientes = data.clientes;
				$scope.totalClientes = data.totalClientes;
				$scope.verFormEditarCliente = false;
				$scope.verFormAgregarCliente = false;
			})
		}
		/*=========================================================================*/
		$scope.agregarCliente = function(){
			$scope.accion = 'Nuevo Cliente';
			$scope.accionPost = 'agregar';
			$scope.formCliente = {};	
			$scope.verFormAgregarCliente = true;
			$scope.verClientes = false;
		}
		/*=========================================================================*/
		$scope.editarCliente = function(cliente){
			$scope.formCliente = cliente;
			$scope.accion = 'Editar Cliente';
			$scope.accionPost = 'editar';
			$scope.verFormEditarCliente = true;
			$scope.verCliente = false;
		}
		/*=========================================================================*/
		$scope.verCliente = function(){
			$scope.verFormAgregarCliente = false;
			$scope.verCliente = true;
			$scope.verFormEditarCliente = false;
			$scope.verClientes = false;
		}
		/*=========================================================================*/
		$scope.detallesCliente = function(cliente){
			$scope.cliente = cliente;
			$scope.verClientes = false;
			$scope.verCliente = true;
			$scope.botonAsignarTarjeta = false;
		}
		/*=========================================================================*/
		$scope.agregarAclientes = function(){
			console.log('Se llama volver clientes')
			$scope.verCliente = false;
			$scope.verFormAgregarCliente = false;
			$scope.verClientes = true;
		}
		/*=========================================================================*/
		$scope.editarAcliente = function(){
			console.log('Se llama volver clientes')
			$scope.verCliente = true;
			$scope.verFormEditarCliente = false;
			$scope.verClientes = false;
		}
		/*=========================================================================*/
		$scope.alertEliminarCliente = function(id_cliente){
			console.log('id de la Cliente: ' + id_cliente);
			var deleteCliente = confirm('Esta seguro que desea eliminar los datos de la estación?');
			if(deleteCliente){
				$http.get('/home/clientes/eliminar/' + id_cliente)
				.success(function(data){
					if(data.success){
						console.log('Se ha eliminado la Cliente exitosamente');
						clientes();
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
			console.log('form Cliente antes de enviar: ' + accion);
			console.log($scope.formCliente);
			$http({
				method: 'POST',
				url: '/home/clientes/' + accion + '/',
				data: parametrar($scope.formCliente),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data){
				console.log('respuesta de clientes agregar');
				console.log(data);
				$scope.verClientes = true;
				$scope.verFormAgregarCliente = false;
				$scope.successMessage = data.message
				clientes();
			}).error(function(data){
				console.log('Error HTTP')
			})
		}
		/*=========================================================================*/
		$scope.transacciones = {};
			$scope.listarTransacciones = function(id_cliente, pagina){
			console.log('Se llama a ver transacciones')
			let desde = pagina*$scope.transaccionesPorPagina;
			let cuantos = $scope.transaccionesPorPagina;
			$http.get('/home/clientes/transacciones/' + id_cliente + '/' + desde + '/' + cuantos + '/')
			.success(function(data){
				if(data.success){
					$scope.transacciones = data.transacciones;
					$scope.totalTransacciones = data.total;
					$scope.paginasTransacciones = paginacion($scope.totalTransacciones)
					console.log('Dato de las transacciones de la Cliente');
					console.log($scope.transacciones);
					$scope.verCliente = false;
					$scope.verTransacciones = true;
				}else{
					console.log('No hay data success')
				}
			})
		}
		$scope.selected;
		/*=========================================================================*/
		$scope.volverDetallesCliente = function(){
			console.log('Se llama ')
			$scope.verTransacciones = false;
			$scope.verCliente = true;
		}
		/*=========================================================================*/
		tarjetas()
		function tarjetas(){
			$http.get('/home/clientes/tarjetas/')
			.success(function(data){
				if(data.success){
					$scope.tarjetas = data.tarjetas;
					//$scope.totalTransacciones = data.total;
					//$scope.paginasTransacciones = paginacion($scope.totalTransacciones)
					console.log('Dato de las transacciones de la Cliente');
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
		$scope.asignarTarjeta = function(id_cliente, id_tarjeta){
			console.log('tarjeta y cliente: ');
			console.log(id_tarjeta);
			console.log(id_cliente);
			$http.get('/home/clientes/asignar_tarjeta/' + id_cliente + '/' + id_tarjeta + '/')
			.success(function(data){
				console.log('respuesta de clientes agregar');
				console.log(data);
				$scope.successMessage = data.message
				$scope.cliente.tarjetas = data.tarjetas
				$scope.botonAsignarTarjeta = false;
				$scope.tarjetaSeleccionada = '';
				tarjetas();
			}).error(function(data){
				console.log('Error HTTP')
			})
		}
		/*=========================================================================*/
		$scope.desvincularTarjeta = function(id_cliente, id_tarjeta){
			var val = prompt('Ingrese la contrasena de administrador: ');
			if(val=='123'){
				$http.get('/home/clientes/desvincular_tarjeta/' + id_cliente + '/' + id_tarjeta + '/')
				.success(function(data){
					console.log('respuesta de clientes desvincular');
					console.log(data);
					$scope.successMessage = data.message
					$scope.cliente.tarjetas = data.tarjetas
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
