	angular.module("pages.usuarios", ['ui.bootstrap'])
	.controller("usuariosController", ['$scope', '$http', 
		function usuariosController($scope, $http){
		//NO BORRAR ESTA LINEA, NO SE QUE HACE PERO SIRVE PARA NO DESCUADRAR LOS HTML.
		$scope.app.settings.htmlClass = 'st-layout ls-top-navbar ls-bottom-footer show-sidebar sidebar-l2';
		/*=========================================================================*/
		//INICIALIZACION DE VARIABLES
		console.log('se ha llamado a usuarios js');
		$scope.formUsuario = {};
		$scope.verusuarios = true;
		$scope.verUsuario = false;
		$scope.verFormAgregarUsuario = false;
		$scope.verFormEditarUsuario = false;
		$scope.usuariosPorPagina = 10;
		$scope.transaccionesPorPagina = 10;
		/*=========================================================================*/
		function paginacion(total){
			var paginas = [];
			for (var i=0; i<=total/$scope.usuariosPorPagina; i++){
				paginas.push(i);
			}
			console.log('Esto es paginas:' );
			console.log(paginas)
			return paginas;
		}
		/*=========================================================================*/
		usuarios();
		function usuarios(){
			console.log('Se llama a la funciona pedir datos')
			$http.get('/home/usuarios/informacion/')
			.success(function(data){
                $scope.verUsuarios = true;
				$scope.usuarios = data.usuarios;
				$scope.totalusuarios = data.totalusuarios;
				$scope.verFormEditarUsuario = false;
				$scope.verFormAgregarUsuario = false;
			})
		}
		/*=========================================================================*/
		$scope.agregarUsuario = function(){
			$scope.accion = 'Nuevo Usuario';
			$scope.accionPost = 'agregar';
			$scope.formUsuario = {};	
			$scope.verFormAgregarUsuario = true;
			$scope.verUsuarios = false;
		}
		/*=========================================================================*/
		$scope.editarUsuario = function(Usuario){
			$scope.formUsuario = Usuario;
			$scope.accion = 'Editar Usuario';
			$scope.accionPost = 'editar';
			$scope.verFormEditarUsuario = true;
			$scope.verUsuario = false;
		}
		/*=========================================================================*/
		$scope.verUsuario = function(){
			$scope.verFormAgregarUsuario = false;
			$scope.verUsuario = true;
			$scope.verFormEditarUsuario = false;
			$scope.verusuarios = false;
		}
		/*=========================================================================*/
		$scope.detallesUsuario = function(Usuario){
			$scope.Usuario = Usuario;
			$scope.verusuarios = false;
			$scope.verUsuario = true;
			$scope.botonAsignarTarjeta = false;
		}
		/*=========================================================================*/
		$scope.agregarAusuarios = function(){
			console.log('Se llama volver usuarios')
			$scope.verUsuario = false;
			$scope.verFormAgregarUsuario = false;
			$scope.verUsuarios = true;
		}
		/*=========================================================================*/
		$scope.editarAUsuario = function(){
			console.log('Se llama volver usuarios')
			$scope.verUsuario = true;
			$scope.verFormEditarUsuario = false;
			$scope.verusuarios = false;
		}
		/*=========================================================================*/
		$scope.alertEliminarUsuario = function(id_Usuario){
			console.log('id de la Usuario: ' + id_Usuario);
			var deleteUsuario = confirm('Esta seguro que desea eliminar los datos de la estación?');
			if(deleteUsuario){
				$http.get('/home/usuarios/eliminar/' + id_Usuario)
				.success(function(data){
					if(data.success){
						console.log('Se ha eliminado la Usuario exitosamente');
						usuarios();
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
			console.log('form Usuario antes de enviar: ' + accion);
			console.log($scope.formUsuario);
			$http({
				method: 'POST',
				url: '/home/usuarios/' + accion + '/',
				data: parametrar($scope.formUsuario),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data){
				console.log('respuesta de usuarios agregar');
				console.log(data);
				$scope.verusuarios = true;
				$scope.verFormAgregarUsuario = false;
				$scope.successMessage = data.message
				usuarios();
			}).error(function(data){
				console.log('Error HTTP')
			})
		}
		/*=========================================================================*/
		$scope.transacciones = {};
			$scope.listarTransacciones = function(id_Usuario, pagina){
			console.log('Se llama a ver transacciones')
			let desde = pagina*$scope.transaccionesPorPagina;
			let cuantos = $scope.transaccionesPorPagina;
			$http.get('/home/usuarios/transacciones/' + id_Usuario + '/' + desde + '/' + cuantos + '/')
			.success(function(data){
				if(data.success){
					$scope.transacciones = data.transacciones;
					$scope.totalTransacciones = data.total;
					$scope.paginasTransacciones = paginacion($scope.totalTransacciones)
					console.log('Dato de las transacciones de la Usuario');
					console.log($scope.transacciones);
					$scope.verUsuario = false;
					$scope.verTransacciones = true;
				}else{
					console.log('No hay data success')
				}
			})
		}
		$scope.selected;
		/*=========================================================================*/
		$scope.volverDetallesUsuario = function(){
			console.log('Se llama ')
			$scope.verTransacciones = false;
			$scope.verUsuario = true;
		}
		/*=========================================================================*/
		tarjetas()
		function tarjetas(){
			$http.get('/home/usuarios/tarjetas/')
			.success(function(data){
				if(data.success){
					$scope.tarjetas = data.tarjetas;
					//$scope.totalTransacciones = data.total;
					//$scope.paginasTransacciones = paginacion($scope.totalTransacciones)
					console.log('Dato de las transacciones de la Usuario');
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
		$scope.asignarTarjeta = function(id_Usuario, id_tarjeta){
			console.log('tarjeta y Usuario: ');
			console.log(id_tarjeta);
			console.log(id_Usuario);
			$http.get('/home/usuarios/asignar_tarjeta/' + id_Usuario + '/' + id_tarjeta + '/')
			.success(function(data){
				console.log('respuesta de usuarios agregar');
				console.log(data);
				$scope.successMessage = data.message
				$scope.Usuario.tarjetas = data.tarjetas
				$scope.botonAsignarTarjeta = false;
				$scope.tarjetaSeleccionada = '';
				tarjetas();
			}).error(function(data){
				console.log('Error HTTP')
			})
		}
		/*=========================================================================*/
		$scope.desvincularTarjeta = function(id_Usuario, id_tarjeta){
			var val = prompt('Ingrese la contrasena de administrador: ');
			if(val=='123'){
				$http.get('/home/usuarios/desvincular_tarjeta/' + id_Usuario + '/' + id_tarjeta + '/')
				.success(function(data){
					console.log('respuesta de usuarios desvincular');
					console.log(data);
					$scope.successMessage = data.message
					$scope.Usuario.tarjetas = data.tarjetas
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
