import Board        from "./Board.js";
import Canvas       from "./Canvas.js";



/**
 * Pacman Board Canvas
 * @extends {Canvas}
 */
export default class BoardCanvas extends Canvas {

    /**
     * Pacman Board Canvas constructor
     * @param {Board} board
     */
    constructor(board) {
        super(board, "board");

        this.ctx.lineWidth   = board.lineWidth;
        this.ctx.strokeStyle = board.boardColor;


        this.drawTShapes = {
            "down"  : { radians: 0,   x:  0, y:  0 },
            "left"  : { radians: 0.5, x:  0, y: -5 },
            "right" : { radians: 1.5, x: -1, y:  0 },
            "up"    : { radians: 1,   x: -1, y: -5 }
        };
        this.radians = {
            "top-left"     : { from:   1, to: 1.5 },
            "top-right"    : { from: 1.5, to:   2 },
            "bottom-right" : { from:   0, to: 0.5 },
            "bottom-left"  : { from: 0.5, to:   1 }
        };
        this.corners = {
            "top-left"     : { x:  1, y:  1 },
            "top-right"    : { x: -1, y:  1 },
            "bottom-right" : { x: -1, y: -1 },
            "bottom-left"  : { x:  1, y: -1 }
        };
        this.smallCorners = {
            "top-left" : {
                x : { cell: 1, line: -1 },
                y : { cell: 1, line: -1 }
            },
            "top-right" : {
                x : { cell: 0, line:  1 },
                y : { cell: 1, line: -1 }
            },
            "bottom-right" : {
                x : { cell: 0, line:  1 },
                y : { cell: 0, line:  1 }
            },
            "bottom-left" : {
                x : { cell: 1, line: -1 },
                y : { cell: 0, line:  1 }
            }
        };
    }



    /**
     * Draw the this.board
     * @param {Boolean} newLevel
     * @returns {Void}
     */
    drawBoard(newLevel) {
        this.drawGhostsPen();

        this.ctx.save();
        this.ctx.strokeStyle = newLevel ? "white" : this.board.boardColor;
        this.drawOuterBorder();
        this.drawInnerBorder();

        // First Row
        this.drawRectangle(2,  2,  4, 3);
        this.drawRectangle(7,  2,  5, 3);
        this.drawRectangle(16, 2,  5, 3);
        this.drawRectangle(22, 2,  4, 3);

        // Second Row
        this.drawRectangle(2,  6, 4, 2);
        this.drawTShape(7,     6, 4, 4, "right");
        this.drawTShape(10,    6, 4, 4, "down");
        this.drawTShape(16,    6, 4, 4, "left");
        this.drawRectangle(22, 6, 4, 2);

        // Third Row
        this.drawRectangle(7,  15, 2, 5);
        this.drawTShape(10,    18, 4, 4, "down");
        this.drawRectangle(19, 15, 2, 5);

        // Fourth Row
        this.drawLShape(2,     21, false);
        this.drawRectangle(7,  21, 5, 2);
        this.drawRectangle(16, 21, 5, 2);
        this.drawLShape(22,    21, true);

        // Fith Row
        this.drawTShape(2,  24, 4, 6, "up");
        this.drawTShape(10, 24, 4, 4, "down");
        this.drawTShape(16, 24, 6, 4, "up");

        this.ctx.restore();
    }

    /**
     * Draws the Ghosts Pen House
     * @returns {Void}
     */
    drawGhostsPen() {
        this.ctx.strokeRect(10.5 * this.board.tileSize,                  12.5 * this.board.tileSize,                  7 * this.board.tileSize,                   4 * this.board.tileSize);
        this.ctx.strokeRect(11   * this.board.tileSize - this.board.halfLine, 13   * this.board.tileSize - this.board.halfLine, 6 * this.board.tileSize + this.board.lineWidth, 3 * this.board.tileSize + this.board.lineWidth);
        this.ctx.strokeRect(13   * this.board.tileSize - this.board.halfLine, 12.5 * this.board.tileSize,                  2 * this.board.tileSize + this.board.lineWidth, this.board.tileSize / 2 - this.board.halfLine);
        this.ctx.clearRect(13    * this.board.tileSize,                  12.5 * this.board.tileSize - this.board.halfLine, 2 * this.board.tileSize,                   this.board.tileSize / 2 + this.board.halfLine);

        this.ctx.save();
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(13   * this.board.tileSize + this.board.halfLine, 12.5 * this.board.tileSize + this.board.lineWidth, 2 * this.board.tileSize - this.board.lineWidth, this.board.halfLine);
        this.ctx.restore();
    }

