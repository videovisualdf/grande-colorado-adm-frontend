'use strict';
angular.module('grande-colorado-adm')
  .controller('CabecalhoController', ['$scope', '$state', '$location', '$rootScope', 'AuthService', 'ngDialog',
    function ($scope, $state, $location, $rootScope, AuthService, ngDialog) {
      $rootScope.mantendo = false;
      $scope.loggedIn = false;
      $scope.username = '';
      $scope.usuarioId = '';
      if (AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
        $scope.usuarioId = AuthService.getUsuarioId();
      };
      $scope.logOut = function () {
        AuthService.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $scope.usuarioId = '';
        $state.go('app');
      };
      $scope.openEmpresas = function () {
        $state.go('app.empresa');
      };
      $scope.openUsuarios = function (usuarioId) {
        $state.go('app.usuarios', { id: usuarioId.usuarioId });
      };
      $scope.openCategorias = function () {
        $state.go('app.categoria');
      };
      $scope.openSubcategorias = function () {
        $state.go('app.subcategoria');
      };
      $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
        $scope.usuarioId = AuthService.getUsuarioId();
        $state.go('app.categoria');
      });
      $scope.stateis = function (curstate) {
        return $state.is(curstate);
      };
    }
  ])
  .controller('LoginController', ['$scope', '$localStorage', 'AuthService', 'ngDialog', function ($scope, $localStorage, AuthService, ngDialog) {
    $scope.loginData = $localStorage.getObject('userinfo', '{}');
    $scope.doLogin = function () {
      if ($scope.rememberMe)
        $localStorage.storeObject('userinfo', $scope.loginData);
      AuthService.login($scope.loginData);
      ngDialog.close();
    };
  }]
  )

  ;
