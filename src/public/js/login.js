angular.module("login", [])
.controller("loginController", ['$scope', '$http', '$state',
    function loginController($scope, $http, $state){
		/*=========================================================================*/
		function parametrar(obj) {
			var p = [];
			for (var key in obj) {
				p.push(key + '=' + encodeURIComponent(obj[key]));
			}
			return p.join('&');
		};
		/*=========================================================================*/
        $scope.login = function(){
			console.log('se llama a login')
            $http({
				method: 'POST',
				url: '/',
				data: parametrar($scope.formLogin),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function(data){
				console.log('respuesta de login');
				console.log(data);
				if(data.success==true){
					$state.go('pages.dashboard');
				}else{
					$state.go('login');
				}
			}).error(function(data){
				console.log('Error HTTP')
			})
        }
		/*=========================================================================*/
        
    }
])