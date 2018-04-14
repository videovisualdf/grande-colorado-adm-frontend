'use strict';
angular.module('grande-colorado-adm')
  .factory('AuthService', ['Usuario', '$q', '$rootScope', 'ngDialog', function(Usuario, $q, $rootScope, ngDialog) {
    function login(loginData) {
      return Usuario
        .login(loginData)
        .$promise
        .then(function(response) {
            $rootScope.currentUsuario = {
              id: response.user.id,
              tokenId: response.id,
              username: loginData.username
            };
            $rootScope.mantendo = true;
            $rootScope.$broadcast('login:Successful');
          },
          
          function(response) {
            var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login não realizado</h3></div>' +
              '<div><p>' + response.data.error.message + '</p><p>' +
              response.data.error.name + '</p></div>' +
              '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>';
            ngDialog.openConfirm({
              template: message,
              plain: 'true'
            });
          });
    }

    function isAuthenticated() {
      if ($rootScope.currentUsuario) {
        return true;
      } else {
        return false;
      }
    }

    function getUsername() {
      return $rootScope.currentUsuario.username;
    }

    function getUsuarioId() {
      return $rootScope.currentUsuario.id;
    }

    function logout() {
      return Usuario
        .logout()
        .$promise
        .then(function() {
          $rootScope.currentUsuario = null;
          $rootScope.mantendo = false;
        });
    }

    function register(registerData) {
      return Usuario
        .create({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
        })
        .$promise
        .then(function(response) {
            var message = '\
              <div class="ngdialog-message">\
              <div><h3>Usuário registrado com sucesso!</h3></div>' +
              '<div><p>Por favor acesse o sistema utilizando as informações registradas</p></div>';
            ngDialog.openConfirm({
              template: message,
              plain: 'true'
            });
          },
          function(response) {
            var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registro não realizado</h3></div>' +
              '<div><p>' + response.data.error.message +
              '</p><p>' + response.data.error.name + '</p></div>';
            ngDialog.openConfirm({
              template: message,
              plain: 'true'
            });
          });
    }
    return {
      login: login,
      logout: logout,
      register: register,
      isAuthenticated: isAuthenticated,
      getUsername: getUsername,
      getUsuarioId: getUsuarioId
    };
  }])

.factory('$localStorage', ['$window', function($window) {
  return {
    store: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function(key) {
      $window.localStorage.removeItem(key);
    },
    storeObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key, defaultValue) {
      return JSON.parse($window.localStorage[key] || defaultValue);
    }
  };
}]);
