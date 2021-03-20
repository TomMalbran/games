let Board = (function () {
    "use strict";

    /**
     * @const boardMatrix The Board MAtrix (28x31) and the Values
     * 0 Wall | 1 Path | 2 Pill on Path | 3 Intersection | 4 Pill on Interection | 5 Tunnel
     */
    const wallValue      = 0;
    const pillPathValue  = 2;
    const interValue     = 3;
    const interPillValue = 4;
    const tunnelValue    = 5;

    const boardMatrix    = [
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 4, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 4, 0, 0, 4, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 4, 0 ],
        [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
        [ 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0 ],
        [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
        [ 0, 4, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 4, 0 ],
        [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
        [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
        [ 0, 4, 2, 2, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 2, 2, 4, 0 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 5, 5, 5, 5, 5, 5, 4, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 4, 5, 5, 5, 5, 5, 5 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0 ],
        [ 0, 4, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 4, 0 ],
        [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
        [ 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0 ],
        [ 0, 3, 2, 4, 0, 0, 4, 2, 2, 4, 2, 2, 4, 1, 1, 4, 2, 2, 4, 2, 2, 4, 0, 0, 4, 2, 3, 0 ],
        [ 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0 ],
        [ 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0 ],
        [ 0, 4, 2, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 0, 0, 4, 2, 2, 4, 2, 4, 0 ],
        [ 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0 ],
        [ 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0 ],
        [ 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
    ];

    /**
     * @const boardTurns Possible Turns at the Intersections
     * 0 Up | 1 Left | 2 Down | 3 Right
     */
     const boardTurns = {
        x1y1   : [ 2, 3       ],
        x6y1   : [ 1, 2, 3    ],
        x12y1  : [ 1, 2       ],
        x15y1  : [ 2, 3       ],
        x21y1  : [ 1, 2, 3    ],
        x26y1  : [ 1, 2       ],
        x1y5   : [ 0, 2, 3    ],
        x6y5   : [ 0, 1, 2, 3 ],
        x9y5   : [ 1, 2, 3    ],
        x12y5  : [ 0, 1, 3    ],
        x15y5  : [ 0, 1, 3    ],
        x18y5  : [ 1, 2, 3    ],
        x21y5  : [ 0, 1, 2, 3 ],
        x26y5  : [ 0, 1, 2    ],
        x1y8   : [ 0, 3       ],
        x6y8   : [ 0, 1, 2    ],
        x9y8   : [ 0, 3       ],
        x12y8  : [ 1, 2       ],
        x15y8  : [ 2, 3       ],
        x18y8  : [ 0, 1       ],
        x21y8  : [ 0, 2, 3    ],
        x26y8  : [ 0, 1       ],
        x9y11  : [ 2, 3       ],
        x12y11 : [ 1, 3       ],
        x15y11 : [ 1, 3       ],
        x18y11 : [ 1, 2       ],
        x6y14  : [ 0, 1, 2, 3 ],
        x9y14  : [ 0, 1, 2    ],
        x18y14 : [ 0, 2, 3    ],
        x21y14 : [ 0, 1, 2, 3 ],
        x9y17  : [ 0, 2, 3    ],
        x18y17 : [ 0, 1, 2    ],
        x1y20  : [ 2, 3       ],
        x6y20  : [ 0, 1, 2, 3 ],
        x9y20  : [ 0, 1, 3    ],
        x12y20 : [ 1, 2       ],
        x15y20 : [ 2, 3       ],
        x18y20 : [ 0, 1, 3    ],
        x21y20 : [ 0, 1, 2, 3 ],
        x26y20 : [ 1, 2       ],
        x1y23  : [ 0, 3       ],
        x3y23  : [ 1, 2       ],
        x6y23  : [ 0, 2, 3    ],
        x9y23  : [ 1, 2, 3    ],
        x12y23 : [ 1, 3       ],
        x15y23 : [ 1, 3       ],
        x18y23 : [ 1, 2, 3    ],
        x21y23 : [ 0, 1, 2    ],
        x24y23 : [ 2, 3       ],
        x26y23 : [ 0, 1       ],
        x1y26  : [ 2, 3       ],
        x3y26  : [ 0, 1, 3    ],
        x6y26  : [ 0, 1       ],
        x9y26  : [ 0, 3       ],
        x12y26 : [ 1, 2       ],
        x15y26 : [ 2, 3       ],
        x18y26 : [ 0, 1       ],
        x21y26 : [ 0, 3       ],
        x24y26 : [ 0, 1, 3    ],
        x26y26 : [ 1, 2       ],
        x1y29  : [ 0, 3       ],
        x12y29 : [ 0, 1, 3    ],
        x15y29 : [ 0, 1, 3    ],
        x26y29 : [ 0, 1       ]
    };

    /** Board data */
    const energizers    = [{ x: 1, y: 3 }, { x: 26, y: 3 }, { x: 1, y: 23 }, { x: 26, y: 23 }];
    const pillAmount    = 244;
    const fruitTile     = { x: 13.25, y: 16.8333 };
    const fruitSize     = 20;
    const tileSize      = 12;
    const lineWidth     = 2;
    const halfLine      = lineWidth / 2;
    const bigRadius     = tileSize / 2;
    const smallRadius   = tileSize / 4;
    const eraseSize     = tileSize * 2;
    const boardCols     = boardMatrix[0].length;
    const boardRows     = boardMatrix.length;
    const canvasWidth   = tileSize * boardCols;
    const canvasHeight  = tileSize * boardRows;
    const scoreHeight   = tileSize * 2;
    const totalHeight   = canvasHeight + scoreHeight;
    const tunnelStart   = -tileSize / 2;
    const tunnelEnd     = tileSize * boardCols + tunnelStart;
    const ghostSize     = tileSize * 1.5;
    const blobRadius    = Math.round(tileSize / 1.5);
    const pillSize      = Math.round(tileSize * 0.16666);
    const energizerSize = Math.round(tileSize * 0.41666);
    const boardColor    = "rgb(0, 51, 255)";
    const startingPos   = { x: 14, y: 23 };
    const startingDir   = { x: -1, y:  0 };
    const eyesTarget    = { x: 13, y: 11 };

    /** @type {Canvas} The Game Canvas */
    let boardCanvas, screenCanvas, gameCanvas;


    /**
     * Returns the position at the middle of a tile
     * @param {Number} tile
     * @returns {Number}
     */
    function getTileCenter(tile) {
        return Math.round((tile + 0.5) * tileSize);
    }

    /**
     * Converts an x,y tile into an x,y position
     * @param {{x: Number, y: Number}} tile
     * @returns {{x: Number, y: Number}}
     */
    function tileToPos(tile) {
        return { x: tile.x * tileSize, y: tile.y * tileSize };
    }



    /**
     * The Board API
     */
    return {
        /**
         * Creates the Board
         * @returns {Void}
         */
        create() {
            boardCanvas  = new BoardCanvas();
            screenCanvas = new Canvas().init("screen");
            gameCanvas   = new GameCanvas();
        },

        /**
         * Returns the conetext for the board element
         * @returns {Canvas}
         */
        get boardCanvas() {
            return boardCanvas;
        },

        /**
         * Returns the conetext for the screen element
         * @returns {Canvas}
         */
        get screenCanvas() {
            return screenCanvas;
        },

        /**
         * Returns the conetext for the game element
         * @returns {Canvas}
         */
        get gameCanvas() {
            return gameCanvas;
        },



        /**
         * Clears the saved rects in the Game Canvas
         * @returns {Void}
         */
        clearGame() {
            gameCanvas.clearSavedRects();
        },

        /**
         * Draws the board
         * @param {Boolean} newLevel
         * @returns {Void}
         */
        drawBoard(newLevel) {
            boardCanvas.drawBoard(newLevel);
        },

        /**
         * Clears all the Canvas
         * @returns {Void}
         */
        clearAll() {
            boardCanvas.clear();
            gameCanvas.clear();
            screenCanvas.clear();
        },



        /**
         * Returns the width of the canvas
         * @returns {Number}
         */
        get width() {
            return canvasWidth;
        },

        /**
         * Returns the height of the canvas
         * @returns {Number}
         */
        get height() {
            return totalHeight;
        },

        /**
         * Returns the amount of columns of the matrix
         * @returns {Number}
         */
        get cols() {
            return boardCols;
        },

        /**
         * Returns the amount of rows of the matrix
         * @returns {Number}
         */
        get rows() {
            return boardRows;
        },

        /**
         * Returns the tile size
         * @returns {Number}
         */
        get tileSize() {
            return tileSize;
        },

        /**
         * Returns the line width
         * @returns {Number}
         */
        get lineWidth() {
            return lineWidth;
        },

        /**
         * Returns the half of the line width
         * @returns {Number}
         */
        get halfLine() {
            return halfLine;
        },

        /**
         * Returns the big radius
         * @returns {Number}
         */
        get bigRadius() {
            return bigRadius;
        },

        /**
         * Returns the small radius
         * @returns {Number}
         */
        get smallRadius() {
            return smallRadius;
        },

        /**
         * Returns the erase size
         * @returns {Number}
         */
        get eraseSize() {
            return eraseSize;
        },

        /**
         * Returns the board color
         * @returns {String}
         */
        get boardColor() {
            return boardColor;
        },

        /**
         * Returns an array with the position of the energizers
         * @returns {Array.<{x: Number, y: Number}>}
         */
        get energizers() {
            return energizers;
        },

        /**
         * Returns the amount of Pills in the board
         * @returns {Number}
         */
        get pillAmount() {
            return pillAmount;
        },

        /**
         * The tile of the fruit in the board
         * @returns {{x: Number, y: Number}}
         */
        get fruitTile() {
            return fruitTile;
        },

        /**
         * The position of the fruit in the board
         * @returns {{x: Number, y: Number}}
         */
        get fruitPos() {
            return tileToPos(fruitTile);
        },

        /**
         * The size of the fruit in the board
         * @returns {Number}
         */
        get fruitSize() {
            return fruitSize;
        },

        /**
         * The size of the pill in the board
         * @returns {Number}
         */
        get pillSize() {
            return pillSize;
        },

        /**
         * The size of the energizer in the board
         * @returns {Number}
         */
        get energizerSize() {
            return energizerSize;
        },

        /**
         * The ghost size in the board
         * @returns {Number}
         */
        get ghostSize() {
            return ghostSize;
        },

        /**
         * The blob radius in the board
         * @returns {Number}
         */
        get blobRadius() {
            return blobRadius;
        },

        /**
         * Returns the starting position of the blob
         * @returns {{x: Number, y: Number}}
         */
        get startingPos() {
            return { x: startingPos.x, y: startingPos.y };
        },

        /**
         * Returns the starting direction of the blob
         * @returns {{x: Number, y: Number}}
         */
        get startingDir() {
            return { x: startingDir.x, y: startingDir.y };
        },


        /**
         * Returns the eyes target
         * @returns {{x: Number, y: Number}}
         */
        get eyesTarget() {
            return eyesTarget;
        },

        /**
         * Returns the ghost starting tile depending if is on the pen
         * @param {Boolean} inPen
         * @returns {{x: Number, y: Number}}
         */
        getGhostStartTile(inPen) {
            return inPen ? { x: 13, y: 14 } : { x: 13, y: 11 };
        },

        /**
         * Returns the ghost starting turn depending if is on the pen
         * @param {Boolean} inPen
         * @returns {?{x: Number, y: Number}}
         */
        getGhostStartTurn(inPen) {
            return inPen ? { x: -1, y: 0 } : null;
        },


        /**
         * Returns the position at the middle of a tile
         * @param {{x: Number, y: Number}} tile
         * @returns {{x: Number, y: Number}}
         */
        getTileXYCenter(tile) {
            return {
                x : getTileCenter(tile.x),
                y : getTileCenter(tile.y)
            };
        },

        /**
         * Returns the position at the top-left corner of a tile
         * @param {Number} tile
         * @returns {Number}
         */
        getTileCorner(tile) {
            return Math.round(tile * tileSize);
        },

        /**
         * Returns the position of a tile in terms of the matrix coordinates
         * @param {Number} x
         * @param {Number} y
         * @returns {{x: Number, y: Number}}
         */
        getTilePos(x, y) {
            return {
                x : Math.floor(x / tileSize),
                y : Math.floor(y / tileSize)
            };
        },

        /**
         * Does a sumatory over all the tiles
         * @param {...{x: Number, y: Number}} tiles
         * @returns {{x: Number, y: Number}}
         */
        sumTiles(...tiles) {
            return tiles.reduce((last, current) => {
                return { x: last.x + current.x, y: last.y + current.y };
            }, { x: 0, y: 0 });
        },

        /**
         * Returns true if the given tiles are the same
         * @param {{x: Number, y: Number}} tile1
         * @param {{x: Number, y: Number}} tile2
         * @returns {Boolean}
         */
        equalTiles(tile1, tile2) {
            return tile1.x === tile2.x && tile1.y === tile2.y;
        },


        /**
         * Returns the rectangle for the Pill at the given position
         * @param {Number} x
         * @param {Number} y
         * @returns {{x: Number, y: Number, size: Number}}
         */
        getPillRect(x, y) {
            return {
                x    : Board.getTileCenter(x) - Board.pillSize / 2,
                y    : Board.getTileCenter(y) - Board.pillSize / 2,
                size : Board.pillSize
            };
        },

        /**
         * Returns the rectangle for the Fruit
         * @returns {{left: Number, right: Number, top: Number, bottom: Number}}
         */
        getFruitRect() {
            const pos  = Board.fruitPos;
            const size = Board.fruitSize / 3;

            return {
                left   : pos.x - size,
                right  : pos.x + size,
                top    : pos.y - size,
                bottom : pos.y + size
            };
        },


        /**
         * Returns a new position for a player if is at the end of the tunnel
         * @param {Number} x
         * @returns {Number}
         */
        tunnelEnds(x) {
            if (x < tunnelStart) {
                return tunnelEnd;
            }
            if (x > tunnelEnd) {
                return tunnelStart;
            }
            return x;
        },


        /**
         * Returns true if there is a wall at the given position
         * @param {Number} col
         * @param {Number} row
         * @returns {Boolean}
         */
        inBoard(col, row) {
            return row >= 0 && col >= 0 && row < boardRows && col < boardCols;
        },

        /**
         * Returns true if there is a wall at the given position
         * @param {Number} col
         * @param {Number} row
         * @returns {Boolean}
         */
        isWall(col, row) {
            return boardMatrix[row][col] === wallValue;
        },

        /**
         * Returns true if there is an intersection at the given position
         * @param {Number} col
         * @param {Number} row
         * @returns {Boolean}
         */
        isIntersection(col, row) {
            return boardMatrix[row][col] === interValue || boardMatrix[row][col] === interPillValue;
        },

        /**
         * Returns true if there is a tunnel at the given position
         * @param {Number} col
         * @param {Number} row
         * @returns {Boolean}
         */
        isTunnel(col, row) {
            return boardMatrix[row][col] === tunnelValue;
        },

        /**
         * Returns true if there can be a pill at the given position
         * @param {Number} col
         * @param {Number} row
         * @returns {Boolean}
         */
        hasPill(col, row) {
            return boardMatrix[row][col] === pillPathValue || boardMatrix[row][col] === interPillValue;
        },


        /**
         * Returns all the possible turns at a given position
         * @param {String} pos
         * @returns {Array.<Number>}
         */
        getTurns(pos) {
            return boardTurns[pos] || null;
        },

        /**
         * Converts a x,y object into a string
         * @param {{x: Number, y: Number}} tile
         * @returns {String}
         */
        tileToString(tile) {
            return `x${tile.x}y${tile.y}`;
        },

        /**
         * Transforms a number into an x,y direction
         * @param {Number} value
         * @returns {{x: Number, y: Number}}
         */
        numberToDir(value) {
            switch (value) {
            case 0:
                return { x:  0, y: -1 };   // Up
            case 1:
                return { x: -1, y:  0 };   // Left
            case 2:
                return { x:  0, y:  1 };   // Down
            case 3:
                return { x:  1, y:  0 };   // Right
            }
        },

        /**
         * Transforms an x,y direction into a number
         * @param {{x: Number, y: Number}} dir
         * @returns {Number}
         */
        dirToNumber(dir) {
            switch (this.tileToString(dir)) {
            case "x0y-1":
                return 0;   // Up
            case "x-1y0":
                return 1;   // Left
            case "x0y1":
                return 2;   // Down
            case "x1y0":
                return 3;   // Right
            }
        },


        getTileCenter,
        tileToPos
    };
}());
