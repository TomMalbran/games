/*jslint browser: true */
/*global Utils */

var Food = (function () {
    "use strict";
    
    var fruitnames = [ "Cherries", "Strawberry", "Peach", "Apple", "Grapes", "Galaxian", "Bell", "Key" ],
        enerValue  = 5,
        enerMult   = 0.41666,
        pillValue  = 1,
        pillMult   = 0.16666,
        pillColor  = "white",
        fruitDots1 = 174,
        fruitDots2 = 74;
    
    
    
    /**
     * @constructor
     * The Food Class
     * @param {Board} board
     */
    function Food(board) {
        this.board = board;
        this.ctx   = board.getBoardCanvas().getContext();
        
        this.init();
        this.createMatrix();
        this.createEnergizers();
    }
    
    /**
     * Initializes the instance
     */
    Food.prototype.init = function () {
        this.pillSize   = Math.round(this.board.getTileSize() * pillMult);
        this.total      = this.board.getPillAmount();
        this.minRadius  = this.pillSize;
        this.maxRadius  = Math.round(this.board.getTileSize() * enerMult);
        this.radius     = this.maxRadius;
        this.energizers = [];
        this.matrix     = [];
        this.mult       = -1;
        this.timer      = 0;
    };
    
    /**
     * Creates a Matrix with the positions of the pills and energizers
     */
    Food.prototype.createMatrix = function () {
        var i, j, self = this;
        for (i = 0; i < this.board.getBoardRows(); i += 1) {
            this.matrix[i] = [];
            for (j = 0; j < this.board.getBoardCols(); j += 1) {
                this.matrix[i][j] = this.board.hasPill(j, i) ? pillValue : 0;
            }
        }
        
        this.board.getEnergizers().forEach(function (ener) {
            self.matrix[ener.y][ener.x] = enerValue;
        });
    };
    
    /**
     * Creates a list with only the active energizers
     */
    Food.prototype.createEnergizers = function () {
        var self = this;
        this.energizers = [];
        
        this.board.getEnergizers().forEach(function (ener) {
            var x = self.board.getTileCenter(ener.x),
                y = self.board.getTileCenter(ener.y);
            
            if (self.matrix[ener.y][ener.x] === enerValue) {
                self.energizers.push({ x: x, y: y });
            }
        });
    };
    
    
    /**
     * Draws all the Pills and Energizers in the board
     */
    Food.prototype.draw = function () {
        this.drawPills();
        this.drawEnergizers(this.radius);
    };
    
    /**
     * Draws all the Pills in the board
     */
    Food.prototype.drawPills = function () {
        var self = this;
        this.ctx.save();
        this.ctx.fillStyle = pillColor;
        
        this.matrix.forEach(function (row, y) {
            row.forEach(function (cell, x) {
                var rect = self.getPillRect(x, y);
                if (cell === pillValue) {
                    self.ctx.fillRect(rect.x, rect.y, rect.size, rect.size);
                }
            });
        });
        
        this.ctx.restore();
    };
    
    /**
     * Clears a Pill at the given position
     * @param {number} x
     * @param {number} y
     */
    Food.prototype.clearPill = function (x, y) {
        var rect = this.getPillRect(x, y);
        this.ctx.clearRect(rect.x, rect.y, rect.size, rect.size);
    };
    
    /**
     * Returns the rectangle for the Pill at the given position
     * @param {number} x
     * @param {number} y
     * @return {{x: number, y: number, size: number}}
     */
    Food.prototype.getPillRect = function (x, y) {
        return {
            x    : this.board.getTileCenter(x) - this.pillSize / 2,
            y    : this.board.getTileCenter(y) - this.pillSize / 2,
            size : this.pillSize
        };
    };
    
    /**
     * Draws all the remaining Energizers with the given radius
     * @param {number} radius
     */
    Food.prototype.drawEnergizers = function (radius) {
        var self = this;
        this.energizers.forEach(function (element) {
            self.clearEnergizer(element.x, element.y);
            self.drawEnergizer(element.x, element.y, radius);
        });
    };
    
    /**
     * Draws an Energizer at the given position with the given radius
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     */
    Food.prototype.drawEnergizer = function (x, y, radius) {
        this.ctx.save();
        this.ctx.fillStyle = pillColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
    };
    
    /**
     * Clears an Energizer at the given position
     * @param {number} x
     * @param {number} y
     */
    Food.prototype.clearEnergizer = function (x, y) {
        this.ctx.clearRect(x - this.maxRadius, y - this.maxRadius, this.maxRadius * 2, this.maxRadius * 2);
    };
    
    /**
     * Does the Enerigizers animation
     */
    Food.prototype.wink = function () {
        this.calcRadius();
        this.drawEnergizers(this.radius);
    };
    
    /**
     * Calculates the Radius for the Energizers
     */
    Food.prototype.calcRadius = function () {
        this.radius += this.mult * 0.1;
        this.mult    = this.radius <= this.minRadius ? 1 : (this.radius >= this.maxRadius ? -1 : this.mult);
    };
    
    
    /**
     * Returns true if there is a Pill at the given cell
     * @param {number} col
     * @param {number} row
     */
    Food.prototype.isAtPill = function (col, row) {
        return this.matrix[row][col] > 0;
    };
    
    /**
     * The Blob eats the Pill at the given cell. Returns the value of the pill. 1 for dot, 5 for energizer
     * @param {number} col
     * @param {number} row
     * @return {number}
     */
    Food.prototype.eatPill = function (col, row) {
        var value = this.matrix[row][col],
            x     = this.board.getTileCenter(col),
            y     = this.board.getTileCenter(row);
        
        this.clearPill(col, row);
        this.matrix[row][col] = 0;
        this.total -= 1;
        
        if (this.isEnergizer(value)) {
            this.clearEnergizer(x, y);
            this.createEnergizers();
        }
        return value;
    };
    
    /**
     * Returns the amount of Pîlls left
     * return {number}
     */
    Food.prototype.getLeftPills = function () {
        return this.total;
    };
    
    /**
     * Returns true if the given value corresponds to the value of an energizer
     * @param {number} value
     * @return {boolean}
     */
    Food.prototype.isEnergizer = function (value) {
        return value === enerValue;
    };
    
    
    /*Food.prototype.eat = function (blob) {
        var col = blob.getTile().x,
            row = blob.getTile().y;
        
        if (this.timer > 0 && this.atFruit(blob)) {
            this.eatFruit();
        } else if (this.matrix[row][col] > 0) {
            this.eatDot(col, row);
            this.addFruit();
            return true;
        }
        return false;
    };*/
    
    
    // Fruits
    Food.prototype.reduceTimer = function (time) {
        if (this.timer > 0) {
            this.timer -= time;
            if (this.timer <= 0) {
                this.clearFruit();
            }
        }
    };
    
    Food.prototype.getFruitTime = function () {
        return Math.round(Math.random() * 1000) + 9000;
    };
    
    Food.prototype.addFruit = function () {
        if (this.total === fruitDots1 || this.total === fruitDots2) {
            this.timer = this.getFruitTime();
            this.drawFruit(pmData.fruitPos[0], pmData.fruitPos[1]);
        }
    };
    
    Food.prototype.eatFruit = function () {
        pmScore.fruit();
        this.clearFruit();
    };
    
    
    // Sub Functions
    Food.prototype.atFruit = function (blob) {
        var minX = pmData.fruitPos[0] - 2,
            maxX = pmData.fruitPos[0] + pmData.fruitSize - 2,
            minY = pmData.fruitPos[1] - 2,
            maxY = pmData.fruitPos[1] + pmData.fruitSize - 2;
        
        return (
            blob.getX() >= minX && blob.getX() <= maxX &&
            blob.getY() >= minY && blob.getY() <= maxY
        );
    };
    
    Food.prototype.getValue = function (col, row) {
        return this.matrix[col][row];
    };
    
    
    /**
     * Draws a Fruit
     */
    Food.prototype.drawFruit = function (x, y) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this["draw" + fruitnames[this.score.getLevelData("fruitType")]]();
        this.ctx.restore();
    };
    
    Food.prototype.clearFruit = function () {
        this.ctx.clearRect(pmData.fruitPos[0] - 1, pmData.fruitPos[1] - 1, pmData.fruitSize, pmData.fruitSize);
    };
    
    
    // Cherries
    Food.prototype.drawCherries = function () {
        this.ctx.fillStyle = "rgb(255, 0, 0)";
        this.ctx.beginPath();
        this.ctx.arc(10, 14, 4, 0, 2 * Math.PI);
        this.ctx.arc(4, 10, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.beginPath();
        this.ctx.arc(8, 15.5, 1.5, 0, 2 * Math.PI);
        this.ctx.arc(1.5, 11, 1.5, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = "rgb(0, 153, 0)";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(17, 1);
        this.ctx.quadraticCurveTo(9, 1, 5, 9);
        this.ctx.moveTo(17, 1);
        this.ctx.quadraticCurveTo(12, 3, 10, 12);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = "rgb(222, 151, 81)";
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(17, 1);
        this.ctx.lineTo(16, 2);
        this.ctx.stroke();
    };
    
    // Strawberry
    Food.prototype.drawStrawberry = function () {
        var i, dots = [ 3, 7, 5, 6, 4, 10, 7, 8, 6, 11, 7, 13, 9, 10, 9, 14, 10, 12, 11, 8, 12, 11, 14, 6, 14, 9 ];
        
        this.ctx.fillStyle = "rgb(222, 0, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(9, 3);
        this.ctx.quadraticCurveTo(17, 3, 17, 7);
        this.ctx.quadraticCurveTo(17, 14, 9, 17);
        this.ctx.quadraticCurveTo(1, 14, 1, 7);
        this.ctx.quadraticCurveTo(1, 3, 9, 3);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgb(0, 222, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(5, 3);
        this.ctx.lineTo(13, 3);
        this.ctx.lineTo(14, 4);
        this.ctx.lineTo(9, 7);
        this.ctx.lineTo(4, 4);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.fillRect(8, 0, 2, 4);
        
        for (i = 0; i < dots.length; i += 2) {
            this.ctx.fillRect(dots[i], dots[i + 1], 1, 1);
        }
    };
    
    // Peach
    Food.prototype.drawPeach = function () {
        this.ctx.fillStyle = "rgb(255, 181, 33)";
        this.ctx.beginPath();
        this.ctx.arc(6, 10, 5, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(12, 10, 5, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(10, 11, 7, 0, 0.5 * Math.PI, false);
        this.ctx.arc(8, 11, 7, 0.5 * Math.PI, Math.PI, false);
        this.ctx.fill();
        
        this.ctx.strokeStyle = "rgb(0, 222, 0)";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(6, 5);
        this.ctx.lineTo(14, 4);
        this.ctx.moveTo(14, 0);
        this.ctx.quadraticCurveTo(11, 0, 10, 7);
        this.ctx.stroke();
    };
    
    // Apple
    Food.prototype.drawApple = function () {
        this.ctx.fillStyle = "rgb(222, 0, 0)";
        this.ctx.beginPath();
        this.ctx.arc(6, 8, 5, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(12, 8, 5, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(10, 11, 7, 0, 0.5 * Math.PI, false);
        this.ctx.arc(13, 15, 3, 0.5 * Math.PI, Math.PI, false);
        this.ctx.arc(6, 15, 3, 0, 0.5 * Math.PI, false);
        this.ctx.arc(8, 11, 7, 0.5 * Math.PI, Math.PI, false);
        this.ctx.fill();
        
        this.ctx.strokeStyle = "rgb(0, 222, 0)";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.arc(3, 7, 7, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(13, 4, 4, Math.PI, 1.5 * Math.PI, false);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.beginPath();
        this.ctx.arc(7, 9, 4, Math.PI, 1.5 * Math.PI, false);
        this.ctx.stroke();
    };
    
    // Grapes
    Food.prototype.drawGrapes = function () {
        this.ctx.fillStyle = "rgb(0, 222, 0)";
        this.ctx.beginPath();
        this.ctx.arc(9, 11, 8, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = "rgb(74, 74, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(9, 4);
        this.ctx.lineTo(2, 11);
        this.ctx.lineTo(7, 16);
        this.ctx.moveTo(14, 6);
        this.ctx.lineTo(8, 12);
        this.ctx.lineTo(14, 18);
        this.ctx.moveTo(9, 6);
        this.ctx.lineTo(15, 12);
        this.ctx.lineTo(10, 17);
        this.ctx.moveTo(10, 14);
        this.ctx.lineTo(4, 18);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = "rgb(222, 148, 74)";
        this.ctx.beginPath();
        this.ctx.moveTo(4, 0);
        this.ctx.lineTo(5, 1);
        this.ctx.lineTo(12, 1);
        this.ctx.moveTo(9, 1);
        this.ctx.lineTo(9, 4);
        this.ctx.stroke();
    };
    
    // Galaxian
    Food.prototype.darwGalaxian = function () {
        this.ctx.fillStyle   = "rgb(255, 250, 55)";
        this.ctx.strokeStyle = "rgb(255, 250, 55)";
        this.ctx.beginPath();
        this.ctx.moveTo(1, 4);
        this.ctx.lineTo(17, 4);
        this.ctx.lineTo(9, 11);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(9, 11);
        this.ctx.lineTo(9, 18);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = "rgb(0, 51, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(1, 1);
        this.ctx.lineTo(1, 6);
        this.ctx.lineTo(8, 12);
        this.ctx.moveTo(17, 1);
        this.ctx.lineTo(17, 6);
        this.ctx.lineTo(10, 12);
        this.ctx.stroke();
        
        this.ctx.fillStyle   = "rgb(255, 0, 0)";
        this.ctx.strokeStyle = "rgb(255, 0, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(3, 5);
        this.ctx.lineTo(9, 0);
        this.ctx.lineTo(15, 5);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(9, 3);
        this.ctx.lineTo(9, 6);
        this.ctx.stroke();
    };
    
    // Bell
    Food.prototype.darwBell = function () {
        this.ctx.fillStyle = "rgb(255, 255, 33)";
        this.ctx.beginPath();
        this.ctx.moveTo(1, 15);
        this.ctx.quadraticCurveTo(1, 1, 9, 1);
        this.ctx.quadraticCurveTo(17, 1, 17, 15);
        this.ctx.fill();
        
        this.ctx.fillStyle = "rgb(0, 222, 222)";
        this.ctx.fillRect(3, 14, 12, 3);
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.fillRect(9, 14, 3, 3);
        
        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(8, 4);
        this.ctx.quadraticCurveTo(4, 4, 4, 13);
        this.ctx.stroke();
    };
    
    // Key
    Food.prototype.drawKey = function () {
        this.ctx.fillStyle = "rgb(0, 222, 222)";
        this.ctx.beginPath();
        this.ctx.arc(6, 3, 3, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(12, 3, 3, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(12, 5, 3, 0, 0.5 * Math.PI, false);
        this.ctx.arc(6, 5, 3, 0.5 * Math.PI, Math.PI, false);
        this.ctx.fill();
        this.ctx.clearRect(6, 2, 6, 2);
        
        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(8, 8);
        this.ctx.lineTo(8, 15);
        this.ctx.arc(9.5, 13.5, 1.5, Math.PI, 0, true);
        this.ctx.lineTo(11, 8);
        this.ctx.moveTo(11, 10);
        this.ctx.lineTo(14, 10);
        this.ctx.moveTo(11, 13);
        this.ctx.lineTo(14, 13);
        this.ctx.stroke();
    };

    
    
    // The public API
    return Food;
}());