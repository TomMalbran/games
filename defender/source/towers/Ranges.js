import Towers       from "./Towers.js";
import Tower        from "../tower/Tower.js";

// Utils
import List, { Iterator } from "../../../utils/List.js";



/**
 * Defender Towers Ranges
 */
export default class Ranges {

    /**
     * Defender Towers Ranges constructor
     * @param {Towers} parent
     */
    constructor(parent) {
        this.parent   = parent;

        /** @type {Object.<String, List>} */
        this.reduced  = {};

        /** @type {Object.<String, List>} */
        this.complete = {};

        /** @type {Object.<String, List>} */
        this.boosts   = {};
    }



    /**
     * It adds the Tower to the diferent cells in the matrices of Iterators where its range reaches it
     * @returns {{boosts: Iterator[], towers: Number[], complete: Iterator[], reduced: Iterator[]}}
     */
    add(tower) {
        const matrix   = tower.rangeMatrix;
        const reduce   = (matrix.length - tower.size) / 2;
        const boosts   = [];
        const towers   = [];
        const complete = [];
        const reduced  = [];

        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                const row  = tower.row - reduce + i;
                const col  = tower.col - reduce + j;
                const cell = matrix[i][j];

                if (cell === 1 && this.parent.board.inBoard(row, col)) {
                    if (tower.isBoost) {
                        this.addBoost(boosts, towers, tower.id, row, col);
                    } else if (!tower.canFire) {
                        this.addNormal(complete, reduced, tower.id, row, col);
                    }
                }
            }
        }
        return { boosts, towers, complete, reduced };
    }

    /**
     * Adds the boost Tower to the "boost" list and if there is a tower in the given position,
     * it adds it's id to the second given array
     * @param {Iterator[]} boosts
     * @param {Number[]}   towers
     * @param {Number}     id
     * @param {Number}     row
     * @param {Number}     col
     * @returns {Void}
     */
    addBoost(boosts, towers, id, row, col) {
        const cell    = this.getCell(row, col);
        const towerID = this.parent.board.getContent(row, col);
        const tower   = this.parent.manager.get(towerID);

        boosts.push(this.addTower("boosts", cell, id));
        if (tower && !tower.isBoost && !towers.includes(towerID)) {
            towers.push(towerID);
        }
    }

    /**
     * Adds a non-boost Tower to the "complete" and "reduced" lists in the given position,
     * updating the given arrays
     * @param {Iterator[]} complete
     * @param {Iterator[]} reduced
     * @param {Number}     id
     * @param {Number}     row
     * @param {Number}     col
     * @returns {Void}
     */
    addNormal(complete, reduced, id, row, col) {
        const cell = this.getCell(row, col);
        complete.push(this.addTower("complete", cell, id));
        reduced.push(this.addTower("reduced", cell, id));
    }

    /**
     * Adds the tower with the given ID, to the given list in the given cell
     * @param {String} list
     * @param {String} cell
     * @param {Number} id
     * @returns {Iterator}
     */
    addTower(list, cell, id) {
        if (!this[list][cell]) {
            this[list][cell] = new List();
        }
        return this[list][cell].addLast({ id, cell });
    }

    /**
     * Removes the Tower from all the internal lists
     * @param {Tower} tower
     * @returns {Void}
     */
    remove(tower) {
        Object.keys(tower.lists).forEach((name) => {
            tower.lists[name].forEach((it) => {
                if (this[name]) {
                    it.removePrev();
                }
            });
        });
    }



    /**
     * When starting to shoot, it removes the Tower from the reduced array
     * @param {Tower} tower
     * @returns {Void}
     */
    startShoot(tower) {
        tower.lists.reduced.forEach((it) => {
            if (it) {
                it.removePrev();
            }
        });
    }

    /**
     * When ending a shoot, it readds the Tower to the reduced array
     * @param {Tower} tower
     * @returns {Void}
     */
    endShoot(tower) {
        const list = [];
        tower.lists.complete.forEach((it) => {
            const { id, cell } = it.getPrev();
            list.push(this.addTower("reduced", cell, id));
        });
        tower.setList("reduced", list);
    }



    /**
     * Returns all the Boost Towers where it's range reaches the given Tower
     * @param {Tower} tower
     * @returns {Number[]}
     */
    getBoostsList(tower) {
        const list = [];
        for (let i = tower.row; i < tower.endRow; i += 1) {
            for (let j = tower.col; j < tower.endCol; j += 1) {
                const cell = this.getCell(i, j);
                if (this.boosts[cell] && !this.boosts[cell].isEmpty) {
                    const it = this.boosts[cell].iterate();
                    while (it.hasNext()) {
                        if (list.includes(it.getNext())) {
                            list.push(it.getNext());
                        }
                        it.next();
                    }
                }
            }
        }
        return list;
    }

    /**
     * Returns a string that represents a position
     * @param {Number} row
     * @param {Number} col
     * @returns {String}
     */
    getCell(row, col) {
        return `r${row}c${col}`;
    }

    /**
     * Returns all the Towers in the "reduced" list in the given position
     * @returns {?List}
     */
    getReducedList(row, col) {
        const cell = this.getCell(row, col);
        return this.reduced[cell];
    }
}
