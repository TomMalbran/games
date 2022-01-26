import Metrics      from "./Metrics.js";

// Utils
import Utils        from "../../utils/Utils.js";



/**
 * Puzzle Piece
 */
export default class Piece {

    /**
     * Puzzle Piece constructor
     * @param {Metrics}          metrics
     * @param {HTMLImageElement} image
     * @param {String}           id
     * @param {Number}           col
     * @param {Number}           row
     * @param {{top: Number, right: Number, bottom: Number, left: Number}} borders
     */
    constructor(metrics, image, id, col, row, borders) {
        this.id       = id;
        this.metrics  = metrics;
        this.image    = image;
        this.col      = col;
        this.row      = row;
        this.top      = 0;
        this.left     = 0;
        this.borders  = borders;
        this.isBorder = !this.borders.top || !this.borders.right || !this.borders.bottom || !this.borders.left;
        this.inDrawer = true;

        this.canvas                = document.createElement("canvas");
        this.ctx                   = this.canvas.getContext("2d");
        this.canvas.width          = this.metrics.fullSize;
        this.canvas.height         = this.metrics.fullSize;
        this.canvas.className      = "piece" + (this.isBorder ? " border" : "");
        this.canvas.dataset.action = "piece";
        this.canvas.dataset.id     = String(this.id);

        this.draw();
    }

    /**
     * Initializes the Piece in the Table
     * @param {Number} top
     * @param {Number} left
     * @returns {Void}
     */
    initInTable(top, left) {
        this.inDrawer = false;
        this.top      = top;
        this.left     = left;
        this.canvas.style.transform = Utils.translate(this.left, this.top);
    }

    /**
     * Returns the Position
     * @returns {{top: Number, left: Number}}
     */
    get pos() {
        return { top : this.top, left : this.left };
    }



    /**
     * Draws the Piece
     * @returns {Void}
     */
    draw() {
        const size    = this.metrics.size;
        const padding = this.metrics.padding;

        this.ctx.scale(this.metrics.scale, this.metrics.scale);

        this.ctx.moveTo(padding, padding);
        if (this.borders.top === 0) {
            this.ctx.lineTo(padding + size, padding);
        } else {
            this.drawSide(padding, padding, 0, this.borders.top);
        }
        if (this.borders.right === 0) {
            this.ctx.lineTo(padding + size, padding + size);
        } else {
            this.drawSide(padding + size, padding, 0.5, this.borders.right);
        }
        if (this.borders.bottom === 0) {
            this.ctx.lineTo(padding, padding + size);
        } else {
            this.drawSide(padding + size, padding + size, 1, this.borders.bottom);
        }
        if (this.borders.left === 0) {
            this.ctx.closePath();
        } else {
            this.drawSide(padding, padding + size, 1.5, this.borders.left);
        }
        this.ctx.strokeStyle = "rgba(240, 240, 240, 0.3)";
        this.ctx.lineWidth   = 1;
        this.ctx.stroke();
        this.ctx.clip();

        const sourcePad  = padding * this.metrics.imgSize / size;
        const sourceSize = this.metrics.imgSize + sourcePad * 2;
        const sourceX    = this.col * this.metrics.imgSize - sourcePad;
        const sourceY    = this.row * this.metrics.imgSize - sourcePad;
        const destSize   = size + padding * 2;
        this.ctx.drawImage(this.image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, destSize, destSize);
    }

    /**
     * Draws a side of a Piece
     * @param {Number} x
     * @param {Number} y
     * @param {Number} rotation
     * @param {Number} border
     * @returns {Void}
     */
    drawSide(x, y, rotation, border) {
        const beziers = [
            { cx1 : 0,  cy1 :   0, cx2 : 35, cy2 :  15, ex :  37, ey :   5 }, // left shoulder
            { cx1 : 37, cy1 :   5, cx2 : 40, cy2 :   0, ex :  38, ey :  -5 }, // left neck
            { cx1 : 38, cy1 :  -5, cx2 : 20, cy2 : -20, ex :  50, ey : -20 }, // left head
            { cx1 : 50, cy1 : -20, cx2 : 80, cy2 : -20, ex :  62, ey :  -5 }, // right head
            { cx1 : 62, cy1 :  -5, cx2 : 60, cy2 :   0, ex :  63, ey :   5 }, // right neck
            { cx1 : 63, cy1 :   5, cx2 : 65, cy2 :  15, ex : 100, ey :   0 }, // right shoulder
        ];

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(Math.PI * rotation);
        for (const b of beziers) {
            if (border === -1) {
                b.cy1 = b.cy1 * -1;
                b.cy2 = b.cy2 * -1;
                b.ey  = b.ey  * -1;
            }
            this.ctx.bezierCurveTo(b.cx1, b.cy1, b.cx2, b.cy2, b.ex, b.ey);
        }
        this.ctx.restore();
    }

    /**
     * Positions the Piece at the given Top and Left
     * @param {Number} top
     * @param {Number} left
     */
    position(top, left) {
        this.top  = top;
        this.left = left;

        this.canvas.style.top       = Utils.toPX(top);
        this.canvas.style.left      = Utils.toPX(left);
        this.canvas.style.transform = "";
    }



    /**
     * Returns true if the given Piece is neighbour of this one
     * @param {Piece} piece
     * @returns {Boolean}
     */
    isNeighbour(piece) {
        return (
            (this.row === piece.row && Math.abs(this.col - piece.col) === 1) ||
            (this.col === piece.col && Math.abs(this.row - piece.row) === 1)
        );
    }

    /**
     * Returns true if the position of the given Piece is close enought to fit
     * @param {Piece} piece
     * @returns {Boolean}
     */
    canFit(piece) {
        const fitPos = this.metrics.calcPiecePos(piece, this.top, this.left, this.row, this.col);
        const dist   = Utils.dist(fitPos, piece.pos);
        return dist < this.metrics.delta;
    }



    /**
     * Translates the Piece
     * @param {{top: Number, left: Number}} pos
     * @returns {Void}
     */
    translate(pos) {
        this.top  = pos.top  - this.startPos.top;
        this.left = pos.left - this.startPos.left;
        this.canvas.style.transform = Utils.translate(this.left, this.top);
    }

    /**
     * Picks the Piece
     * @param {MouseEvent} event
     * @returns {Void}
     */
    pick(event) {
        const pos     = Utils.getMousePos(event);
        const bounds  = this.canvas.getBoundingClientRect();
        this.startPos = { top : pos.top - bounds.top, left : pos.left - bounds.left };

        document.body.appendChild(this.canvas);
        this.translate(pos);
    }

    /**
     * Drags the Piece
     * @param {MouseEvent} event
     * @returns {Void}
     */
    drag(event) {
        const pos = Utils.getMousePos(event);
        this.translate(pos);
    }

    /**
     * Drops the Piece in the Drawer
     * @returns {Void}
     */
    dropInDrawer() {
        this.inDrawer = true;
        this.canvas.style.transform = "";
    }

    /**
     * Drops the Piece in the Board
     * @param {{top: Number, left: Number}} pos
     * @returns {Void}
     */
    dropInTable(pos) {
        this.inDrawer = false;
        this.translate(pos);
    }
}
