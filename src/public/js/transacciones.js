	angular.module("pages.transacciones", ['ui.bootstrap'])
	.controller("transaccionesController", ['$scope', '$http', '$rootScope',
		function transaccionesController($scope, $http, $rootScope){
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
		$scope.excel = function(){
			//EL SEGUNDO PARA METRO ES EL NOMBRE DEL SHEET, EL TERCERO DEL WORKBOOK
			$rootScope.excel($scope.transacciones, 'transacciones', 'transacciones');
		}
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
		$scope.graficaTransaccion = function(transaccion){
			console.log('id de transaccion: ' + transaccion.id_transaccion);
			
			let id_transaccion = transaccion.id_transaccion;

			var elemento = document.getElementById('line-chart');
			elemento.innerHTML = ""
			//elemento.empty();

			console.log('Este es el elemento: ');
			console.log(elemento)
			$http.get('/home/transacciones/get_grafica/' + id_transaccion + '/')
			.success(function(data){
				console.log('respuesta de transacciones grafica');
				console.log(data);

				
				var skin = '';

				new Morris.Line({
					//lineColors: [ config.skins[ skin ][ 'primary-color' ], colors[ 'danger-color' ] ],
					//pointFillColors: [ config.skins[ skin ][ 'primary-color' ], colors[ 'danger-color' ] ],
					pointStrokeColors: [ '#ffffff', '#ffffff' ],
					gridTextColor: colors[ 'default-color' ],
					gridTextWeight: 'bold',
		
					// ID of the element in which to draw the chart.
					element: 'line-chart',
					// Chart data records -- each entry in this array corresponds to a point on
					// the chart.
					/*data: [
						{date: '2014-02', a: 2000, b: 2400},
						{date: '2014-03', a: 1200, b: 2500},
						{date: '2014-04', a: 3200, b: 2000},
						{date: '2014-05', a: 1600, b: 1440},
						{date: '2014-06', a: 1290, b: 2830},
						{date: '2014-07', a: 1930, b: 1200},
						{date: '2014-08', a: 2120, b: 3000}
					],*/
					//LA DATA QUE ENVIA EL BACK PARA LA GRAFICA, EN VALORES POR HORA DEL DIA
					data: data,
					// The name of the data record attribute that contains x-values.
					xkey: 'hora',
					// A list of names of data record attributes that contain y-values.
					ykeys: [ 'valor' ],
					// Labels for the ykeys -- will be displayed when you hover over the
					// chart.
					labels: [ 'Potencia' ],
					resize: false,
					parseTime: false
				});
			})
		}
	}]
)
