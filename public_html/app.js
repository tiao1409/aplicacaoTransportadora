var app = angular.module('empresaApp', ['ngRoute', 'ngResource']);
app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);
app.config(function ($routeProvider) {
    $routeProvider.when('/cadmotorista', {
        controller: 'CadastroMotoristaController',
        templateUrl: 'templates/cadmotorista.html'
    }).when('/cadmotorista/:id', {
        controller: 'CadastroMotoristaController',
        templateUrl: 'templates/cadmotorista.html'
    }).when('/tabela', {
        controller: 'TabelaEmpresasController',
        templateUrl: 'templates/tabela.html'
    }).otherwise('/tabela');
});
app.controller('TabelaEmpresasController', function ($scope, EmpresasService) {
    listar();
    function listar() {
        EmpresasService.listar().then(function (empresas) {
            $scope.empresas = empresas;
        });
    }
    $scope.excluir = function (empresa) {
        EmpresasService.excluir(empresa).then(listar);
    };
});
app.controller('CadastroMotoristaController', function ($routeParams, $scope, $location,
        EmpresasService) {
    var id = $routeParams.id;
    if (id) {
        EmpresasService.getEmpresa(id).then(function (empresa) {
            $scope.empresa = empresa;
        });
    } else {
        $scope.empresa = {};
    }
    function salvar(empresa) {
        $scope.empresa = {};
        EmpresasService.salvar(empresa);
    }
    function redirecionarTabela() {
        $location.path('/tabela');
    }
    $scope.salvar = function (empresa) {
        salvar(empresa).then(redirecionarTabela);
    };
    $scope.salvarCadastrarNovo = function (empresa) {
        salvar(empresa);
        $scope.cadastroMotoristaForm.$setPristine();
    };
    $scope.cancelar = redirecionarTabela;
});
app.service('EmpresasService', function (EmpresasResource) {

    this.getEmpresa = function (id) {
        return EmpresasResource.getEmpresa({id: id}).$promise;
    };
    this.listar = function () {
        return EmpresasResource.listar().$promise;
    };
    this.salvar = function (empresa) {
        if (empresa.id) {
            return EmpresasResource.atualizar({id: empresa.id}, empresa).$promise;
        } else {
            return EmpresasResource.salvar(empresa).$promise;
        }
    };
    this.excluir = function (empresa) {
        return EmpresasResource.excluir({id: empresa.id}).$promise;
    };
});
app.factory('EmpresasResource', function ($resource) {
    return $resource('http://localhost:3000/empresas/:id', {}, {
        atualizar: {
            method: 'PUT'
        },
        listar: {
            method: 'GET',
            isArray: true
        },
        getEmpresa: {
            method: 'GET'
        },
        salvar: {
            method: 'POST'
        },
        excluir: {
            method: 'DELETE'
        }
    });
});