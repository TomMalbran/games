/**
 * Creates a new List. A list lets you add and remove elements at the current position
 * of the iterator, which starts at the start of the list and can be moved with the functions.
 */
let List = (function () {
    "use strict";


    /**
     * The List Node Class
     * @private
     */
    class Node {
        /**
         * The List Node Constructor
         * @constructor
         * @param {*}    data
         * @param {Node} prev
         * @param {Node} next
         */
        constructor(data, prev, next) {
            this.data = data;
            this.prev = prev;
            this.next = next;
        }
    }



    /**
     * The List Iterator Class
     * @private
     */
    class Iterator {
        /**
         * The List Iterator Constructor
         * @constructor
         * @param {List} list
         * @param {Node} prev
         * @param {Node} next
         */
         constructor(list, prev, next) {
            this.list      = list;
            this.previows  = prev;
            this.following = next;
        }

        /**
         * Moves to the next element if there is one
         * @returns {Void}
         */
        next() {
            if (this.hasNext()) {
                this.previows  = this.following;
                this.following = this.following.next;
            }
        }

        /**
         * Moves to the previews element if there is one
         * @returns {Void}
         */
        prev() {
            if (this.hasPrev()) {
                this.following = this.previows;
                this.previows  = this.previows.prev;
            }
        }

        /**
         * Checks if there is a next elements (from the current one)
         * @returns {Boolean}
         */
        hasNext() {
            return this.following !== null;
        }

        /**
         * Checks if there is a previews element (from the current one)
         * @returns {Boolean}
         */
        hasPrev() {
            return this.previows !== null;
        }

        /**
         * Returns the following elements data
         * @returns {*}
         */
        getNext() {
            if (this.hasNext()) {
                return this.following.data;
            }
        }

        /**
         * Returns the previws elements data
         * @returns {*}
         */
        getPrev() {
            if (this.hasPrev()) {
                return this.previows.data;
            }
        }

        /**
         * Removes the follwing element and sets the next one as the new following element
         * @returns {Void}
         */
        removeNext() {
            // Cant remove next if there isnt one
            if (!this.hasNext()) {
                return;
            }

            if (this.following.next) {
                this.following.next.prev = this.following.prev;
            } else {
                this.list.tail = this.following.prev;
            }

            if (this.following.prev) {
                this.following.prev.next = this.following.next;
            } else {
                this.list.head = this.following.next;
            }

            this.following    = this.following.next;
            this.list.length -= 1;
        }

        /**
         * Removes the previows element and sets the prev one as the new previows element
         * @returns {Void}
         */
        removePrev() {
            if (this.hasPrev()) {
                this.prev();
                this.removeNext();
            }
        }
    }



    /**
     * The List Class
     * @constructor
     */
    class List {
        constructor() {
            this.head   = null;
            this.tail   = null;
            this.length = 0;
        }

        /**
         * Adds the element between the previows and following
         * @private
         * @param {*}    item
         * @param {Node} prev
         * @param {Node} next
         * @returns {Node}
         */
        add(item, prev, next) {
            const node = new Node(item, prev, next);

            if (this.head === null) {
                this.head = node;
                this.tail = node;
            } else if (prev) {
                this.tail.next = node;
                this.tail      = node;
            } else if (next) {
                this.head.prev = node;
                this.head      = node;
            }

            this.length += 1;
            return node;
        }

        /**
         * Adds the item at the beggining of the list
         * @param {*} item
         * @returns {Iterator}
         */
        addFirst(item) {
            this.add(item, null, this.head);
            return this.iterate();
        }

        /**
         * Adds the item at the end of the list
         * @param {*} item
         * @returns {Iterator}
         */
        addLast(item) {
            this.add(item, this.tail, null);
            return this.iterateLast();
        }

        /**
         * Returns the data from the first element
         * @returns {*}
         */
        first() {
            if (this.head) {
                return this.head.data;
            }
            return null;
        }

        /**
         * Returns the data from the last element
         * @returns {*}
         */
        last() {
            if (this.tail) {
                return this.tail.data;
            }
            return null;
        }

        /**
         * Returns true if the queue is empty, and false otherwise
         * @returns {Boolean}
         */
        isEmpty() {
            return this.head === null;
        }

        /**
         * Returns the size of the list
         * @returns {Number}
         */
        size() {
            return this.length;
        }

        /**
         * Creates and returns a new Iterator at the start of the list
         * @returns {Iterator}
         */
        iterate() {
            if (this.head) {
                return new Iterator(this, null, this.head);
            }
            return null;
        }

        /**
         * Creates and returns a new Iterator at the end of the list
         * @returns {Iterator}
         */
        iterateLast() {
            if (this.tail) {
                return new Iterator(this, this.tail, null);
            }
            return null;
        }

        /**
         * Iterates througth the list calling the callback with the data as parameter
         * @param {Function(*, Number)}
         * @returns {Void}
         */
        forEach(callback) {
            if (this.head) {
                const it    = this.iterate();
                let   count = 0;
                while (it.hasNext()) {
                    callback(it.getNext(), count);
                    it.next();
                    count += 1;
                }
            }
        }

        /**
         * Iterates througth the list calling the callback with the data as parameter,
         * but it breaks the loop if the function returns true
         * @param {Function(*, Number): Boolean}
         * @returns {Boolean}
         */
        some(callback) {
            if (this.head) {
                const it    = this.iterate();
                let   count = 0;
                while (it.hasNext()) {
                    if (callback(it.getNext(), count)) {
                        return true;
                    }
                    it.next();
                    count += 1;
                }
            }
            return false;
        }
    }


    return List;
}());
