let Utils = (function () {
    "use strict";

    return {
        /**
         * Returns a random value between from and to
         * @param {Number} from
         * @param {Number} to
         * @returns {Number}
         */
        rand(from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        },

        /**
         * Returns a random item from the given array
         * @param {Array} array
         * @returns {*}
         */
        randArray(array) {
            const index = Utils.rand(0, array.length - 1);
            return array[index];
        },

        /**
         * Returns the value higher than the min and lower than the max
         * @param {Number} value
         * @param {Number} min
         * @param {Number} max
         * @returns {Number}
         */
        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },

        /**
         * Adds the separator every 3 decimals
         * @param {Number} number
         * @param {String} separator
         * @returns {String}
         */
        formatNumber(number, separator) {
            let result = "", count = 0, char;
            number = String(number);

            for (let i = number.length - 1; i >= 0; i -= 1) {
                char   = number.charAt(i);
                count += 1;
                result = char + result;

                if (count === 3 && i > 0) {
                    result = separator + result;
                    count  = 0;
                }
            }
            return result;
        },

        /**
         * Returns the angle between two values
         * @param {Number} x
         * @param {Number} y
         * @returns {Number}
         */
        calcAngle(x, y) {
            let angle = Math.round(Math.abs(Math.atan(y / x) * 180 / Math.PI));
            if (y < 0 && x >= 0) {
                angle = 360 - angle;
            } else if (y < 0 && x < 0) {
                angle = 180 + angle;
            } else if (y >= 0 && x < 0) {
                angle = 180 - angle;
            }
            return angle;
        },

        /**
         * Returns the given number as Even
         * @param {Number} number
         * @returns {Number}
         */
        toEven(number) {
            const rounded = Math.round(number);
            return rounded % 2 === 1 ? rounded + 1 : rounded;
        },



        /**
         * Returns an rgba string
         * @param {Number} red
         * @param {Number} green
         * @param {Number} blue
         * @param {Number} alpha
         * @returns {String}
         */
        rgba(red, green, blue, alpha) {
            return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        },

        /**
         * Returns the number with a px suffix
         * @param {Number} value
         * @returns {String}
         */
        toPX(value) {
            return `${Math.round(value)}px`;
        },

        /**
         * Returns the number with a em suffix
         * @param {Number} value
         * @returns {String}
         */
        toEM(value) {
            return `${value}em`;
        },

        /**
         * Returns the rotate CSS property
         * @param {Number} value
         * @returns {String}
         */
        rotate(deg) {
            return `rotate(${deg}deg)`;
        },

        /**
         * Returns the translate CSS property
         * @param {Number} x
         * @param {Number} y
         * @returns {String}
         */
        translate(x, y) {
            return `translate(${x}px, ${y}px)`;
        },



        /**
         * Returns the closest element with an action
         * @param {Event}   event
         * @param {String=} action
         * @returns {DOMElement}
         */
        getTarget(event, action) {
            let element = event.target;
            if (action) {
                while (element.parentElement && element.dataset.action !== action) {
                    element = element.parentElement;
                }
            } else {
                while (element.parentElement && !element.dataset.action) {
                    element = element.parentElement;
                }
            }
            return element;
        },

        /**
         * Returns the position of an Element in the document
         * @param {DOMElement} element
         * @returns {{top: Number, left: Number}}
         */
        getPosition(element) {
            let top = 0, left = 0;
            if (element.offsetParent !== undefined) {
                top  = element.offsetTop;
                left = element.offsetLeft;

                while (element.offsetParent && typeof element.offsetParent === "object") {
                    element = element.offsetParent;
                    top  += element.offsetTop;
                    left += element.offsetLeft;
                }
            } else if (element.x !== undefined) {
                top  = element.y;
                left = element.x;
            }
            return { top, left };
        },

        /**
         * Sets the position of the given element or elements
         * @param {DOMElement} element
         * @param {Number} top
         * @param {Number} lefet
         * @returns {Void}
         */
        setPosition(element, top, left) {
            element.style.top  = `${top}px`;
            element.style.left = `${left}px`;
        },

        /**
         * Removes the Element from the DOM
         * @param {DOMElement} element
         * @returns {Void}
         */
        removeElement(element) {
            const parent = element.parentNode;
            if (parent) {
                parent.removeChild(element);
            }
        },

        /**
         * Returns true if the given Point is in the Bounds
         * @param {Number}  top
         * @param {Number}  left
         * @param {Object}  bounds
         * @param {Number=} scrollTop
         * @returns {Boolean}
         */
        inBounds(top, left, bounds, scrollTop = 0) {
            return (
                top > bounds.top - scrollTop && top < bounds.bottom &&
                left > bounds.left && left < bounds.right
            );
        },



        /**
         * Returns the Mouse Position
         * @param {Event} event
         * @returns {{top: Number, left: Number}}
         */
        getMousePos(event) {
            let top = 0, left = 0;
            if (!event) {
                event = window.event;
            }
            if (event.pageX) {
                top  = event.pageY;
                left = event.pageX;
            } else if (event.clientX) {
                top  = event.clientY + (document.documentElement.scrollTop  || document.body.scrollTop);
                left = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            }
            return { top, left };
        },

        /**
         * Unselects the elements
         * @returns {Void}
         */
        unselect() {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else if (document.selection) {
                document.selection.empty();
            }
        }
    };
}());