    /**
     * Draws the this.board outer border
     * @returns {Void}
     */
    drawOuterBorder() {
        this.ctx.beginPath();

        // Top Corners
        this.drawOuterBigCorner(0,  0, "top-left");
        this.drawOuterBigCorner(27, 0, "top-right");

        // Right Tunnel
        this.drawOuterBigCorner(27,    9, "bottom-right");
        this.drawOuterSmallCorner(22,  9, "top-left");
        this.drawOuterSmallCorner(22, 13, "bottom-left");
        this.ctx.lineTo(28 * this.board.tileSize, 13 * this.board.tileSize + this.board.halfLine);
        this.ctx.moveTo(28 * this.board.tileSize, 16 * this.board.tileSize - this.board.halfLine);
        this.drawOuterSmallCorner(22, 15, "top-left");
        this.drawOuterSmallCorner(22, 19, "bottom-left");
        this.drawOuterBigCorner(27,   19, "top-right");

        // Bottom Corners
        this.drawOuterBigCorner(27,   30, "bottom-right");
        this.drawOuterBigCorner(0,    30, "bottom-left");

        // Left Tunnel
        this.drawOuterBigCorner(0,    19, "top-left");
        this.drawOuterSmallCorner(5,  19, "bottom-right");
        this.drawOuterSmallCorner(5,  15, "top-right");
        this.ctx.lineTo(0, 16 * this.board.tileSize - this.board.halfLine);
        this.ctx.moveTo(0, 13 * this.board.tileSize + this.board.halfLine);
        this.drawOuterSmallCorner(5,  13, "bottom-right");
        this.drawOuterSmallCorner(5,   9, "top-right");
        this.drawOuterBigCorner(0,     9, "bottom-left");

        this.ctx.lineTo(this.board.halfLine, this.board.bigRadius + this.board.halfLine);
        this.ctx.stroke();
    }

    /**
     * Draws the this.board inner border
     * @returns {Void}
     */
    drawInnerBorder() {
        this.ctx.beginPath();

        // Top Border
        this.drawInnerCorner(0,   0, "top-left",     false, false);
        this.drawInnerCorner(13,  0, "top-right",    false, false);
        this.drawInnerCorner(13,  4, "bottom-left",  true,  true);
        this.drawInnerCorner(14,  4, "bottom-right", true,  true);
        this.drawInnerCorner(14,  0, "top-left",     false, false);
        this.drawInnerCorner(27,  0, "top-right",    false, false);

        // Right Border
        this.drawInnerCorner(27,  9, "bottom-right", false, false);
        this.drawInnerCorner(22,  9, "top-left",     true,  true);
        this.drawInnerCorner(22, 13, "bottom-left",  true,  true);
        this.ctx.lineTo(28 * this.board.tileSize, 13.5 * this.board.tileSize);
        this.ctx.moveTo(28 * this.board.tileSize, 15.5 * this.board.tileSize);
        this.drawInnerCorner(22, 15, "top-left",     true,  true);
        this.drawInnerCorner(22, 19, "bottom-left",  true,  true);
        this.drawInnerCorner(27, 19, "top-right",    false, false);
        this.drawInnerCorner(27, 24, "bottom-right", false, false);
        this.drawInnerCorner(25, 24, "top-left",     true,  true);
        this.drawInnerCorner(25, 25, "bottom-left",  true,  true);
        this.drawInnerCorner(27, 25, "top-right",    false, false);

        // Bottom Border
        this.drawInnerCorner(27, 30, "bottom-right", false, false);
        this.drawInnerCorner(0,  30, "bottom-left",  false, false);

        // Left Border
        this.drawInnerCorner(0,  25, "top-left",     false, false);
        this.drawInnerCorner(2,  25, "bottom-right", true,  true);
        this.drawInnerCorner(2,  24, "top-right",    true,  true);
        this.drawInnerCorner(0,  24, "bottom-left",  false, false);
        this.drawInnerCorner(0,  19, "top-left",     false, false);
        this.drawInnerCorner(5,  19, "bottom-right", true,  true);
        this.drawInnerCorner(5,  15, "top-right",    true,  true);
        this.ctx.lineTo(0, 15.5 * this.board.tileSize);
        this.ctx.moveTo(0, 13.5 * this.board.tileSize);
        this.drawInnerCorner(5,  13, "bottom-right", true,  true);
        this.drawInnerCorner(5,   9, "top-right",    true,  true);
        this.drawInnerCorner(0,   9, "bottom-left",  false, false);
        this.ctx.lineTo(this.board.tileSize / 2, this.board.tileSize / 2 + this.board.smallRadius);

        this.ctx.stroke();
    }



