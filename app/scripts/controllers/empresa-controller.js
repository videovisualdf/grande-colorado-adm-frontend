'use strict';
angular.module('grande-colorado-adm')
  .controller('EmpresaController', ['$scope', 'Empresa', 'Categoria', 'Subcategoria', '$stateParams', '$state', 'ngDialog',
    function ($scope, Empresa, Categoria, Subcategoria, $stateParams, $state, ngDialog) {
      $scope.showEmpresas = false;
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
          },
          function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          });

      Subcategoria.find({
        filter: {
          include: {
            relation: 'categoria'
          },
          order: ['nome ASC']
        }
      })
        .$promise.then(
          function (response) {
            $scope.subcategorias = response;
          },
          function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          });

      Empresa.find({
        filter: {
          include: ['categoria', 'subcategoria'],
          order: ['nome ASC']
        }
      })
        .$promise.then(
          function (response) {
            $scope.Empresas = response;
            $scope.showEmpresas = true;
          },
          function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          });

      $scope.editEmpresa = function (Empresa) {
        $scope.Empresa = Empresa;
      };
      $scope.saveEmpresa = function () {        
        Empresa.updateAttributes({
          id: $scope.Empresa.id,
          nome: $scope.Empresa.nome,          
          endereco: $scope.Empresa.endereco,
          telefone: $scope.Empresa.telefone,
          site: $scope.Empresa.site,
          facebook: $scope.Empresa.facebook,
          instagram: $scope.Empresa.instagram,
          twitter: $scope.Empresa.twitter,
          email: $scope.Empresa.email,
          logo: $scope.Empresa.logo,
          descricao: $scope.Empresa.descricao,
          categoriaId: $scope.Empresa.categoriaId,
          subcategoriaId: $scope.Empresa.subcategoriaId
        })
          .$promise.then(
            function (response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Empresa salva com sucesso</h3></div>' +
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
              console.log('entrou');
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Empresa não salva!</h3></div>' +
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
      $scope.deleteEmpresa = function (EmpresaId) {        
        Empresa.deleteById({
          id: EmpresaId
        })
          .$promise.then(
            function (response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Empresa excluída com sucesso!</h3></div>' +
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
                <div><h3>Empresa não foi excluída!</h3></div>' +
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

      $scope.carregaFoto = function (event) {
        var output = document.getElementById('output');
        file = event.files[0];
        if (file.size > 100000) {
          console.log('Favor carregar fotos menores do que 100 kB!');
          var message = '\
          <div class="ngdialog-message">\
            <div><h3>Favor carregar fotos menores do que 100 kB!</h3></div>' +
            '<div class="ngdialog-buttons">\
                <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
            </div>';
          ngDialog.openConfirm({
            template: message,
            plain: 'true'
          });
        }
        else {
          output.src = URL.createObjectURL(file);
          var reader = new FileReader();
          reader.onloadend = function () {
            $scope.Empresa.foto = reader.result;
            $scope.$apply();
          }
          reader.readAsDataURL(file);
          $scope.Empresa.foto = reader.result;
        }
      };

      $scope.carregaFotoRedimensionada = function (event) {
        var outputImage = document.getElementById('outputImage');
        file = event.files[0];
        if (file.size > 10000000) {
          console.log('Favor carregar fotos menores do que 10 MB!');
          var message = '\
          <div class="ngdialog-message">\
            <div><h3>Favor carregar fotos menores do que 10 MB!</h3></div>' +
            '<div class="ngdialog-buttons">\
                <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
            </div>';
          ngDialog.openConfirm({
            template: message,
            plain: 'true'
          });
        }
        else {
          var file, img, width, height, ratio, nWidth, nHeight, proporcao;
          var _URL = (window.URL) ? window.URL : window.webkitURL;
          img = new Image();
          img.src = _URL.createObjectURL(file);
          img.onload = function () {
            width = this.width;
            height = this.height;
            console.log('Resolução: ' + height + 'X' + width);
            console.log('Tamanho: ' + file.size);
            // Criação do elemento canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            //Cálculo da proporção
            proporcao = Math.sqrt(100000 / file.size);
            canvas.width = width * proporcao;
            canvas.height = height * proporcao;
            // 1º passo
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
            outputImage.src = canvas.toDataURL("image/jpeg");
            $scope.Empresa.foto = canvas.toDataURL("image/jpeg");
          };
        }


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
