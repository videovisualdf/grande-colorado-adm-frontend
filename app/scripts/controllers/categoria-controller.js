'use strict';
angular.module('grande-colorado-adm')
  .controller('CategoriaController', ['$scope', 'Categoria', 'Usuario', '$stateParams', '$state', 'ngDialog',
    function($scope, Categoria, Usuario, $stateParams, $state, ngDialog) {
      $scope.showCategorias = false;
      $scope.message = "Loading ...";
      Categoria.find({
        filter: {
          order: ['nome ASC']//,
          //include: {relation: 'usuario'}
        }
      })
      .$promise.then(
        function(response) {
          $scope.categorias = response;
          $scope.showCategorias = true;
        },
        function(response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });
      $scope.editCategoria = function(Categoria) {
        $scope.Categoria = Categoria;
      };
      $scope.saveCategoria = function() {
        if (!$scope.Categoria.usuarioId) {
          $scope.Categoria.usuarioId = $stateParams.id;
        }
        Categoria.updateAttributes({
            usuarioId: $scope.Categoria.usuarioId,
            nome: $scope.Categoria.nome,            
          })
          .$promise.then(
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Categoria salva com sucesso</h3></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>';
              ngDialog.openConfirm({
                template: message,
                plain: 'true'
              });
              $state.reload();
            },
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Categoria não salva!</h3></div>' +
                '<div><p>' + response.data.error.message + '</p><p>' +
                response.data.error.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>';
              ngDialog.openConfirm({
                template: message,
                plain: 'true'
              });
            }
          );
      };
      $scope.deleteCategoria = function(CategoriaId) {
        var facId = $scope.Categoria.usuarioId;
        Categoria.deleteById({
            id: CategoriaId
          })
          .$promise.then(
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Categoria excluída com sucesso!</h3></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>';
              ngDialog.openConfirm({
                template: message,
                plain: 'true'
              });
              $state.reload();
            },
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Categoria não foi excluída!</h3></div>' +
                '<div><p>' + response.data.error.message + '</p><p>' +
                response.data.error.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>';
              ngDialog.openConfirm({
                template: message,
                plain: 'true'
              });
            }
          );
      };

//Código accordion angular-ui-bootstrap
      $scope.umPorVez = false;
      $scope.expandir = false;
      $scope.expandirGrupo = false;

      $scope.inverte = function(status){
        $scope.expandir = !status;
      };

//Fim Código accordion angular-ui-bootstrap

    }
  ])

;
