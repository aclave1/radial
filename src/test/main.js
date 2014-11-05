require.config({
    paths:{
        'angular':'angular',
        'radial':'../radial'
    },
    shim: {
        angular: {exports: 'angular'},
        priority: [
            'angular'
        ]
    }
});
require(['angular','radial','../adapters/directive'], function (angular,Radial) {
    'use strict';
    angular.module('app',['radial']).controller('AppCtrl',['$scope',function($scope){


        $scope.radial = [
            {url:'flowers.jpg'},
            {url:'flashdrive.jpg'},
            {url:'abacus.jpg'},
            {url:'book.jpg'},
            {url:'chocolate.jpg'},
            {url:'chocolate2.jpg'},
            {url:'coffee.jpg'},
            {url:'crockpot.jpg'},
            {url:'controller.jpg'},
            {url:'watch.jpg'},
            {url:'movie.jpg'}
        ];

    }]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
    });


});