/* global angular */
var apps = angular.module('cargaApp', ['ngRoute', 'ngResource']);
apps.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);
apps.config(function ($routeProvider) {
    $routeProvider.when('/cadCarga', {
        controller: 'CadastroCargasController',
        templateUrl: 'templates2/cadCarga.html'
    }).when('/cadCarga/:id', {
        controller: 'CadastroCargasController',
        templateUrl: 'templates2/cadCarga.html'
    }).when('/tabCarga', {
        controller: 'TabelaCargaController',
        templateUrl: 'templates2/tabCarga.html'
    }).otherwise('/tabCarga');
});
apps.controller('TabelaCargaController', function ($scope, CargasService) {
    LISTAR();
    function LISTAR() {
        CargasService.LISTAR().then(function (cargas) {
            $scope.cargas = cargas;
        });
    }
    $scope.EXCLUIR = function (carga) {
        CargasService.EXCLUIR(carga).then(LISTAR);
    };
});
apps.controller('CadastroCargasController', function ($routeParams, $scope, $location,
        CargasService) {
    var id = $routeParams.id;
    if (id) {
        CargasService.getCarga(id).then(function (carga) {
            $scope.carga = carga;
        });
    } else {
        $scope.carga = {};
    }
    function SALVAR(carga) {
        $scope.carga = {};
        CargasService.SALVAR(carga);
    }
    function redirecionarTabelas() {
        $location.path('/tabCarga');
    }
    $scope.SALVAR = function (carga) {
        SALVAR(carga).then(redirecionarTabelas);
    };
    $scope.SALVARCadastrarNovos = function (carga) {
        SALVAR(carga);
        $scope.cadastroCargaForm.$setPristine();
    };
    $scope.CANCELAR = redirecionarTabelas;
});
apps.service('CargasService', function (CargasResource) {
    this.getCarga = function (id) {
        return CargasResource.getCarga({id: id}).$promise;
    };
    this.LISTAR = function () {
        return CargasResource.LISTAR().$promise;
    };
    this.SALVAR = function (carga) {
        if (carga.id) {
            return CargasResource.ATUALIZAR({id: carga.id}, carga).$promise;
        } else {
            return CargasResource.SALVAR(carga).$promise;
        }
    };
    this.EXCLUIR = function (carga) {
        return CargasResource.EXCLUIR({id: carga.id}).$promise;
    };
});
apps.factory('CargasResource', function ($resource) {
    return $resource('http://localhost:3000/cargas/:id', {}, {
        ATUALIZAR: {
            method: 'PUT'
        },
        LISTAR: {
            method: 'GET',
            isArray: true
        },
        getCarga: {
            method: 'GET'
        },
        SALVAR: {
            method: 'POST'
        },
        EXCLUIR: {
            method: 'DELETE'
        }
    });
});