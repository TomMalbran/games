/**
 * Spider History
 */
export default class History {

    /**
     * Spider History constructor
     */
    constructor() {
        this.reset();
    }

    /**
     * Resets the History
     * @returns {Void}
     */
    reset() {
        this.stack   = [];
        this.current = -1;
    }

    /**
     * Restores the History
     * @param {Object[]} stack
     * @param {Number}   current
     * @returns {Void}
     */
    restore(stack, current) {
        this.stack   = stack;
        this.current = current;
    }



    /**
     * Returns true if we can Undo
     * @returns {Boolean}
     */
    canUndo() {
        return this.current > -1;
    }

    /**
     * Returns true if we can Redo
     * @returns {Boolean}
     */
    canRedo() {
        return this.current < this.stack.length - 1;
    }

    /**
     * Undoes the last action and returns it
     * @returns {Object}
     */
    undoAction() {
        this.current -= 1;
        return this.stack[this.current + 1];
    }

    /**
     * Redoes the last action and returns it
     * @returns {Object}
     */
    redoAction() {
        this.current += 1;
        return this.stack[this.current];
    }

    /**
     * Returns true if we should undo again
     * @returns {Boolean}
     */
    undoAgain() {
        if (this.canUndo()) {
            const type = this.stack[this.current + 1].type;
            return type === "filp" || type === "foundation";
        }
        return false;
    }

    /**
     * Returns true if we should redo again
     * @returns {Boolean}
     */
    redoAgain() {
        if (this.canRedo()) {
            const type = this.stack[this.current + 1].type;
            return type === "filp" || type === "foundation";
        }
        return false;
    }



    /**
     * Adds an action to the stack
     * @param {String} type
     * @param {Object} data
     * @returns {Void}
     */
    addAction(type, data) {
        if (this.current !== this.stack.length - 1) {
            this.stack.splice(this.current + 1);
        }
        this.stack.push({ type, ...data });
        this.current = this.stack.length - 1;
    }

    /**
     * Adds a Turn action to the stack
     * @param {Number} column
     * @returns {Void}
     */
    addFilp(column) {
        this.addAction("filp", { column });
    }

    /**
     * Adds a Movement action to the stack
     * @param {Number} from
     * @param {Number} to
     * @param {Number} amount
     * @returns {Void}
     */
    addMove(from, to, amount) {
        this.addAction("move", { from, to, amount });
    }

    /**
     * Adds a Deal action to the stack
     * @returns {Void}
     */
    addDeal() {
        this.addAction("deal");
    }

    /**
     * Adds a Foundation action to the stack
     * @param {Number} column
     * @returns {Void}
     */
    addFoundation(column) {
        this.addAction("foundation", { column });
    }
}
