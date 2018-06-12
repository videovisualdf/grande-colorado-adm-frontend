'use strict';
angular.module('grande-colorado-adm')
    .controller('CategoriasEmpresaController', ['$scope', 'CategoriasEmpresa', 'Empresa', 'Subcategoria', 'Categoria', '$stateParams', '$state', 'ngDialog', '$location', '$anchorScroll',
        function ($scope, CategoriasEmpresa, Empresa, Subcategoria, Categoria, $stateParams, $state, ngDialog, $location, $anchorScroll) {
            $scope.showCategoriasEmpresa = false;
            $scope.message = "Loading ...";
            $scope.ativo = $stateParams.ativo;

            Empresa.findById({
                id: $stateParams.id
            })
                .$promise.then(
                    function (response) {
                        $scope.Empresa = response;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    }
                );
            CategoriasEmpresa.find({
                filter: {
                    where: { empresaId: $stateParams.id },                    
                    include: ['categoria', 'subcategoria']
                }
            })
                .$promise.then(
                    function (response) {
                        $scope.CategoriasEmpresa = response;
                        $scope.showCategoriasEmpresa = true;
                    },
                    function (response) {
                        $scope.message = "Error: " + response.status + " " + response.statusText;
                    });

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
                            fields: ['nome', 'icone'],
                            order: ['categoria.nome ASC']
                        }
                    },
                    order: ['categoria.nome ASC']
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

            $scope.editCategoriasEmpresa = function (CategoriasEmpresa) {
                $scope.CategoriasEmpresa = CategoriasEmpresa;
                $location.hash('cadastro');
                $anchorScroll();
            };
            $scope.saveCategoriasEmpresa = function () {
                if (!$scope.CategoriasEmpresa.empresaId) {
                    $scope.CategoriasEmpresa.empresaId = $stateParams.id;
                }
                CategoriasEmpresa.updateAttributes({
                    id: $scope.CategoriasEmpresa.id,
                    empresaId: $scope.CategoriasEmpresa.empresaId,
                    categoriaId: $scope.CategoriasEmpresa.categoriaId,
                    subcategoriaId: $scope.CategoriasEmpresa.subcategoriaId,
                    destaque: $scope.CategoriasEmpresa.destaque,
                })
                    .$promise.then(
                        function (response) {
                            var message = '\
              <div class="ngdialog-message">\
                <div><h3>Categoria/Subcategoria/Destaque salvo com sucesso</h3></div>' +
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
                <div><h3>Categoria/Subcategoria/Destaque não salvo!</h3></div>' +
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
            $scope.deleteCategoriasEmpresa = function (CategoriasEmpresaId) {
                var catEmpId = $scope.CategoriasEmpresa.usuarioId;
                CategoriasEmpresa.deleteById({
                    id: CategoriasEmpresaId
                })
                    .$promise.then(
                        function (response) {
                            var message = '\
              <div class="ngdialog-message">\
                <div><h3>Categoria/Subcategoria/Destaque excluído com sucesso!</h3></div>' +
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
                <div><h3>Categoria/Subcategoria/Destaque não foi excluído!</h3></div>' +
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
        }
    ])

    ;
