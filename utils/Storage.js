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
export default class Storage {
    /**
     * The Storage Constructor
     * @constructor
     * @param {String}   name     The name of the storage.
     * @param {Boolean=} isSingle True to have a storage for a single value.
     */
    constructor(name, isSingle) {
        this.name     = name;
        this.isSingle = isSingle || false;
    }

    /**
     * Returns the data in the saved format
     * @param {(String|Number)=}                name
     * @param {(Boolean|Number|String|Object)=} defValue
     * @returns {(Boolean|Number|String|Object)}
     */
    get(name, defValue = null) {
        let content = defValue;
        if (!window.localStorage[this.getName(name)]) {
            return content;
        }
        content = window.localStorage[this.getName(name)];
        if (content === "true" || content === "false") {
            return content === "true";
        }
        if (isInteger(content)) {
            return parseInt(content, 10);
        }
        return JSON.parse(content);
    }

    /**
     * Saves the given data as a JSON object
     * @param {(Boolean|Number|String|Object)=} name  If this is a single value Storage use this param for the value
     * @param {(Boolean|Number|String|Object)=} value
     * @returns {(Boolean|Number|String|Object)}
     */
    set(name, value) {
        let setName  = name;
        let setValue = value;
        if (this.isSingle) {
            setValue = name;
            setName  = "";
        }
        window.localStorage[this.getName(setName)] = JSON.stringify(setValue);
        return value;
    }

    /**
     * Increases the Value by the given amount
     * @param {(String|Number)} name
     * @param {Number}          value
     * @returns {Number}
     */
    inc(name, value) {
        let setName  = String(name);
        let setValue = value;
        if (this.isSingle) {
            setValue = Number(name);
            setName  = "";
        }
        const key     = this.getName(setName);
        const content = Number(window.localStorage[key]) || 0;
        window.localStorage[key] = content + setValue;
        return content + setValue;
    }

    /**
     * Removes the data with the given name
     * @param {(String|Number)=} name
     * @returns {Void}
     */
    remove(name) {
        window.localStorage.removeItem(this.getName(name));
    }


    /**
     * Returns the key for the given name
     * @param {(String|Number)=} name
     * @returns {String}
     */
    getName(name) {
        return this.name + (name ? `.${name}` : "");
    }
}
