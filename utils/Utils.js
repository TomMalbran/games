/*jslint browser: true */

var Utils = (function () {
	"use strict";

	return {
		/**
		 * Request Animation Frame shim
		 * @param {function} callback
		 */
		requestAnimationFrame: function (callback) {
			var f = window.requestAnimationFrame       ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame    ||
					window.msRequestAnimationFrame     ||
					window.oRequestAnimationFrame      ||
					function (callback, element) {
						window.setTimeout(callback, 1000 / 60);
					};
			return f(callback);
		},
		
		/**
		 * Cancel Animation Frame shim
		 * @param {string} id
		 */
		cancelAnimationFrame: function (id) {
			var f = window.cancelRequestAnimationFrame       ||
					window.webkitCancelRequestAnimationFrame ||
					window.mozCancelRequestAnimationFrame    ||
					window.msCancelRequestAnimationFrame     ||
					window.oCancelRequestAnimationFrame      ||
					function (id) { clearTimeout(id); };
			return f(id);
		},
	
	
		/**
		 * Returns true if the browser supports Local Storage
		 * @return {boolean}
		 */
		supportsStorage: function () {
			return window.localStorage !== "undefined" && window.localStorage !== null;
		},
		
		/**
		 * Returns true if the browser supports Audio
		 * @return {boolean}
		 */
		supportsAudio: function () {
			return !!document.createElement("audio").canPlayType;
		},
		
		/**
		 * Returns true if the browser supports MP3 Audio
		 * @return {boolean}
		 */
		supportsMP3: function () {
			var a = document.createElement("audio");
			return !!(a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, ""));
		},
		
		/**
		 * Returns true if the browser supports OGG Audio
		 * @return {boolean}
		 */
		supportsOGG: function () {
			var a = document.createElement("audio");
			return !!(a.canPlayType && a.canPlayType("audio/ogg; codecs='vorbis'").replace(/no/, ""));
		},
		
		
		/**
		 * Returns a random value between from and to
		 * @param {number} from
		 * @param {number} to
		 * @return {number}
		 */
		rand: function (from, to) {
			return Math.floor(Math.random() * (to - from + 1) + from);
		},
	
		/**
		 * Adds the separator every 3 decimals
		 * @param {number} number
		 * @param {string} separator
		 * @return {string}
		 */
		formatNumber: function (number, separator) {
			var result = "", count = 0, i, char;
			number = String(number);
			
			for (i = number.length - 1; i >= 0; i -= 1) {
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
		 * Cross-browser CSS3 Transform property
		 * @param {DOMElement} element
		 * @param {string} transform
		 */
		setTransform: function (element, transform) {
			["WebkitTransform", "MozTransform", "OTransform", "transform"].some(function (property) {
				if (document.body.style.hasOwnProperty(property)) {
					element.style[property] = transform;
					return true;
				}
				return false;
			});
		},
		
		/**
		 * Cross-browser CSS3 Transform-Origin property
		 * @param {DOMElement} element
		 * @param {string} origin
		 */
		setOrigin: function (element, origin) {
			["WebkitTransformOrigin", "MozTransformOrigin", "OTransformOrigin", "transformOrigin"].some(function (property) {
				if (document.body.style.hasOwnProperty(property)) {
					element.style[property] = origin;
					return true;
				}
				return false;
			});
		},
	
	
		/**
		 * Returns the position of an Element in the document
		 * @param {DOMElement} element
		 */
		getPosition: function (element) {
			var posTop = 0, posLeft = 0;
			if (typeof element.offsetParent !== "undefined") {
				posTop  = element.offsetTop;
				posLeft = element.offsetLeft;
				
				while (element.offsetParent && typeof element.offsetParent === "object") {
					element = element.offsetParent;
					posTop  += element.offsetTop;
					posLeft += element.offsetLeft;
				}
			} else if (typeof element.x !== "undefined") {
				posTop  = element.y;
				posLeft = element.x;
			}
			return { top: posTop, left: posLeft };
		},
		
		/**
		 * Sets the position of the given element or elements
		 * @param {DOMElement} element
		 * @param {number} top
		 * @param {number} lefet
		 */
		setPosition: function (element, top, left) {
			element.style.top  = top  + "px";
			element.style.left = left + "px";
		},
		
		/**
		 * Removes the Element from the DOM
		 * @param {DOMElement} element
		 */
		removeElement: function (element) {
			var parent = element.parentNode;
			parent.removeChild(element);
		},
	
	
		/**
		 * Returns the Mouse Position
		 * @param {Event} event
		 */
		getMousePos: function (event) {
			var posTop = 0, posLeft = 0;
			
			if (!event) {
				event = window.event;
			}
			if (event.pageX) {
				posTop  = event.pageY;
				posLeft = event.pageX;
			} else if (event.clientX) {
				posTop  = event.clientY + (document.documentElement.scrollTop  || document.body.scrollTop);
				posLeft = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
			}
			return { top: posTop, left: posLeft };
		},
	
		/**
		 * Unselects the elements
		 */
		unselect: function () {
			if (window.getSelection) {
				window.getSelection().removeAllRanges();
			} else if (document.selection) {
				document.selection.empty();
			}
		}
	};
}());