'use strict';

/**
 * Forgive me father for I have sinned, I have made a global variable...
 * only for a day
 * */

window.Radial = (function () {


    function Radial(config) {


        var elements = config.elements,
            numElsToShow = config.numElsToShow || 8,
            upBtn = config.upBtn,
            downBtn = config.downBtn,
            radius = config.radius || 200,
            centerX = config.x,
            centerY = config.y,
            rads = 2 * Math.PI,
            radsPerEl = rads / numElsToShow,
            rotateSpeed = (config.rotateSpeed !== undefined) ? Math.abs(config.rotateSpeed) : 0.02,
            accel = config.accel || 0,
            accelInc = config.accelInc ? Math.abs(config.accelInc) : 0.005,
            accelDec = config.accelDec ? Math.abs(config.accelDec) : 0.01,
            accelLim = config.accelLim ? Math.abs(config.accelLim) : 0.07,
            rotationFactor = -Math.PI/2,
            threshold = config.threshold || 0,
            thresholdCross = config.thresholdCross || function () {},
            feedElements = config.feedElements || true
            ;

        var mouseDown = 0;

        //array to hold elements which are not currently being displayed
        var elementStaging = [];
        var circleList;

        var elsToShow = buildDom(elements, numElsToShow);


        mapUpBtn(elsToShow, upBtn);
        mapDownBtn(elsToShow, downBtn);
        mapWheel(elsToShow);
        mapMouseUp();
        //initial positioning

        rotate(elsToShow, 0);

        /**
         * Wraps all HTMLNodes as RadialElements, removes extra nodes from the dom,
         * and wraps elements staying in the dom with wrappers.
         * We wrap the elements remaining so we don't have to
         * re-bind event listeners every time we shuffle new elements in.
         * @param els HTMLCollection of elements.
         * @param max The number of elements to show in the dom at once.
         * @returns {Array} array of elements which will be shown in the dom.
         */
        function buildDom(els, max) {
            if (!(els instanceof HTMLCollection)) {
                throw new Error("Radial requires an HTMLCollection");
            }

            elementStaging = createRadialElements(els);
            circleList = createCircularList(elementStaging,max);


            var domEls = [];

            //remove excess elements from dom
            for(var i=max;i<elementStaging.length;i++){
                document.body.removeChild(elementStaging[i].node);
            }


            for(var k=0;k<max;k++){
                var stage = elementStaging[k].node;
                var wrapped = wrapNode(stage, 'div');
                wrapped.className = stage.classList[0] + '-wrapper';
                domEls.push(wrapped);
            }
            return domEls;

        }
        /***
         * @description Wraps an html node with another node of type provided,
         * appending the newly wrapped element to the old parent
         * @param type: the type of node to wrap node with, ie: 'div','p'...
         * @param node: a node in the html document
         * */
        function wrapNode(node,type){
            if(!(node instanceof HTMLElement)){throw new Error("Cannot wrap a non-html element");}
            type = (typeof type === 'string') ? type : 'div';
            var newParent = document.createElement(type);
            var oldParent = node.parentNode;
            document.body.removeChild(node);
            newParent.appendChild(node);
            oldParent.appendChild(newParent);
            return newParent;
        }

        /**
         * Maps the up button to rotate a list of elements forward
         * @param els a list of elements to rotate
         * @param upbtn rotates els when held down
         */
        function mapUpBtn(els, upbtn) {
            upbtn.addEventListener('mousedown', function () {
                mouseDown = 1;
                window.requestAnimationFrame(function () {
                    rotate(els, rotateSpeed);
                });
            });
        }

        /**
         * Maps the down button to rotate a list of elements backward
         * @param els a list of elements to rotate
         * @param downbtn rotates els when held down
         */
        function mapDownBtn(els, downbtn) {
            downbtn.addEventListener('mousedown', function () {
                mouseDown = 1;
                window.requestAnimationFrame(function () {
                    rotate(els, -rotateSpeed);
                });
            });
        }

        /**
         * Slows down animations when the mouse is up
         */
        function mapMouseUp() {
            window.addEventListener('mouseup', function () {
                window.requestAnimationFrame(slowDown);
            });
        }

        /**
         * Maps the mouse wheel to the rotation function
         * @param els list of elements to map the wheel to
         */
        function mapWheel(els) {
            var wheel = true;
            window.addEventListener('mousewheel', function (e) {

                /**
                 * TODO: make sure the mouse is inside the wheel
                 * */

                window.requestAnimationFrame(function () {
                    mouseDown = 1;
                    rotate(els, e.deltaY / 600, function () {
                        slowDown(accelDec / 100000);
                    });
                }, wheel);
            });
        }

        /**
         * Sets the absolute position of el
         * @param el the element to set the position of
         * @param left X coordinate of the left side
         * @param top Y coordinate of the top side
         */
        function setPos(el, left, top) {
            el.style.top = top + 'px';
            el.style.left = left + 'px';
        }

        /**
         * Takes a list of elements and lays them out in an offset circle,
         * effectively rotating them each time it's called on them.
         * @param els the list of elements to lay out
         * @param direction the direction to rotate the elements in
         * @param cb what to do after they're rotated
         */
        function rotate(els, direction, cb) {

            accel = (accel > accelLim) ? accel : accel + accelInc;

            var delta = direction > 0 ? direction + accel : direction - accel;

            var prevRotationFactor = rotationFactor;
            rotationFactor += delta;

            for (var k = 0; k < els.length; k++) {
                var _el = els[k];

                /**
                 * Cartesian circle equation
                 * x = a + r cos t
                 * y = b + r cos t
                 * a,b = x/y of center of circle
                 * */

                //figure out the position on the circle before rotation is applied
                var oldRadians = prevRotationFactor - k * radsPerEl;
                var oldCirclePosition = unitCircle(oldRadians);


                var newRadians = rotationFactor - k * radsPerEl;
                var newCirclePosition = unitCircle(newRadians);

                //X and Y on the page
                var x = newCirclePosition.x * radius + centerX;
                var y = newCirclePosition.y * radius + centerY;


                if (oldCirclePosition.y < 0 && crossedThreshold(oldCirclePosition.x, threshold, delta)) {
                    afterThresholdCross(_el, delta);
                }

                setPos(_el, x, y);

            }

            if (cb) {
                cb();
            }
            if (mouseDown === 1) {
                window.requestAnimationFrame(function () {
                    rotate(els, direction, cb);
                });
            }
        }

        /**
         * Decreases delta over time
         * @param delta a constant rate of change.
         */
        function slowDown(delta) {
            accel -= accelDec;
            if (accel > 0) {
                window.requestAnimationFrame(function () {
                    slowDown(delta);
                });
            } else {
                mouseDown = 0;
                accel = 0;
            }
        }

        /***
         * Creates a circular list
         *
         * @param array the array to build the circular list from
         * @param end the last element of the part of the array shown.
         *
         *
         * example:
         * X:hidden
         * =:shown
         *  = = = X X
         *  1 2 3 4 5
         *      ^end
         *
         *      getNext()
         *
         *  X = = = X
         *  1 2 3 4 5
         *        ^end
         *
         *     getNext()
         *
         *
         *  x x = = =
         *  1 2 3 4 5
         *          ^end
         *
         *      getPrevious()
         *
         *  X = = = X
         *  1 2 3 4 5
         *        ^end
         */

        function createCircularList(array,end){
            var circlist = array;
            var beg = 0;
            var last = end-1;

            return {
                getNext : function(){
                    if(last === array.length-1){return circlist[last];}
                    beg++;
                    last++;
                    return circlist[last];
                },
                getPrevious:function(){
                    if(beg === 0){return circlist[beg];}
                    beg--;
                    last--;
                    return circlist[beg];
                }
            };
        }

        /**
         * @description Called after el crosses the provided threshold on the unit circle.
         * it applies the callback passed into the configuration, or a no-op
         *
         * @param delta which side el crossed the threshold from and how much
         * */
        function afterThresholdCross(el, delta) {

            var nextEl;

            if (delta > 0) {
                nextEl = circleList.getNext();
            } else {
                nextEl = circleList.getPrevious();
            }

            if(el.firstChild !== nextEl){
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }

                el.appendChild(nextEl.node);
            }

            thresholdCross(el);

        }


        /***
         * @description Maps radians to coordinates on the unit circle
         * @param rads size of the arc on the unit circle between the coordinates and 0
         * @returns {{x: number, y: number}} the X and y coordinates on the unit circle
         */

        function unitCircle(rads) {
            return {
                x: Math.cos(rads),
                y: Math.sin(rads)
            };
        }


        /**
         * Checks to see if X will cross threshold after inc is applied to it.
         * Cross means, go from greater to less, or less to greater
         *
         * @param x the number that's changing that may cross
         * @param threshold the number that's stationary that's being crossed
         * @param inc the ammount to change x by
         * @returns {boolean} true if x will cross threshold
         */
        function crossedThreshold(x, threshold, inc) {
            if (x < threshold && x + inc > threshold) {
                return true;
            } else if (x > threshold && x + inc < threshold) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Maps an array of html elements(or an HTMLCollection) to an array of RadialElements
         * @param els list of html elements
         * @returns {Array} array of RadialElements wrapping els
         */
        function createRadialElements(els) {
            var radialEls = [];
            for (var k = 0; k < els.length; k++) {
                var radialEl = {
                    node: els[k],
                    index: k
                };
                radialEls.push(new RadialElement(radialEl));
            }
            return radialEls;
        }

        /**
         *
         * A wrapper for an HTMLNode
         * data:{
         *  node:the html node,
         *  index: the position in radial's array of elements to show and hide(used to feed elements in and out)
         * }
         * */
        function RadialElement(data) {
            this.node = data.node;
        }

        /**
         * copies attributes of
         * @param from object which attributes are copied from
         * @param to object which attributes are copied to
         *
         * */
        function copy(from, to) {
            var clone = JSON.parse(JSON.stringify(from));

            function copyattrs(from, to) {
                for (var k in from) {
                    if (from.hasOwnProperty(k)) {
                        if (typeof from[k] === "object") {
                            copyattrs(from[k], to[k]);
                        }
                        to[k] = from[k];
                    }
                }
            }
            copyattrs(clone, to);
        }


    }


    return Radial;
})();