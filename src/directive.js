define(['angular', 'Radial'], function (angular, Radial) {

    angular
        .module('radial', [])
        .directive('radial', ['$timeout', function (timer) {
            'use strict';

            return{
                scope: {
                    'radial': '='
                },
                restrict: 'AE',
                controller: ['$scope', function ($scope) {
                    var scop = $scope;
                    $scope.$watch(watchFn($scope.radial), function (vals) {

                    });

                    $scope.SOMETHING = function () {

                    };

                }],

                /**
                 * Compiles an HTML string or DOM into a template and produces a template function,
                 * which can then be used to link scope and the template together.
                 * @param tElem the template element for this directive
                 * @param the list of html attributes on the template element
                 * @param transclude the callback when we're ready to manipulate transcluded elements.
                 * for more info on transclusion, visit: https://docs.angularjs.org/api/ng/service/$compile
                 * @returns {{post: post}}
                 */
                compile: function (tElem, attrs, transclude) {
                    return {
                        post: function (scope, iElement, iAttrs, controller) {

                            //var config = parseAttrs(iAttrs);

                        }
                    };


                }
            };
        }])
        .directive('rdTpl', ['$compile',function ($compile) {
            return {
                restrict: 'A',
                scope: true,
                require: '^radial',
                compile: function (tEl,attrs) {


                    return {
                        post: function (scope, el, attrs, radialController) {

                            //var tpl = $compile(el)(scope);


                            scope.$watch(watchFn(scope.radial), function (vals) {
                                if (vals) {
                                    var _el = el;

                                    //todo: loop over vals and create copies
                                }
                            });


                        }



                    };
                }
            };
        }]);


    /**
     * Calls cb on any elements that have a certain classname
     * @param els the list of elements to apply cb to.
     * @param classname the classname to match els to cb with.
     * @param cb the callback to apply if the element has classname.
     */
    function applyByClassname(els, classname, cb) {
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el.classList) {
                for (var k = 0; k < el.classList.length; k++) {
                    if (el.classList[k] === classname) {
                        cb(el);
                    }
                }
            }
        }
    }

    /**
     * Custom ng-repeat
     */
    function repeatClone() {

    }

    /**
     * returns a function which returns watch, usefull for angualar's $watch function.
     * @param watch a value to watch.
     */
    function watchFn(watch) {
        return function () {
            return watch;
        };
    }

    /**
     * Parses and returns the attributes of the radial directive
     * @param attrs the hash of html attributes that we'll parse
     */
    function parseAttrs(attrs) {
        var ret = {};
        ret.classname = attrs.rdElClassname;
        ret.downBtn = document.getElementById(attrs.rdCcwbtn);
        ret.upBtn = document.getElementById(attrs.rdCwbtn);


        if (!ret.classname) {
            throw new Error('Radial requires a classname to be provided via:rd-el-classname=\'classname of radial elements\'');
        }
        return ret;
    }

});