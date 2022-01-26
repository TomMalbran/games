import Metrics      from "./Metrics.js";
import Piece        from "./Piece.js";
import Set          from "./Set.js";

// Utils
import List         from "../../utils/List.js";
import Storage      from "../../utils/Storage.js";
import Utils        from "../../utils/Utils.js";



/**
 * Puzzle Instance
 */
export default class Instance {

    /**
     * Puzzle Instance constructor
     * @param {HTMLImageElement} image
     * @param {Metrics}          metrics
     */
    constructor(image, metrics) {
        this.image   = image;
        this.metrics = metrics;
        this.storage = new Storage(`puzzle.${image.alt}.${metrics.pieceCount}`);

        const score = this.storage.get("score");
        if (score) {
            if (score.placed === score.total) {
                this.destroy();
            } else {
                this.metrics.setPlacedPieces(score.placed);
                this.metrics.setTime(this.storage.get("time"));
            }
        }
        this.createPieces();
    }

    /**
     * Destroys the Storage data
     * @returns {Void}
     */
    destroy() {
        this.storage.remove("time");
        this.storage.remove("score");
        this.storage.remove("pieces");
        this.storage.remove("drawer");
        this.storage.remove("board");
        this.storage.remove("tablePieces");
        this.storage.remove("tableSets");
    }

    /**
     * Creates all the Pieces
     * @returns {Void}
     */
    createPieces() {
        const data   = this.storage.get("pieces");
        const values = [];
        this.pieces  = {};

        if (data) {
            for (const { id, col, row, borders } of data) {
                this.pieces[id] = new Piece(this.metrics, this.image, id, col, row, borders);
            }
            return;
        }

        // Generate the Matrix and Pieces
        const matrix  = [];
        const options = [ -1, 1 ];
        for (let row = 0; row < this.metrics.rows; row += 1) {
            matrix[row] = [];
            for (let col = 0; col < this.metrics.cols; col += 1) {
                /** @type {{top: Number, right: Number, bottom: Number, left: Number}} */
                const borders = { top : 0, right : 0, bottom : 0, left : 0 };
                if (row > 0) {
                    // @ts-ignore
                    borders.top = matrix[row - 1][col].bottom * -1;
                }
                if (col < this.metrics.cols - 1) {
                    borders.right = Utils.randArray(options);
                }
                if (row < this.metrics.rows - 1) {
                    borders.bottom = Utils.randArray(options);
                }
                if (col > 0) {
                    // @ts-ignore
                    borders.left = matrix[row][col - 1].right * -1;
                }

                let id;
                do {
                    id = `p${Utils.rand(0, 999999)}`;
                } while (this.pieces[id]);
                this.pieces[id]  = new Piece(this.metrics, this.image, id, col, row, borders);
                matrix[row][col] = borders;
                values.push({ id, col, row, borders });
            }
        }

        // Randomize the Pieces
        for (let i = 0; i < values.length; i += 1) {
            const pos = Utils.rand(0, values.length - 1);
            const aux = values[pos];
            values[pos] = values[i];
            values[i]   = aux;
        }

        this.storage.set("pieces", values);
        this.storage.set("drawer", values.map((elem) => elem.id));
        this.storage.set("score",  { placed : 0, total : this.metrics.totalPieces });
    }

    /**
     * Saves the Time
     * @param {Number} time
     * @returns {Void}
     */
    saveTime(time) {
        this.storage.set("time", time);
    }

    /**
     * Returns the Pieces from the given Storage
     * @param {String} name
     * @returns {Piece[]}
     */
    getPieces(name) {
        const pieces = this.storage.get(name);
        const result = [];
        if (pieces) {
            for (const pieceID of pieces) {
                result.push(this.pieces[pieceID]);
            }
        }
        return result;
    }

    /**
     * Saves the Pieces into the given Storage
     * @param {String} name
     * @param {List}   list
     * @returns {Void}
     */
    savePieces(name, list) {
        const pieces = list.toArray((elem) => elem.id);
        this.storage.set(name, pieces);
    }



    /**
     * Returns the Drawer Pieces
     * @returns {Piece[]}
     */
    getDrawerPieces() {
        return this.getPieces("drawer");
    }

    /**
     * Saves the Drawer Pieces
     * @param {List} list
     * @returns {Void}
     */
    saveDrawerPieces(list) {
        this.savePieces("drawer", list);
    }

    /**
     * Returns the Board Pieces
     * @returns {Piece[]}
     */
    getBoardPieces() {
        return this.getPieces("board");
    }

    /**
     * Saves the Board Pieces
     * @param {List} list
     * @returns {Void}
     */
    saveBoardPieces(list) {
        this.savePieces("board", list);
        this.storage.set("score", { placed : list.length, total : this.metrics.totalPieces });
    }



    /**
     * Returns the Table Pieces
     * @returns {Piece[]}
     */
    getTablePieces() {
        const pieces = this.storage.get("tablePieces");
        const result = [];
        if (pieces) {
            for (const { id, top, left } of pieces) {
                if (this.pieces[id]) {
                    result.push(this.pieces[id]);
                    this.pieces[id].initInTable(top, left);
                }
            }
        }
        return result;
    }

    /**
     * Saves the Table Pieces
     * @param {List} list
     * @returns {Void}
     */
    saveTablePieces(list) {
        const pieces = list.toArray(({ id, top, left }) => ({ id, top, left }));
        this.storage.set("tablePieces", pieces);
    }

    /**
     * Returns the Table Sets
     * @returns {Set[]}
     */
    getTableSets() {
        const sets = this.storage.get("tableSets");
        const result = [];
        if (sets) {
            for (const { top, left, pieces } of sets) {
                let   firstPiece  = null;
                const otherPieces = [];
                for (const pieceID of pieces) {
                    if (this.pieces[pieceID]) {
                        if (!firstPiece) {
                            firstPiece = this.pieces[pieceID];
                        } else {
                            otherPieces.push(this.pieces[pieceID]);
                        }
                    }
                }
                const set = new Set(firstPiece, ...otherPieces);
                set.initInTable(top, left);
                result.push(set);
            }
        }
        return result;
    }

    /**
     * Saves the Table Sets
     * @param {List} list
     * @returns {Void}
     */
    saveTableSets(list) {
        const sets = list.toArray(({ top, left, list }) => {
            const pieces = list.map((elem) => elem.id);
            return { top, left, pieces };
        });
        this.storage.set("tableSets", sets);
    }
}
