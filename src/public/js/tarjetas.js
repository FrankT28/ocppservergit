angular.module("pages.tarjetas", ['angular-js-xlsx'])
.controller("tarjetasController", ['$scope', '$http', '$rootScope',
	function tarjetasController($scope, $http, $rootScope){
	console.log('se ha llamado a tarjetas js')
	$scope.formTarjeta = {};
	$scope.verTarjetas = true;
	$scope.verFormAgregarTarjeta = false;
	$scope.tarjetasPorPagina = 10;
	
	/*=========================================================================*/
	$scope.excel = function(){
		//EL SEGUNDO PARA METRO ES EL NOMBRE DEL SHEET, EL TERCERO DEL WORKBOOK
		$rootScope.excel($scope.tarjetas, 'tarjetas', 'tarjetas');
	}
	/*=========================================================================*/
	$scope.read = function (workbook) {
		console.log('Se esta leyendo')
	/* DO SOMETHING WITH workbook HERE */
	console.log(workbook);
	}

	$scope.error = function (e) {
	/* DO SOMETHING WHEN ERROR IS THROWN */
	console.log(e);
	}
	/*=========================================================================*/
	function paginacion(total){
		var paginas = [];
		for (var i=0; i<=total/$scope.tarjetasPorPagina; i++){
			paginas.push(i);
		}
		console.log('Esto es paginas:' );
		console.log(paginas)
		return paginas;
	}
	/*=========================================================================*/
	//ELIMINAR ESTA FUNCTION, USAR $.PARAM EN JS
	function parametrar(obj) {
		var p = [];
		for (var key in obj) {
			p.push(key + '=' + encodeURIComponent(obj[key]));
		}
		return p.join('&');
	};
	/*=========================================================================*/
	$scope.listarTarjetas = function(pagina){
		let desde = pagina*$scope.tarjetasPorPagina;
		let cuantos = $scope.tarjetasPorPagina;
		console.log('Se llama a la funciona pedir datos de tarjetas')
        $http.get('/home/tarjetas/informacion/' + desde + '/' + cuantos + '/')
		.success(function(data){
			console.log('data informacion tarjetas: ');
			console.log(data);
			$scope.tarjetas = data.tarjetas;
			$scope.totalTarjetas = data.totalTarjetas;
			$scope.verFormEditarTarjeta = false;
			$scope.verFormAgregarTarjeta = false;
			$scope.paginasTarjetas = paginacion($scope.totalTarjetas)
			$scope.verTarjetas = true;
		})
    }
	$scope.listarTarjetas(0);
	/*=========================================================================*/
	estadosAutorizacion();
	function estadosAutorizacion(){
		$http.get('/home/tarjetas/estados_autorizacion/')
		.success(function(data){
			console.log('data estados autorizacion: ');
			console.log(data);
			$scope.estadosAutorizacion = data.estadosAutorizacion;
		})
	}
	/*=========================================================================*/
	$scope.agregarTarjeta = function(){
		$scope.verTarjetas = false;
		$scope.verFormAgregarTarjeta = true;
		$scope.accionPost = 'agregar';
		$scope.formTarjeta = {}
	}
	/*=========================================================================*/
	$scope.editarTarjeta = function(tarjeta){
		$scope.formTarjeta = tarjeta;
		$scope.accion = 'Editar Tarjeta';
		$scope.accionPost = 'editar';
		$scope.verFormEditarTarjeta = true;
		$scope.verTarjetas = false;
	}
	/*=========================================================================*/
	$scope.agregarAtarjetas = function(){
		$scope.verTarjeta = false;
		$scope.verFormAgregarTarjeta = false;
		$scope.verFormEditarTarjeta = false;
		$scope.verTarjetas = true;
	}
	/*=========================================================================*/
	$scope.editarAtarjeta = function(){
		console.log('Se llama volver Tarjetas')
		$scope.verTarjeta = true;
		$scope.verFormEditarTarjeta = false;
		$scope.verTarjetas = false;

		
	}
	/*=========================================================================*/
	$scope.enviar = function(accion, id){
		if($scope.accionPost=='editar'){
			accion = accion + '/' + id;
		}
		console.log('form Tarjeta antes de enviar: ' + accion);
		console.log($scope.formTarjeta);
		$http({
			method: 'POST',
			url: '/home/tarjetas/' + accion + '/',
			data: parametrar($scope.formTarjeta),
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).success(function(data){
			console.log('respuesta de tarjetas agregar');
			console.log(data);
			$scope.vertTarjetas = true;
			$scope.verFormAgregarTarjeta = false;
			$scope.successMessage = data.message
			$scope.listarTarjetas(0);
		}).error(function(data){
			console.log('Error HTTP')
		})
	}
	/*=========================================================================*/
	$scope.detallesTarjeta = function(tarjeta){
		console.log('se llama detalles tarjeta')
		console.log('tarjeta');
		console.log(tarjeta);
		$scope.tarjeta = tarjeta;
		$scope.formTarjeta = tarjeta;
		$scope.verTarjetas = false;
		$scope.verFormEditarTarjeta = true;
	}
	/*=========================================================================*/
	$scope.alertEliminarTarjeta = function(id_tarjeta){
		let confirmEliminar = confirm('Esta seguro de que desea eliminar los datos de la tarjeta?');
		if (confirmEliminar){
			$http.get('/home/tarjetas/eliminar/' + id_tarjeta + '/')
			.success(function(data){
				$scope.listarTarjetas(0);
			})
		}
	}
	/*=========================================================================*/
	$scope.datosClienteTarjeta = function(){
		console.log('se llama function datos cliente tarjeta');
		console.log($scope.tarjeta)
		$scope.cliente = $scope.tarjeta.cliente;
	}
	/*=========================================================================*
	$scope.volverDetallesTarjeta = function(){
		console.log('Se llama ')
		$scope.verTransacciones = false;
		$scope.verTarjeta = true;
	}
	/*=========================================================================*/

}
]
)