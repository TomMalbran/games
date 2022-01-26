/**
 * The Queue Class
 * A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
export default class Queue {
    /**
     * The Queue Constructor
     * @constructor
     */
    constructor() {
        this.head    = null;
        this.tail    = null;
        this.current = null;
        this.length  = 0;
    }

    /**
     * Enqueues the given item
     * @param {*} item
     */
    enqueue(item) {
        const node = {
            data : item,
            next : null
        };

        if (!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
        this.length += 1;
    }

    /**
     * Dequeues and returns the first item in the Queue. If the Queue is empty it returns null.
     * @returns {?*}
     */
    dequeue() {
        if (this.head) {
            const aux = this.head;
            this.head = this.head.next;
            this.length -= 1;
            return aux.data;
        }
        return null;
    }



    /**
     * Returns the first element of the queue or null if the Queue is empty
     * @returns {?*}
     */
    get first() {
        return this.head ? this.head.data : null;
    }

    /**
     * Returns the last element of the queue or null if the Queue is empty
     * @returns {?*}
     */
    get last() {
        return this.tail ? this.tail.data : null;
    }

    /**
     * Returns the size of the queue
     * @returns {Number}
     */
    get size() {
        return this.length;
    }

    /**
     * Returns true if the queue is empty, and false otherwise
     * @returns {Boolean}
     */
    get isEmpty() {
        return !this.head;
    }



    /**
     * Starts the iterator at the head of the queue
     */
    iterate() {
        this.current = this.head;
    }

    /**
     * Moves the iterator to the next element
     */
    next() {
        if (this.current) {
            this.current = this.current.next;
        }
    }

    /**
     * Returns the current element of the Queue or null if there isn't one
     */
    item() {
        return this.current ? this.current.data : null;
    }

    /**
     * Returns true if there are more elements after the current one
     * @returns {Boolean}
     */
    hasNext() {
        return !!this.current;
    }
}
