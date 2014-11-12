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
            {url:'abacus.jpg'},
            {url:'book.jpg'},
            {url:'chocolate.jpg'},
            {url:'chocolate2.jpg'},
            {url:'coffee.jpg'},
            {url:'controller.jpg'},
            {url:'crockpot.jpg'},
            {url:'flashdrive.jpg'},
            {url:'flashlight.jpg'},
            {url:'flowers.jpg'},
            {url:'laptopcover.jpg'},
            {url:'makeup.jpg'},
            {url:'movie.jpg'},
            {url:'shoes.jpg'},
            {url:'soccerball.jpg'},
            {url:'stroller.jpg'},
            {url:'watch.jpg'}
        ];

    }]);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
    });


});