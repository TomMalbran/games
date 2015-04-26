/*jslint browser: true */
/*global Utils */

var Board = (function () {
    "use strict";
    
    /** @const Data used by the algorithms */
    var drawTShapes = {
            "down"  : { radians: 0,   x:  0, y:  0 },
            "left"  : { radians: 0.5, x:  0, y: -5 },
            "right" : { radians: 1.5, x: -1, y:  0 },
            "up"    : { radians: 1,   x: -1, y: -5 }
        },
        radians = {
            "top-left"     : { from:   1, to: 1.5 },
            "top-right"    : { from: 1.5, to:   2 },
            "bottom-right" : { from:   0, to: 0.5 },
            "bottom-left"  : { from: 0.5, to:   1 }
        },
        corners = {
            "top-left"     : { x:  1, y:  1 },
            "top-right"    : { x: -1, y:  1 },
            "bottom-right" : { x: -1, y: -1 },
            "bottom-left"  : { x:  1, y: -1 }
        },
        smallCorners = {
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
        },
    
    /**
     * @const The Board MAtrix (28x31) and the Values
     * 0 Wall | 1 Path | 2 Pill on Path | 3 Intersection | 4 Pill on Interection | 5 Tunnel
     */
        wallValue      = 0,
        pillPathValue  = 2,
        interValue     = 3,
        interPillValue = 4,
        tunnelValue    = 5,
        
        boardMatrix    = [
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
        ],
    
    /**
     * @const Possible Turns at the Intersections
     * 0 Up | 1 Left | 2 Down | 3 Right
     */
        boardTurns = {
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
        },
    
    /** @const Board data */
        energizers     = [{ x: 1, y: 3 }, { x: 26, y: 3 }, { x: 1, y: 23 }, { x: 26, y: 23 }],
        pillAmount     = 244,
        tileSize       = 12,
        lineWidth      = 2,
        halthLine      = lineWidth / 2,
        bigRadius      = tileSize / 2,
        smallRadius    = tileSize / 4,
        eraseSize      = tileSize * 2,
        boardCols      = boardMatrix[0].length,
        boardRows      = boardMatrix.length,
        canvasWidth    = tileSize * boardCols,
        canvasHeight   = tileSize * boardRows,
        scoreHeight    = tileSize * 2,
        totalHeight    = canvasHeight + scoreHeight,
        tunnelStart    = -tileSize / 2,
        tunnelEnd      = tileSize * boardCols + tunnelStart,
        boardColor     = "rgb(0, 51, 255)";
    
    
    
    /**
     * @constructor
     * @private
     * The Canvas Base Class
     */
    function Canvas() {
        return undefined;
    }
    
    /**
     * Initializes the Canvas Object
     * @param {string} name
     */
    Canvas.prototype.init = function (name) {
        var canvas    = document.querySelector("." + name);
        canvas.width  = canvasWidth;
        canvas.height = totalHeight;
        
        this.ctx              = canvas.getContext("2d");
        this.ctx.font         = "2em 'Whimsy TT'";
        this.ctx.fillStyle    = "white";
        this.ctx.textAlign    = "center";
        this.ctx.textBaseline = "middle";
        
        this.rects            = [];
    };
    
    /**
     * Returns the conetext for the board element
     * @return {RenderingContext}
     */
    Canvas.prototype.getContext = function () {
        return this.ctx;
    };
    
    /**
     * Fills the canvas with black at the given alpha value
     * @param {number} alpha
     * @param {number=} x
     * @param {number=} y
     * @param {number=} width
     * @param {number=} height
     */
    Canvas.prototype.fill = function (alpha, x, y, width, height) {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
        this.ctx.fillRect(x || 0, y || 0, width || canvasWidth, height || totalHeight);
        this.ctx.restore();
    };
    
    /**
     * Clear the entire board
     */
    Canvas.prototype.clear = function () {
        this.ctx.clearRect(0, 0, canvasWidth, totalHeight);
        this.rects = [];
    };
    
    /**
     * Clears only the saved rects
     */
    Canvas.prototype.clearSavedRects = function () {
        var self = this;
        this.rects.forEach(function (rect) {
            self.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
            if (rect.alpha) {
                self.fill(rect.alpha, rect.x, rect.y, rect.width, rect.height);
            }
        });
        this.rects = [];
    };
    
    /**
     * Saves a new position to clear in the future
     * @param {number} x
     * @param {number} y
     */
    Canvas.prototype.savePos = function (x, y) {
        this.rects.push({
            x      : x - eraseSize / 2,
            y      : y - eraseSize / 2,
            width  : eraseSize,
            height : eraseSize
        });
    };
    
    /**
     * Saves a new rectangle to clear in the future
     * @param {{x: number, y: number, width: number, height: number, alpha: ?number}} data
     */
    Canvas.prototype.saveRect = function (data) {
        this.rects.push(data);
    };
    
    /**
     * Draws the Text in the canvas
     * @param {{text: string, pos: {x: number, y: number}, color: string, size: ?numer, align: ?string}} data
     */
    Canvas.prototype.drawText = function (data) {
        var metrics, width, height, mult = 0.5;
        
        this.ctx.save();
        if (data.size) {
            this.ctx.font = data.size + "em 'Whimsy TT'";
        }
        if (data.align) {
            this.ctx.textAlign = data.align;
            mult = data.align === "left" ? 1 : 0;
        }
        this.ctx.fillStyle = data.color;
        this.ctx.fillText(data.text, data.pos.x * tileSize, data.pos.y * tileSize);
        this.ctx.restore();
        
        metrics = this.ctx.measureText(data.text);
        width   = metrics.width + tileSize;
        height  = data.size ? (data.size + 0.5) * tileSize : 2.5 * tileSize;
        
        this.saveRect({
            x      : data.pos.x * tileSize - mult * width,
            y      : data.pos.y * tileSize - height / 2,
            width  : width,
            height : height,
            alpha  : data.alpha || 0
        });
    };
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Canvas}
     * The Screen Canvas Class
     */
    function ScreenCanvas() {
        this.init("screen");
    }
    
    ScreenCanvas.prototype = Object.create(Canvas.prototype);
    ScreenCanvas.prototype.constructor = ScreenCanvas;
    ScreenCanvas.prototype.parentClass = Canvas.prototype;
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Canvas}
     * The Game Canvas Class
     * @param {Board} parent
     */
    function GameCanvas(parent) {
        this.parent = parent;
        this.init("game");
    }
    
    GameCanvas.prototype = Object.create(Canvas.prototype);
    GameCanvas.prototype.constructor = GameCanvas;
    GameCanvas.prototype.parentClass = Canvas.prototype;
    
    /**
     * Draws the Ghosts Targets for testing
     * @param {Array.<Ghost>} ghosts
     */
    GameCanvas.prototype.drawTargets = function (ghosts) {
        var self = this;
        
        this.ctx.save();
        ghosts.forEach(function (ghost) {
            self.ctx.fillStyle   = ghost.getBodyColor();
            self.ctx.strokeStyle = ghost.getBodyColor();
            
            var tile = this.parent.getTileXYCenter(ghost.getTargetTile());
            self.ctx.beginPath();
            self.ctx.moveTo(ghost.getX(), ghost.getY());
            self.ctx.lineTo(tile.x, tile.y);
            self.ctx.fillRect(tile.x - 4, tile.y - 4, 8, 8);
            self.ctx.stroke();
        });
        this.ctx.restore();
    };
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Canvas}
     * The Board Canvas Class
     * @param {Board} parent
     */
    function BoardCanvas(parent) {
        this.parent = parent;
        this.init("board");
        
        this.ctx.lineWidth   = lineWidth;
        this.ctx.strokeStyle = boardColor;
    }
    
    BoardCanvas.prototype = Object.create(Canvas.prototype);
    BoardCanvas.prototype.constructor = BoardCanvas;
    BoardCanvas.prototype.parentClass = Canvas.prototype;
    
    /**
     * Draw the Board
     * @param {boolean} newLevel
     */
    BoardCanvas.prototype.drawBoard = function (newLevel) {
        this.drawGhostsPen();
        
        this.ctx.save();
        this.ctx.strokeStyle = newLevel ? "white" : boardColor;
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
    };
    
    /**
     * Draws the Ghosts Pen House
     */
    BoardCanvas.prototype.drawGhostsPen = function () {
        this.ctx.strokeRect(10.5 * tileSize,             12.5 * tileSize,             7 * tileSize,             4 * tileSize);
        this.ctx.strokeRect(11   * tileSize - halthLine, 13   * tileSize - halthLine, 6 * tileSize + lineWidth, 3 * tileSize + lineWidth);
        this.ctx.strokeRect(13   * tileSize - halthLine, 12.5 * tileSize,             2 * tileSize + lineWidth, tileSize / 2 - halthLine);
        this.ctx.clearRect(13    * tileSize,             12.5 * tileSize - halthLine, 2 * tileSize,             tileSize / 2 + halthLine);
        
        this.ctx.save();
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(13   * tileSize + halthLine, 12.5 * tileSize + lineWidth, 2 * tileSize - lineWidth, halthLine);
        this.ctx.restore();
    };
    
    /**
     * Draws the Board outer border
     */
    BoardCanvas.prototype.drawOuterBorder = function () {
        this.ctx.beginPath();
        
        // Top Corners
        this.drawOuterBigCorner(0,  0, "top-left");
        this.drawOuterBigCorner(27, 0, "top-right");
        
        // Right Tunnel
        this.drawOuterBigCorner(27,    9, "bottom-right");
        this.drawOuterSmallCorner(22,  9, "top-left");
        this.drawOuterSmallCorner(22, 13, "bottom-left");
        this.ctx.lineTo(28 * tileSize, 13 * tileSize + halthLine);
        this.ctx.moveTo(28 * tileSize, 16 * tileSize - halthLine);
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
        this.ctx.lineTo(0, 16 * tileSize - halthLine);
        this.ctx.moveTo(0, 13 * tileSize + halthLine);
        this.drawOuterSmallCorner(5,  13, "bottom-right");
        this.drawOuterSmallCorner(5,   9, "top-right");
        this.drawOuterBigCorner(0,     9, "bottom-left");
        
        this.ctx.lineTo(halthLine, bigRadius + halthLine);
        this.ctx.stroke();
    };
    
    /**
     * Draws the Board inner border
     */
    BoardCanvas.prototype.drawInnerBorder = function () {
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
        this.ctx.lineTo(28 * tileSize, 13.5 * tileSize);
        this.ctx.moveTo(28 * tileSize, 15.5 * tileSize);
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
        this.ctx.lineTo(0, 15.5 * tileSize);
        this.ctx.moveTo(0, 13.5 * tileSize);
        this.drawInnerCorner(5,  13, "bottom-right", true,  true);
        this.drawInnerCorner(5,   9, "top-right",    true,  true);
        this.drawInnerCorner(0,   9, "bottom-left",  false, false);
        this.ctx.lineTo(tileSize / 2, tileSize / 2 + smallRadius);
        
        this.ctx.stroke();
    };
    
    
    /**
     * Draws a drawRectangle at the given position with the given size
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    BoardCanvas.prototype.drawRectangle = function (x, y, width, height) {
        this.ctx.save();
        this.ctx.translate(x * tileSize, y * tileSize);
        
        this.ctx.beginPath();
        this.drawInnerCorner(0,                  0, "top-left",     true, false);
        this.drawInnerCorner(width - 1,          0, "top-right",    true, false);
        this.drawInnerCorner(width - 1, height - 1, "bottom-right", true, false);
        this.drawInnerCorner(0,         height - 1, "bottom-left",  true, false);
        this.ctx.closePath();
        
        this.ctx.stroke();
        this.ctx.restore();
    };
    
    /**
     * Draws a t shape at the given position and with the given properties
     * @param {number} x
     * @param {number} y
     * @param {number} left
     * @param {number} right
     * @param {string} type
     */
    BoardCanvas.prototype.drawTShape = function (x, y, left, right, type) {
        var data  = drawTShapes[type],
            width = left + right;
        
        this.ctx.save();
        this.ctx.translate(x * tileSize, y * tileSize);
        this.ctx.rotate(data.radians * Math.PI);
        this.ctx.translate(data.x * width * tileSize, data.y * tileSize);
        
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
    };
    
    /**
     * Draws an l shape at the given position
     * @param {number} x
     * @param {number} y
     * @param {boolean} reflect
     */
    BoardCanvas.prototype.drawLShape = function (x, y, reflect) {
        this.ctx.save();
        this.ctx.translate(x * tileSize, y * tileSize);
        
        if (reflect) {
            this.ctx.transform(-1, 0, 0, 1, 0, 0);
            this.ctx.translate(-4 * tileSize, 0);
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
    };
    
    
    /**
     * Draws a corner for the outer line with a big angle
     * @param {number} x
     * @param {number} y
     * @param {string} type
     */
    BoardCanvas.prototype.drawOuterBigCorner = function (x, y, type) {
        var data = corners[type],
            pos  = {
                x : x * tileSize + bigRadius + data.x * halthLine,
                y : y * tileSize + bigRadius + data.y * halthLine
            };
        
        this.corner(pos, bigRadius, type, false);
    };
    
    /**
     * Draws a corner for the outer line with a small angle
     * @param {number} x
     * @param {number} y
     * @param {string} type
     */
    BoardCanvas.prototype.drawOuterSmallCorner = function (x, y, type) {
        var radius = corners[type],
            data   = smallCorners[type],
            pos    = {
                x : (x + data.x.cell) * tileSize + radius.x * smallRadius + data.x.line * halthLine,
                y : (y + data.y.cell) * tileSize + radius.y * smallRadius + data.y.line * halthLine
            };
        
        this.corner(pos, smallRadius, type, true);
    };
    
    /**
     * Draws a corner for the board
     * @param {number} x
     * @param {number} y
     * @param {string} type
     * @param {boolean} isBig
     * @param {boolean} anitclockwise
     */
    BoardCanvas.prototype.drawInnerCorner = function (x, y, type, isBig, anitclockwise) {
        var radius = isBig ? bigRadius : smallRadius,
            data   = corners[type],
            pos    = {
                x : (x + 0.5) * tileSize + data.x * radius,
                y : (y + 0.5) * tileSize + data.y * radius
            };
        
        this.corner(pos, radius, type, anitclockwise);
    };
    
    /**
     * Draws a corner at the given position and with the given radius and type
     * @param {{x: number, y: number}} pos
     * @param {number} radius
     * @param {string} type
     * @param {boolean} anitclockwise
     */
    BoardCanvas.prototype.corner = function (pos, radius, type, anitclockwise) {
        var rad    = radians[type],
            result = [rad.from * Math.PI, rad.to * Math.PI];
        
        if (anitclockwise) {
            result.reverse();
        }
        rad = { from: result[0], to: result[1] };
        
        this.ctx.arc(pos.x, pos.y, radius, rad.from, rad.to, anitclockwise);
    };
    
    
    /**
     * Draws lines over the board for testing
     */
    BoardCanvas.prototype.drawLines = function () {
        var i;
        this.ctx.strokeStyle = "#CCC";
        this.ctx.lineWidth   = 1;
        this.ctx.beginPath();
        
        for (i = 0; i < boardRows; i += 1) {
            this.ctx.moveTo(0,           i * tileSize);
            this.ctx.lineTo(canvasWidth, i * tileSize);
        }
        for (i = 0; i < boardCols; i += 1) {
            this.ctx.moveTo(i * tileSize, 0);
            this.ctx.lineTo(i * tileSize, canvasHeight);
        }
        this.ctx.stroke();
    };
    
    /**
     * Draws the intersections over the board for testing
     */
    BoardCanvas.prototype.drawIntersections = function () {
        var self = this;
        
        Object.keys(boardTurns).forEach(function (key) {
            var coords = key.replace("x", "").split("y"),
                x      = self.parent.getTileCorner(Number(coords[0])),
                y      = self.parent.getTileCorner(Number(coords[1]));
            
            self.ctx.fillRect(x, y, tileSize, tileSize);
            self.ctx.save();
            self.ctx.strokeStyle = "white";
            
            boardTurns[key].forEach(function (value) {
                var dir = self.parent.numberToDir(value),
                    bx  = self.parent.getTileCorner(Number(coords[0]) + dir.x),
                    by  = self.parent.getTileCorner(Number(coords[1]) + dir.y);
                
                self.ctx.strokeRect(bx, by, tileSize, tileSize);
            });
            self.ctx.restore();
        });
    };
    
    
    
    
    /**
     * @constructor
     * The Board Class
     */
    function Board() {
        this.boardCanvas  = new BoardCanvas(this);
        this.screenCanvas = new ScreenCanvas();
        this.gameCanvas   = new GameCanvas(this);
    }
    
    /**
     * Returns the conetext for the board element
     * @return {Canvas}
     */
    Board.prototype.getBoardCanvas = function () {
        return this.boardCanvas;
    };
    
    /**
     * Returns the conetext for the screen element
     * @return {Canvas}
     */
    Board.prototype.getScreenCanvas = function () {
        return this.screenCanvas;
    };
    
    /**
     * Returns the conetext for the game element
     * @return {Canvas}
     */
    Board.prototype.getGameCanvas = function () {
        return this.gameCanvas;
    };
    
    /**
     * Clears the saved rects in the Game Canvas
     */
    Board.prototype.clearGame = function () {
        this.gameCanvas.clearSavedRects();
    };
    
    
    /**
     * Draws the board
     * @param {boolean} newLevel
     */
    Board.prototype.drawBoard = function (newLevel) {
        this.boardCanvas.drawBoard(newLevel);
    };
    
    /**
     * Clears all the Canvas
     */
    Board.prototype.clearAll = function () {
        this.boardCanvas.clear();
        this.gameCanvas.clear();
        this.screenCanvas.clear();
    };
    
    /**
     * Returns the width of the canvas
     * @return {number}
     */
    Board.prototype.getWidth = function () {
        return canvasWidth;
    };
    
    /**
     * Returns the amount of columns of the matrix
     * @return {number}
     */
    Board.prototype.getBoardCols = function () {
        return boardCols;
    };
    
    /**
     * Returns the amount of rows of the matrix
     * @return {number}
     */
    Board.prototype.getBoardRows = function () {
        return boardRows;
    };
    
    /**
     * Returns the tile size
     * @return {number}
     */
    Board.prototype.getTileSize = function () {
        return tileSize;
    };
    
    /**
     * Returns the position at the middle of a tile
     * @param {number} tile
     * @return {number}
     */
    Board.prototype.getTileCenter = function (tile) {
        return Math.round((tile + 0.5) * tileSize);
    };
    
    /**
     * Returns the position at the middle of a tile
     * @param {{x: number, y: number}} tile
     * @return {{x: number, y: number}}
     */
    Board.prototype.getTileXYCenter = function (tile) {
        return { x: this.getTileCenter(tile.x), y: this.getTileCenter(tile.y) };
    };
    
    /**
     * Returns the position at the top-left corner of a tile
     * @param {number} tile
     * @return {number}
     */
    Board.prototype.getTileCorner = function (tile) {
        return Math.round(tile * tileSize);
    };
    
    /**
     * Returns the position of a tile in terms of the matrix coordinates
     * @param {number} x
     * @param {number} y
     */
    Board.prototype.getTilePos = function (x, y) {
        return {
            x : Math.floor(x / tileSize),
            y : Math.floor(y / tileSize)
        };
    };
    
    /**
     * Returns a new position for a player if is at the end of the tunnel
     * @param {number} x
     * @return {number}
     */
    Board.prototype.tunnelEnds = function (x) {
        if (x < tunnelStart) {
            return tunnelEnd;
        }
        if (x > tunnelEnd) {
            return tunnelStart;
        }
        return x;
    };
    
    
    /**
     * Returns true if there is a wall at the given position
     * @param {number} col
     * @param {number} row
     * @return {boolean}
     */
    Board.prototype.isWall = function (col, row) {
        return boardMatrix[row][col] === wallValue;
    };
    
    /**
     * Returns true if there is an intersection at the given position
     * @param {number} col
     * @param {number} row
     * @return {boolean}
     */
    Board.prototype.isIntersection = function (col, row) {
        return boardMatrix[row][col] === interValue || boardMatrix[row][col] === interPillValue;
    };
    
    /**
     * Returns true if there is a tunnel at the given position
     * @param {number} col
     * @param {number} row
     * @return {boolean}
     */
    Board.prototype.isTunnel = function (col, row) {
        return boardMatrix[row][col] === tunnelValue;
    };
    
    /**
     * Returns an array with the position of the energizers
     * @return {Array.<{x: number, y: number}>}
     */
    Board.prototype.getEnergizers = function () {
        return energizers;
    };
    
    /**
     * Returns the amount of Pills in the board
     * @return {number}
     */
    Board.prototype.getPillAmount = function () {
        return pillAmount;
    };
    
    /**
     * Returns true if there can be a pill at the given position
     * @param {number} col
     * @param {number} row
     * @return {boolean}
     */
    Board.prototype.hasPill = function (col, row) {
        return boardMatrix[row][col] === pillPathValue || boardMatrix[row][col] === interPillValue;
    };
    
    
    /**
     * Returns all the possible turns at a given position
     * @param {string} pos
     * @return {Array.<number>}
     */
    Board.prototype.getTurns = function (pos) {
        return boardTurns[pos] || null;
    };
    
    /**
     * Converts a x,y object into a string
     * @param {{x: number, y: number}} tile
     * @return {string}
     */
    Board.prototype.tileToString = function (tile) {
        return "x" + String(tile.x) + "y" + String(tile.y);
    };
    
    /**
     * Transforms a number into an x,y direction
     * @param {number} value
     * @return {{x: number, y: number}}
     */
    Board.prototype.numberToDir = function (value) {
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
    };
    
    /**
     * Transforms an x,y direction into a number
     * @param {{x: number, y: number}} dir
     * @return {number}
     */
    Board.prototype.dirToNumber = function (dir) {
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
    };
    
    
    
    // The public API
    return Board;
}());