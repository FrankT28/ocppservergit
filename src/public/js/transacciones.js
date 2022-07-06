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
		$scope.graficaTransaccion = function(){
			(function ($) {
				console.log('pasa de funcion');
				let charts = {};
				charts.chart_lines_fill_nopoints =
				{
					// chart data
					data: {
						d1: [],
						d2: []
					},

					// will hold the chart object
					plot: null,

					// chart options
					options: {
						grid: {
							show: true,
							aboveData: false,
							color: colors[ 'default-color' ],
							labelMargin: 5,
							axisMargin: 0,
							borderWidth: 0,
							borderColor: null,
							minBorderMargin: 5,
							clickable: true,
							hoverable: true,
							mouseActiveRadius: 20,
							backgroundColor: {}
						},
						series: {
							grow: {
								active: false
							},
							lines: {
								show: true,
								fill: true,
								lineWidth: 2,
								steps: false
							},
							points: {
								show: false
							}
						},
						legend: {
							position: "nw",
							noColumns: 2
						},
						yaxis: {
							ticks: 4,
							tickDecimals: 0,
							tickColor: '#efefef'
						},
						xaxis: {
							ticks: 11,
							tickDecimals: 0,
							tickColor: 'transparent'
						},
						colors: [],
						shadowSize: 1,
						tooltip: true,
						tooltipOpts: {
							content: "%s : %y.0",
							shifts: {
								x: - 30,
								y: - 50
							},
							defaultTheme: false
						}
					},

					// initialize
					init: function (wrapper) {

						console.log('init')
						if (! wrapper.length) return;

						// apply styling
						charts.utility.applyStyle(this);

						// generate some data
						this.data.d1 = [ [ 1, 3 + charts.utility.randNum() ], [ 2, 6 + charts.utility.randNum() ], [ 3, 9 + charts.utility.randNum() ], [ 4, 12 + charts.utility.randNum() ], [ 5, 15 + charts.utility.randNum() ], [ 6, 18 + charts.utility.randNum() ], [ 7, 21 + charts.utility.randNum() ], [ 8, 15 + charts.utility.randNum() ], [ 9, 18 + charts.utility.randNum() ], [ 10, 21 + charts.utility.randNum() ], [ 11, 24 + charts.utility.randNum() ], [ 12, 27 + charts.utility.randNum() ], [ 13, 30 + charts.utility.randNum() ], [ 14, 33 + charts.utility.randNum() ], [ 15, 24 + charts.utility.randNum() ], [ 16, 27 + charts.utility.randNum() ], [ 17, 30 + charts.utility.randNum() ], [ 18, 33 + charts.utility.randNum() ], [ 19, 36 + charts.utility.randNum() ], [ 20, 39 + charts.utility.randNum() ], [ 21, 42 + charts.utility.randNum() ], [ 22, 45 + charts.utility.randNum() ], [ 23, 36 + charts.utility.randNum() ], [ 24, 39 + charts.utility.randNum() ], [ 25, 42 + charts.utility.randNum() ], [ 26, 45 + charts.utility.randNum() ], [ 27, 38 + charts.utility.randNum() ], [ 28, 51 + charts.utility.randNum() ], [ 29, 55 + charts.utility.randNum() ], [ 30, 60 + charts.utility.randNum() ] ];
						this.data.d2 = [ [ 1, charts.utility.randNum() - 5 ], [ 2, charts.utility.randNum() - 4 ], [ 3, charts.utility.randNum() - 4 ], [ 4, charts.utility.randNum() ], [ 5, 4 + charts.utility.randNum() ], [ 6, 4 + charts.utility.randNum() ], [ 7, 5 + charts.utility.randNum() ], [ 8, 5 + charts.utility.randNum() ], [ 9, 6 + charts.utility.randNum() ], [ 10, 6 + charts.utility.randNum() ], [ 11, 6 + charts.utility.randNum() ], [ 12, 2 + charts.utility.randNum() ], [ 13, 3 + charts.utility.randNum() ], [ 14, 4 + charts.utility.randNum() ], [ 15, 4 + charts.utility.randNum() ], [ 16, 4 + charts.utility.randNum() ], [ 17, 5 + charts.utility.randNum() ], [ 18, 5 + charts.utility.randNum() ], [ 19, 2 + charts.utility.randNum() ], [ 20, 2 + charts.utility.randNum() ], [ 21, 3 + charts.utility.randNum() ], [ 22, 3 + charts.utility.randNum() ], [ 23, 3 + charts.utility.randNum() ], [ 24, 2 + charts.utility.randNum() ], [ 25, 4 + charts.utility.randNum() ], [ 26, 4 + charts.utility.randNum() ], [ 27, 5 + charts.utility.randNum() ], [ 28, 2 + charts.utility.randNum() ], [ 29, 2 + charts.utility.randNum() ], [ 30, 3 + charts.utility.randNum() ] ];

						// make chart
						this.plot = $.plot(
							wrapper,
							[ {
								label: "Visits",
								data: this.data.d1
							},
							{
								label: "Unique Visits",
								data: this.data.d2
							} ],
							this.options
						);
					}
				};

				$.fn.tkFlotChartLines1 = function () {
					if (! this.length) return;
					charts.chart_lines_fill_nopoints.init(this);
				};

			})(jQuery);
		}
		/*=========================================================================*/
		$scope.graficaTransaccion = function(transaccion){
			let id_transaccion = transaccion.id_transaccion;
			var elemento = document.getElementById('line-chart');
			elemento.innerHTML = ""
			$http.get('/home/transacciones/get_grafica/' + id_transaccion + '/')
			.success(function(data){
				var skin = '';
				new Morris.Line({
					pointStrokeColors: [ '#ffffff', '#ffffff' ],
					gridTextColor: colors[ 'default-color' ],
					gridTextWeight: 'bold',
					element: 'line-chart',
					data: data,
					xkey: 'hora',
					ykeys: [ 'valor' ],
					labels: [ 'Potencia' ],
					resize: false,
					parseTime: false
				});
			})
		}
		/*=========================================================================*/
	}]
)
