angular.module("pages.login", [''])
.controller("loginController", ['$scope', '$http', 
    function loginController($scope, $http){
		/*=========================================================================*/
        $scope.login = function(){
			console.log('se llama a login')
            $http({
				method: 'POST',
				url: '/home/inicio/login/',
				data: parametrar($scope.formLogin),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data){
				console.log('respuesta de login');
				console.log(data);
			}).error(function(data){
				console.log('Error HTTP')
			})
        }
		/*=========================================================================*/
        
    }
])