/**
 * Returns a random value between from and to
 * @param {Number} from
 * @param {Number} to
 * @returns {Number}
 */
function rand(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

/**
 * Returns a random item from the given array
 * @param {Array} array
 * @returns {*}
 */
function randArray(array) {
    const index = rand(0, array.length - 1);
    return array[index];
}

/**
 * Returns the value higher than the min and lower than the max
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Adds the separator every 3 decimals
 * @param {Number} value
 * @param {String} separator
 * @returns {String}
 */
function formatNumber(value, separator) {
    const number = String(value);
    let   result = "";
    let   count  = 0;

    for (let i = number.length - 1; i >= 0; i -= 1) {
        const char = number.charAt(i);
        count += 1;
        result = char + result;

        if (count === 3 && i > 0) {
            result = separator + result;
            count  = 0;
        }
    }
    return result;
}

/**
 * Returns the distance between pos and other
 * @param {{top: Number, left: Number}} pos
 * @param {{top: Number, left: Number}} other
 * @returns {Number}
 */
function dist(pos, other) {
    return Math.hypot(pos.top - other.top, pos.left - other.left);
}

/**
 * Returns the angle between two values
 * @param {Number} x
 * @param {Number} y
 * @returns {Number}
 */
function calcAngle(x, y) {
    let angle = Math.round(Math.abs(Math.atan(y / x) * 180 / Math.PI));
    if (y < 0 && x >= 0) {
        angle = 360 - angle;
    } else if (y < 0 && x < 0) {
        angle = 180 + angle;
    } else if (y >= 0 && x < 0) {
        angle = 180 - angle;
    }
    return angle;
}

/**
 * Returns the given number as Even
 * @param {Number} number
 * @returns {Number}
 */
function toEven(number) {
    const rounded = Math.round(number);
    return rounded % 2 === 1 ? rounded + 1 : rounded;
}

/**
 * Returns the percent between the given numbers
 * @param {Number} number
 * @param {Number} total
 * @returns {Number}
 */
function toPercent(number, total) {
    if (!total) {
        return 0;
    }
    return Math.round((number * 100 / total) * 10) / 10;
}

/**
 * Parses the time and returns an array of hours, minutes and seconds
 * @param {Number} time
 * @returns {String[]}
 */
function parseTime(time) {
    const hours   = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60) - hours * 60;
    const seconds = time - minutes * 60 - hours * 3600;
    const parts   = [];

    if (hours > 0) {
        parts.push(hours < 10 ? `0${hours}` : String(hours));
    }
    parts.push(minutes < 10 ? `0${minutes}` : String(minutes));
    parts.push(seconds < 10 ? `0${seconds}` : String(seconds));
    return parts;
}

/**
 * Parses the time and returns an string of hours, minutes and seconds
 * @param {Number} time
 * @returns {String}
 */
function timeToString(time) {
    const hours   = Math.floor(time / 3600);
    const minutes = Math.floor(time / 60) - hours * 60;
    const seconds = time - minutes * 60 - hours * 3600;
    const parts   = [];

    if (hours > 0) {
        parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
        parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    }
    if (seconds > 0) {
        parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
    }
    return parts.join(" ");
}



/**
 * Returns an rgba string
 * @param {Number} red
 * @param {Number} green
 * @param {Number} blue
 * @param {Number} alpha
 * @returns {String}
 */
function rgba(red, green, blue, alpha) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

/**
 * Returns the number with a px suffix
 * @param {Number} value
 * @returns {String}
 */
function toPX(value) {
    return `${Math.round(value)}px`;
}

/**
 * Returns the number with a em suffix
 * @param {Number} value
 * @returns {String}
 */
function toEM(value) {
    return `${value}em`;
}

/**
 * Returns the rotate CSS property
 * @param {Number} value
 * @returns {String}
 */
function rotate(value) {
    return `rotate(${value}deg)`;
}

