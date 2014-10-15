'use strict';

/**
 * Forgive me father for I have sinned, I have made a global variable...
 * only for a day
 * */

window.Radial = (function () {



    /***
     *
     *
     * {
         *  elements: a live HTMLCollection of elements, these will form the
         *  upBtn: rotates the wheel clockwise
         *  downBtn: rotates the wheel counterclockwise
         * }
     *
     *
     * */
    function Radial(config) {

        var elements = config.elements,
                upBtn = config.upBtn,
                downBtn = config.downBtn,
                radius = config.radius || 200,
                centerX = config.x,
                centerY = config.y,
                rads = 2 * Math.PI,
                radsPerEl = rads / elements.length,
                rotateSpeed = (config.rotateSpeed !== undefined) ? Math.abs(config.rotateSpeed) : 0.02,
                accel = config.accel || 0,
                accelInc = config.accelInc ? Math.abs(config.accelInc) : 0.05,
                accelDec = config.accelDec ? Math.abs(config.accelDec) : 0.005,
                accelLim = config.accelLim ? Math.abs(config.accelLim) : 0.07,
                rotationFactor = 0
                ;

        var mouseDown = 0;


        mapUpBtn(elements, upBtn);
        mapDownBtn(elements, downBtn);
        mapWheel(elements);
        mapMouseUp();



        function mapUpBtn(els, upbtn) {
            upbtn.addEventListener('mousedown', function () {
                mouseDown = 1;
                window.requestAnimationFrame(function () {
                    rotate(els, rotateSpeed);
                });
            });
        }


        function mapDownBtn(els, downbtn) {
            downbtn.addEventListener('mousedown', function () {
                mouseDown = 1;
                window.requestAnimationFrame(function () {
                    rotate(els, -rotateSpeed);
                });
            });
        }

        function mapMouseUp() {
            window.addEventListener('mouseup', function () {
                window.requestAnimationFrame(function () {
                    slowDown(0);
                });
            });
        }

        function mapWheel(els) {
            window.addEventListener('mousewheel', function (e) {
                window.requestAnimationFrame(function () {
                    mouseDown = 1;
                    rotate(els, e.deltaY / 1000, function () {
                        slowDown(0);
                    });
                });
            });
        }

        function setPos(el, left, top) {
            el.style.top = top + 'px';
            el.style.left = left + 'px';
        }

        function rotate(els, direction, cb) {

            accel = (accel > accelLim) ? accel : accel + accelInc;
            rotationFactor += direction > 0 ? direction + accel : direction - accel;

            for (var k = 0; k < els.length; k++) {
                var _el = els[k];

                /**
                 * Cartesian circle equation
                 * x = a + r cos t
                 * y = b + r cos t
                 * a,b = x/y of center of circle
                 * */
                var x = Math.cos(rotationFactor + k * radsPerEl) * radius + wheelX;
                var y = Math.sin(rotationFactor + k * radsPerEl) * radius + wheelY;

                setPos(_el, x, y);

            }

            if (cb) {cb();}
            if (mouseDown === 1) {
                window.requestAnimationFrame(function () {
                    rotate(els, direction, cb);
                });
            }
        }

        function slowDown(delta) {
            accel = (delta !== undefined) ? accel - delta : accel - accelDec;
            if (accel > 0) {
                window.requestAnimationFrame(slowDown);
            } else {
                mouseDown = 0;
                accel = 0;
            }
        }


    }


    return Radial;
})();