require.config({
    paths:{
        'angular':'angular'
    },
    shim: {
        angular: {exports: 'angular'},
        priority: [
            'angular'
        ]
    }
});
require(['angular','Radial','directive'], function (angular,Radial) {

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