/**
 * Returns the translate CSS property
 * @param {Number} x
 * @param {Number} y
 * @returns {String}
 */
function translate(x, y) {
    return `translate(${x}px, ${y}px)`;
}



/**
 * Returns the HTML Element from the Event
 * @param {MouseEvent} event
 * @returns {HTMLElement}
 */
function getElement(event) {
    // @ts-ignore
    return event.target;
}

/**
 * Returns the closest element with an action
 * @param {Event}     event
 * @param {...String} actions
 * @returns {HTMLElement}
 */
function getTarget(event, ...actions) {
    /** @type {HTMLElement} */
    let element = event.target;

    if (actions && actions.length) {
        while (element.parentElement && !actions.includes(element.dataset.action)) {
            element = element.parentElement;
        }
        if (actions.includes(element.dataset.action)) {
            return element;
        }
        return null;
    }

    while (element.parentElement && !element.dataset.action) {
        element = element.parentElement;
    }
    return element;
}

/**
 * Returns the closest element with an action
 * @param {Event} event
 * @returns {HTMLElement}
 */
function getCloseTarget(event) {
    // @ts-ignore
    return event.target.dataset.action ? event.target : event.target.parentElement;
}

/**
 * Sets the position of the given element or elements
 * @param {HTMLElement} element
 * @param {Number}      top
 * @param {Number}      left
 * @returns {Void}
 */
function setPosition(element, top, left) {
    element.style.top  = `${top}px`;
    element.style.left = `${left}px`;
}

/**
 * Removes the Element from the DOM
 * @param {HTMLElement} element
 * @returns {Void}
 */
function removeElement(element) {
    const parent = element.parentNode;
    if (parent) {
        parent.removeChild(element);
    }
}

/**
 * Returns true if the given Position is in the Bounds
 * @param {{top: Number, left: Number}} pos
 * @param {Object}                      bounds
 * @param {Number=}                     scrollTop
 * @param {Number=}                     scrollLeft
 * @returns {Boolean}
 */
function inBounds(pos, bounds, scrollTop = 0, scrollLeft = 0) {
    const top  = pos.top  - scrollTop;
    const left = pos.left - scrollLeft;
    return (
        top  > bounds.top  && top  < bounds.bottom &&
        left > bounds.left && left < bounds.right
    );
}

/**
 * Returns true if the given Position is in the Element
 * @param {{top: Number, left: Number}} pos
 * @param {HTMLElement}                 element
 * @param {Number=}                     scrollTop
 * @param {Number=}                     scrollLeft
 * @returns {Boolean}
 */
function inElement(pos, element, scrollTop = 0, scrollLeft = 0) {
    const bounds = element.getBoundingClientRect();
    return inBounds(pos, bounds, scrollTop, scrollLeft);
}



/**
 * Returns the Mouse Position
 * @param {MouseEvent} event
 * @param {Boolean=}   withScroll
 * @returns {{top: Number, left: Number}}
 */
function getMousePos(event, withScroll = true) {
    let top  = 0;
    let left = 0;
    if (event.pageX) {
        top  = event.pageY;
        left = event.pageX;
    } else if (event.clientX) {
        top  = event.clientY;
        left = event.clientX;
        if (withScroll) {
            top  += document.documentElement.scrollTop  || document.body.scrollTop;
            left += document.documentElement.scrollLeft || document.body.scrollLeft;
        }
    }
    return { top, left };
}

/**
 * Unselects the elements
 * @returns {Void}
 */
function unselect() {
    window.getSelection().removeAllRanges();
}



// The public API
export default {
    rand,
    randArray,
    clamp,
    formatNumber,
    dist,
    calcAngle,
    toEven,
    toPercent,
    parseTime,
    timeToString,

    rgba,
    toPX,
    toEM,
    rotate,
    translate,

    getElement,
    getTarget,
    getCloseTarget,
    setPosition,
    removeElement,
    inBounds,
    inElement,

    getMousePos,
    unselect,
};
