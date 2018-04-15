'use strict';
angular.module('grande-colorado-adm', ['ui.router','ngResource', 'ngDialog', 'lbServices'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            // rota para a página inicial de login
            .state('app', {
                url:'/',
                views: {
                    'cabecalho': {
                        templateUrl : 'views/cabecalho.html',
                        controller  : 'CabecalhoController'
                    },
                    'conteudo': {
                        templateUrl : 'views/login.html',
                        controller  : 'LoginController'
                    }
                }
            })
            // rota para a página de categoria
            .state('app.categoria', {
                url:'Categorias/',
                views: {
                    'conteudo@': {
                        templateUrl : 'views/categoria.html',
                        controller  : 'CategoriaController'
                    }
                }
            })
            // rota para a página de subcategoria
            .state('app.subcategoria', {
                url:'Subcategorias/',
                views: {
                    'conteudo@': {
                        templateUrl : 'views/subcategoria.html',
                        controller  : 'SubcategoriaController'
                    }
                }
            })
            // rota para a página de empresas
            .state('app.empresa', {
                url: 'Empresas/',
                views: {
                    'conteudo@': {
                        templateUrl : 'views/empresa.html',
                        controller  : 'EmpresaController'
                    }
                }
            })
            ;
        $urlRouterProvider.otherwise('/');
    })
;
