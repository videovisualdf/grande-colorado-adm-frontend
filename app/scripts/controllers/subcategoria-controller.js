'use strict';
angular.module('grande-colorado-adm')
  .controller('SubcategoriaController', ['$scope', 'Subcategoria', 'Categoria', '$stateParams', '$state', 'ngDialog', '$location', '$anchorScroll',
    function ($scope, Subcategoria, Categoria, $stateParams, $state, ngDialog, $location, $anchorScroll) {
      $scope.showSubcategorias = false;
      $scope.message = "Loading ...";
      $scope.ativo = $stateParams.ativo;

      Categoria.find({
        filter: {
          order: ['nome ASC']
        }
      })
        .$promise.then(
          function (response) {
            $scope.categorias = response;
            $scope.showCategorias = true;
          },
          function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          });

      Subcategoria.find({
        filter: {
          include: {
            relation: 'categoria', 
            scope: {
              fields: ['nome'],
              order: ['nome DESC']
            }
          },
          order: ['categoria.nome ASC', 'nome ASC']
        }
      })
        .$promise.then(
          function (response) {
            $scope.Subcategorias = response;
            $scope.showSubcategorias = true;
          },
          function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          });

      $scope.editSubcategoria = function (Subcategoria) {
        $scope.Subcategoria = Subcategoria;
        $location.hash('cadastro');
        $anchorScroll();
      };
      $scope.saveSubcategoria = function () {
        Subcategoria.updateAttributes({
          id: $scope.Subcategoria.id,
          nome: $scope.Subcategoria.nome,
          categoriaId: $scope.Subcategoria.categoriaId,
        })
          .$promise.then(
            function (response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Subcategoria salva com sucesso</h3></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>';
              ngDialog.openConfirm({
                template: message,
                plain: 'true'
              });
              $state.reload();
            },
            function (response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Subcategoria não salva!</h3></div>' +
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
      $scope.deleteSubcategoria = function (SubcategoriaId) {
        var facId = $scope.Subcategoria.usuarioId;
        Subcategoria.deleteById({
          id: SubcategoriaId
        })
          .$promise.then(
            function (response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Subcategoria excluída com sucesso!</h3></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>';
              ngDialog.openConfirm({
                template: message,
                plain: 'true'
              });
              $state.reload();
            },
            function (response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Subcategoria não foi excluída!</h3></div>' +
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

      $scope.inverte = function (status) {
        $scope.expandir = !status;
      };

      //Fim Código accordion angular-ui-bootstrap

    }
  ])

  ;
