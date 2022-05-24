angular.module("pages.tarjetas", [])
.controller("tarjetasController", ['$scope', '$http', 
	function tarjetasController($scope, $http){
	console.log('se ha llamado a tarjetas js')
	$scope.formTarjeta = {};
	$scope.verTarjetas = true;
	$scope.verFormAgregarTarjeta = false;
	$scope.tarjetasPorPagina = 10;
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
			$scope.verTarjetas = true;
			console.log(data);
			$scope.tarjetas = data.tarjetas;
			$scope.totalTarjetas = data.totalTarjetas;
			$scope.verFormEditarTarjeta = false;
			$scope.verFormAgregarTarjeta = false;
			$scope.paginasTarjetas = paginacion($scope.totalTarjetas)
		})
    }
	$scope.listarTarjetas(0);

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
		$scope.verTarjeta = false;
	}
	/*=========================================================================*/
	$scope.agregarAtarjetas = function(){
		$scope.verTarjeta = false;
		$scope.verFormAgregarTarjeta = false;
		$scope.verTarjetas = true;
	}
	/*=========================================================================*/
	$scope.editarAtarjeta = function(){
		console.log('Se llama volver Tarjetaes')
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
		$scope.tarjeta = tarjeta;
		$scope.verTarjetas = false;
		$scope.verTarjeta = true;
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