    /**
     * Draws a drawRectangle at the given position with the given size
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @returns {Void}
     */
    drawRectangle(x, y, width, height) {
        this.ctx.save();
        this.ctx.translate(x * this.board.tileSize, y * this.board.tileSize);

        this.ctx.beginPath();
        this.drawInnerCorner(0,                  0, "top-left",     true, false);
        this.drawInnerCorner(width - 1,          0, "top-right",    true, false);
        this.drawInnerCorner(width - 1, height - 1, "bottom-right", true, false);
        this.drawInnerCorner(0,         height - 1, "bottom-left",  true, false);
        this.ctx.closePath();

        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draws a t shape at the given position and with the given properties
     * @param {Number} x
     * @param {Number} y
     * @param {Number} left
     * @param {Number} right
     * @param {String} type
     * @returns {Void}
     */
    drawTShape(x, y, left, right, type) {
        const data  = this.drawTShapes[type];
        const width = left + right;

        this.ctx.save();
        this.ctx.translate(x * this.board.tileSize, y * this.board.tileSize);
        this.ctx.rotate(data.radians * Math.PI);
        this.ctx.translate(data.x * width * this.board.tileSize, data.y * this.board.tileSize);

        this.ctx.beginPath();
        this.drawInnerCorner(0,         0, "top-left",     true,  false);
        this.drawInnerCorner(width - 1, 0, "top-right",    true,  false);
        this.drawInnerCorner(width - 1, 1, "bottom-right", true,  false);
        this.drawInnerCorner(left,      1, "top-left",     false, true);
        this.drawInnerCorner(left,      4, "bottom-right", true,  false);
        this.drawInnerCorner(left - 1,  4, "bottom-left",  true,  false);
        this.drawInnerCorner(left - 1,  1, "top-right",    false, true);
        this.drawInnerCorner(0,         1, "bottom-left",  true,  false);

        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * Draws an l shape at the given position
     * @param {Number}  x
     * @param {Number}  y
     * @param {Boolean} reflect
     * @returns {Void}
     */
    drawLShape(x, y, reflect) {
        this.ctx.save();
        this.ctx.translate(x * this.board.tileSize, y * this.board.tileSize);

        if (reflect) {
            this.ctx.transform(-1, 0, 0, 1, 0, 0);
            this.ctx.translate(-4 * this.board.tileSize, 0);
        }

        this.ctx.beginPath();
        this.drawInnerCorner(0, 0, "top-left",     true,  false);
        this.drawInnerCorner(3, 0, "top-right",    true,  false);
        this.drawInnerCorner(3, 4, "bottom-right", true,  false);
        this.drawInnerCorner(2, 4, "bottom-left",  true,  false);
        this.drawInnerCorner(2, 1, "top-right",    false, true);
        this.drawInnerCorner(0, 1, "bottom-left",  true,  false);

        this.ctx.stroke();
        this.ctx.restore();
    }


    /**
     * Draws a corner for the outer line with a big angle
     * @param {Number} x
     * @param {Number} y
     * @param {String} type
     * @returns {Void}
     */
    drawOuterBigCorner(x, y, type) {
        const data = this.corners[type];
        const pos  = {
            x : x * this.board.tileSize + this.board.bigRadius + data.x * this.board.halfLine,
            y : y * this.board.tileSize + this.board.bigRadius + data.y * this.board.halfLine
        };
        this.drawCorner(pos, this.board.bigRadius, type, false);
    }

    /**
     * Draws a corner for the outer line with a small angle
     * @param {Number} x
     * @param {Number} y
     * @param {String} type
     * @returns {Void}
     */
    drawOuterSmallCorner(x, y, type) {
        const radius = this.corners[type];
        const data   = this.smallCorners[type];
        const pos    = {
            x : (x + data.x.cell) * this.board.tileSize + radius.x * this.board.smallRadius + data.x.line * this.board.halfLine,
            y : (y + data.y.cell) * this.board.tileSize + radius.y * this.board.smallRadius + data.y.line * this.board.halfLine
        };
        this.drawCorner(pos, this.board.smallRadius, type, true);
    }

    /**
     * Draws a corner for the board
     * @param {Number} x
     * @param {Number} y
     * @param {String} type
     * @param {Boolean} isBig
     * @param {Boolean} anitclockwise
     * @returns {Void}
     */
    drawInnerCorner(x, y, type, isBig, anitclockwise) {
        const radius = isBig ? this.board.bigRadius : this.board.smallRadius;
        const data   = this.corners[type];
        const pos    = {
            x : (x + 0.5) * this.board.tileSize + data.x * radius,
            y : (y + 0.5) * this.board.tileSize + data.y * radius
        };
        this.drawCorner(pos, radius, type, anitclockwise);
    }

    /**
     * Draws a corner at the given position and with the given radius and type
     * @param {{x: Number, y: Number}} pos
     * @param {Number}                 radius
     * @param {String}                 type
     * @param {Boolean}                anitclockwise
     * @returns {Void}
     */
    drawCorner(pos, radius, type, anitclockwise) {
        let   rad    = this.radians[type];
        const result = [ rad.from * Math.PI, rad.to * Math.PI ];

        if (anitclockwise) {
            result.reverse();
        }
        rad = { from: result[0], to: result[1] };

        this.ctx.arc(pos.x, pos.y, radius, rad.from, rad.to, anitclockwise);
    }



    /**
     * Draws lines over the board for testing
     * @returns {Void}
     */
    drawLines() {
        this.ctx.strokeStyle = "#CCC";
        this.ctx.lineWidth   = 1;
        this.ctx.beginPath();

        for (let i = 0; i < this.board.rows; i += 1) {
            this.ctx.moveTo(0,           i * this.board.tileSize);
            this.ctx.lineTo(this.board.width, i * this.board.tileSize);
        }
        for (let i = 0; i < this.board.cols; i += 1) {
            this.ctx.moveTo(i * this.board.tileSize, 0);
            this.ctx.lineTo(i * this.board.tileSize, this.board.canvasHeight);
        }
        this.ctx.stroke();
    }

    /**
     * Draws the intersections over the board for testing
     * @returns {Void}
     */
    drawIntersections() {
        Object.keys(this.board.boardTurns).forEach((key) => {
            const coords = key.replace("x", "").split("y");
            const x      = this.board.getTileCorner(Number(coords[0]));
            const y      = this.board.getTileCorner(Number(coords[1]));

            this.ctx.fillRect(x, y, this.board.tileSize, this.board.tileSize);
            this.ctx.save();
            this.ctx.strokeStyle = "white";

            this.board.boardTurns[key].forEach((value) => {
                const dir = this.board.numberToDir(value);
                const bx  = this.board.getTileCorner(Number(coords[0]) + dir.x);
                const by  = this.board.getTileCorner(Number(coords[1]) + dir.y);

                this.ctx.strokeRect(bx, by, this.board.tileSize, this.board.tileSize);
            });
            this.ctx.restore();
        });
    }
}
