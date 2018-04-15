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
            //$rootScope.mantendo = true;
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

    return {
      login: login,
      logout: logout,
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
