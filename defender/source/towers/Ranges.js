/**
 * The Towers Ranges Class
 */
class Ranges {

    /**
     * The Towers Ranges Class
     * @param {Towers} parent
     */
    constructor(parent) {
        this.parent   = parent;
        this.reduced  = {};
        this.complete = {};
        this.boosts   = {};
    }


    /**
     * It adds the Tower to the diferent cells in the matrices of Iterators where its range reaches it
     * @returns {({boosts: Array.<Iterator>, towers: Array.<Iterator>} | {complete: Array.<Iterator>, reduced: Array.<Iterator>})}
     */
    add(tower) {
        let matrix = tower.getRangeMatrix(),
            reduce = (matrix.length - tower.getSize()) / 2,
            list1  = [],
            list2  = [];

        matrix.forEach((line, i) => {
            line.forEach((cell, j) => {
                let row = tower.getRow() - reduce + i,
                    col = tower.getCol() - reduce + j;

                if (cell === 1 && this.parent.board.inBoard(row, col)) {
                    if (tower.isBoost()) {
                        this.addBoost(list1, list2, tower.getID(), row, col);
                    } else if (!tower.canFire()) {
                        this.addNormal(list1, list2, tower.getID(), row, col);
                    }
                }
            });
        });

        if (tower.isBoost()) {
            return { boosts: list1, towers: list2 };
        }
        return { complete: list1, reduced: list2 };
    }

    /**
     * Adds the boost Tower to the "boost" list and if there is a tower in the given position,
     * it adds it's id to the second given array
     * @param {Array.<Iterator>} list1
     * @param {Array.<Number>}   list2
     * @param {Number}           id
     * @param {Number}           row
     * @param {Number}           col
     * @returns {Void}
     */
    addBoost(list1, list2, id, row, col) {
        let cell    = this.getCell(row, col),
            towerID = this.parent.board.getContent(row, col),
            tower   = this.parent.manager.get(towerID);

        list1.push(this.addTower("boosts", cell, id));
        if (tower && !tower.isBoost() && list2.indexOf(towerID) === -1) {
            list2.push(towerID);
        }
    }

    /**
     * Adds a non-boost Tower to the "complete" and "reduced" lists in the given position,
     * updating the given arrays
     * @param {Array.<Iterator>} list1
     * @param {Array.<Iterator>} list2
     * @param {Number}           id
     * @param {Number}           row
     * @param {Number}           col
     * @returns {Void}
     */
    addNormal(list1, list2, id, row, col) {
        let cell = this.getCell(row, col);
        list1.push(this.addTower("complete", cell, id));
        list2.push(this.addTower("reduced",  cell, id));
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
        return this[list][cell].addLast({ id: id, cell: cell });
    }


    /**
     * Removes the Tower from all the internal lists
     * @param {Tower} tower
     * @returns {Void}
     */
    remove(tower) {
        let lists = tower.getLists();
        Object.keys(lists).forEach((name) => {
            lists[name].forEach((it) => {
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
        tower.getLists().reduced.forEach((it) => {
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
        let list = [];
        tower.getLists().complete.forEach((it) => {
            list.push(this.addTower("reduced", it.getPrev().cell, it.getPrev().id));
        });
        tower.setList("reduced", list);
    }


    /**
     * Returns all the Boost Towers where it's range reaches the given Tower
     * @param {Tower} tower
     * @returns {Array.<Number>}
     */
    getBoostsList(tower) {
        let startRow = tower.getRow(),
            startCol = tower.getCol(),
            endRow   = startRow + tower.getSize(),
            endCol   = startCol + tower.getSize(),
            list     = [];

        for (let i = startRow; i < endRow; i += 1) {
            for (let j = startCol; j < endCol; j += 1) {
                let pos = this.getCell(i, j);
                if (this.boosts[pos] && !this.boosts[pos].isEmpty()) {
                    let it = this.boosts[pos].iterate();
                    while (it.hasNext()) {
                        if (list.indexOf(it.getNext()) !== -1) {
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
     * Returns true if there is a Tower in the "reduced" list in the given position
     * @param {Number} row
     * @param {Number} col
     * @returns {Boolean}
     */
    hasTowers(row, col) {
        let pos = this.getCell(row, col);
        return this.reduced[pos] && !this.reduced[pos].isEmpty();
    }

    /**
     * Returns all the Towers in the "reduced" list in the given position
     * @returns {?Array.<Iterator>}
     */
    getReducedList(row, col) {
        return this.reduced[this.getCell(row, col)];
    }
}
