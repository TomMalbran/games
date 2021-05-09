/**
 * Creates a new Storage. A storage uses local storage capabilities to save JSON data
 */
const Storage = (function () {
    "use strict";


    /**
     * Returns true if local storage is supported
     * @returns {Boolean}
     */
    function supportsStorage() {
        return window.localStorage !== "undefined" && window.localStorage !== null;
    }

    /**
     * Returns true if the string is an integer
     * @param {String} string
     * @returns {Boolean}
     */
    function isInteger(string) {
        const validChars = "0123456789-";
        let   isNumber   = true;

        for (let i = 0; i < string.length && isNumber === true; i += 1) {
            const char = string.charAt(i);
            if (!validChars.includes(char)) {
                isNumber = false;
            }
        }
        return isNumber;
    }


    /**
     * The Storage
     */
    class Storage {
        /**
         * The Storage Constructor
         * @constructor
         * @param {String}   name     The name of the storage.
         * @param {Boolean=} isSingle True to have a storage for a single value.
         */
        constructor(name, isSingle) {
            this.name     = name;
            this.isSingle = isSingle || false;
            this.supports = supportsStorage();
        }

        /**
         * Returns the data in the saved format
         * @param {String} name
         * @returns {(Boolean|Number|String|Object)}
         */
        get(name) {
            let content = null;
            if (this.supports && window.localStorage[this.getName(name)]) {
                content = window.localStorage[this.getName(name)];
                if (content === "true" || content === "false") {
                    content = content === "true";
                } else if (isInteger(content)) {
                    content = parseInt(content, 10);
                } else {
                    content = JSON.parse(content);
                }
            }
            return content;
        }

        /**
         * Saves the given data as a JSON object
         * @param {(Boolean|Number|String|Object)} name  If this is a single value Storage use this param for the value
         * @param {(Boolean|Number|String|Object)} value
         * @returns {Void}
         */
        set(name, value) {
            if (this.supports) {
                if (this.isSingle) {
                    value = name;
                    name  = "";
                }
                window.localStorage[this.getName(name)] = JSON.stringify(value);
            }
        }

        /**
         * Removes the data with the given name
         * @param {String=} name
         * @returns {Void}
         */
        remove(name) {
            if (this.supports) {
                window.localStorage.removeItem(this.getName(name));
            }
        }


        /**
         * Returns the key for the given name
         * @param {String=} name
         * @returns {String}
         */
        getName(name) {
            return this.name + (name ? `.${name}` : "");
        }

        /**
         * Returns true if local storage is supported
         * @returns {Boolean}
         */
        isSupported() {
            return this.supports;
        }
    }



    return Storage;
}());
