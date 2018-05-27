'use strict';
angular.module('grande-colorado-adm')
  .controller('CategoriaController', ['$scope', 'Categoria', 'Usuario', '$stateParams', '$state', 'ngDialog', '$location', '$anchorScroll',
    function ($scope, Categoria, Usuario, $stateParams, $state, ngDialog, $location, $anchorScroll) {
      $scope.showCategorias = false;
      $scope.message = "Loading ...";

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

      $scope.editCategoria = function (Categoria) {
        $scope.Categoria = Categoria;
        $location.hash('cadastro');
        $anchorScroll();
      };

      $scope.saveCategoria = function () {
        Categoria.updateAttributes({
          id: $scope.Categoria.id,
          nome: $scope.Categoria.nome,
          icone: $scope.Categoria.icone
        })
          .$promise.then(
            function (response) {
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
            function (response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Categoria não salva!</h3></div>' +
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

      $scope.deleteCategoria = function (CategoriaId) {
        var catId = $scope.Categoria.categoriaId;
        Categoria.deleteById({
          id: CategoriaId
        })
          .$promise.then(
            function (response) {
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
            function (response) {
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

      $scope.carregaFotoRedimensionada = function (event) {
        var outputImage = document.getElementById('outputImage');
        file = event.files[0];
        var file, img, width, height, ratio, nWidth, nHeight, proporcao;
        var _URL = (window.URL) ? window.URL : window.webkitURL;
        img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = function () {
          width = this.width;
          height = this.height;
          //console.log('Resolução: ' + height + 'X' + width);
          //console.log('Tamanho: ' + file.size);
          // Criação do elemento canvas
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext("2d");
          //Cálculo da proporção
          if (file.size > 10000000)
            proporcao = Math.sqrt(10000000 / file.size);
          else proporcao = 1;
          canvas.width = width * proporcao;
          canvas.height = height * proporcao;
          // 1º passo
          ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
          outputImage.src = canvas.toDataURL("image/jpeg");
          $scope.Categoria.icone = canvas.toDataURL("image/jpeg");
        };
      };

    }
  ]);
