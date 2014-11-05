define(['../angular', 'Radial'], function (angular, Radial) {

    angular
        .module('radial', [])
        .directive('radial', ['$compile', function ($compile) {
            'use strict';

            return{
                scope: {
                    'radial': '='
                },
                restrict: 'AE',
                transclude: 'true',

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
                        post: function (scope, iElement, iAttrs, controller, transclude) {

                            var config = parseAttrs(iAttrs);

                            for (var k = 0; k < scope.radial.length; k++) {
                                var data = scope.radial[k];
                                var newScope = scope.$new(true, scope);
                                for (var z in data) {
                                    newScope[z] = data[z];
                                }

                                //TODO: extract anonymous function into a function-generater
                                transclude(newScope, function (clone, scope) {
                                    var compiled = $compile(clone)(scope);
                                    iElement.append(compiled);
                                });
                            }

                            Radial(config);

                        }
                    };


                }
            };
        }]);


    /**
     * Parses and returns the attributes of the radial directive
     * @param attrs the hash of html attributes that we'll parse
     */
    function parseAttrs(attrs) {
        var ret = {};
        ret.className = attrs.rdElClassname;
        ret.downBtn = document.getElementById(attrs.rdCcwbtn);
        ret.upBtn = document.getElementById(attrs.rdCwbtn);

        if (!ret.className) {
            throw new Error('Radial requires a classname to be provided via:rd-el-classname=\'classname of radial elements\'');
        }
        return ret;
    }

});