/*jslint browser: true */
/*global Blob, Utils */

var Score = (function () {
    "use strict";
    
    /** @const The data used for the levels 1 to 21. The levels after 21 use the data of level 21 */
    var levelsData = [
            { // 1
                ghostSpeed        : 0.75,                           // Normal Ghost speed
                tunnelSpeed       : 0.4,                            // Ghost speed in the tunel
                pmSpeed           : 0.8,                            // Normal Pacman speed
                eatingSpeed       : 0.71,                           // Pacman speed while eating
                ghostFrightSpeed  : 0.5,                            // Ghost speed in Fright mode
                pmFrightSpeed     : 0.9,                            // Pacman speed in Fright mode
                eatingFrightSpeed : 0.79,                           // Pacman speed in Fright mode while eating
                elroyDotsLeft1    : 20,                             // How many dots left before Blinky "Cruise Elroy" mode 1
                elroySpeed1       : 0.8,                            // The speed of Blinky "Cruise Elroy" mode 1
                elroyDotsLeft2    : 10,                             // How many dots left before Blinky "Cruise Elroy" mode 2
                elroySpeed2       : 0.85,                           // The speed of Blinky "Cruise Elroy" mode 2
                fruitType         : 1,                              // The type of fruit for this level
                fruitScore        : 100,                            // The score when catching a fruit
                frightTime        : 6,                              // The fright mode time
                frightBlinks      : 5,                              // The amount of blinks before turning back
                switchTimes       : [ 7, 20, 7, 20, 5, 20, 5, 1 ],  // The times between scatter, chase, scatter... modes 
                penForceTime      : 4,                              // The time after a ghost leaves the pen while the pacman is not eating dots
                penLeavingLimit   : [ 0, 0, 30, 60 ]                // Amount of dots before each ghost leaves the pen
            },
            { // 2
                ghostSpeed        : 0.85,
                tunnelSpeed       : 0.45,
                pmSpeed           : 0.9,
                eatingSpeed       : 0.79,
                ghostFrightSpeed  : 0.55,
                pmFrightSpeed     : 0.95,
                eatingFrightSpeed : 0.83,
                elroyDotsLeft1    : 30,
                elroySpeed1       : 0.9,
                elroyDotsLeft2    : 15,
                elroySpeed2       : 0.95,
                fruitType         : 2,
                fruitScore        : 300,
                frightTime        : 5,
                frightBlinks      : 5,
                switchTimes       : [ 7, 20, 7, 20, 5, 1033, 1 / 60, 1 ],
                penForceTime      : 4,
                penLeavingLimit   : [ 0, 0, 0, 50 ]
            },
            { // 3
                ghostSpeed        : 0.85,
                tunnelSpeed       : 0.45,
                pmSpeed           : 0.9,
                eatingSpeed       : 0.79,
                ghostFrightSpeed  : 0.55,
                pmFrightSpeed     : 0.95,
                eatingFrightSpeed : 0.83,
                elroyDotsLeft1    : 40,
                elroySpeed1       : 0.9,
                elroyDotsLeft2    : 20,
                elroySpeed2       : 0.95,
                fruitType         : 3,
                fruitScore        : 500,
                frightTime        : 4,
                frightBlinks      : 5,
                switchTimes       : [ 7, 20, 7, 20, 5, 1033, 1 / 60, 1 ],
                penForceTime      : 4,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 4
                ghostSpeed        : 0.85,
                tunnelSpeed       : 0.45,
                pmSpeed           : 0.9,
                eatingSpeed       : 0.79,
                ghostFrightSpeed  : 0.55,
                pmFrightSpeed     : 0.95,
                eatingFrightSpeed : 0.83,
                elroyDotsLeft1    : 40,
                elroySpeed1       : 0.9,
                elroyDotsLeft2    : 20,
                elroySpeed2       : 0.95,
                fruitType         : 3,
                fruitScore        : 500,
                frightTime        : 3,
                frightBlinks      : 5,
                switchTimes       : [ 7, 20, 7, 20, 5, 1033, 1 / 60, 1 ],
                penForceTime      : 4,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 5
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 40,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 20,
                elroySpeed2       : 10.05,
                fruitType         : 4,
                fruitScore        : 700,
                frightTime        : 2,
                frightBlinks      : 5,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 6
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 50,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 25,
                elroySpeed2       : 10.05,
                fruitType         : 4,
                fruitScore        : 700,
                frightTime        : 5,
                frightBlinks      : 5,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 7
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 50,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 25,
                elroySpeed2       : 1.05,
                fruitType         : 5,
                fruitScore        : 1000,
                frightTime        : 2,
                frightBlinks      : 5,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 8
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 50,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 25,
                elroySpeed2       : 1.05,
                fruitType         : 5,
                fruitScore        : 1000,
                frightTime        : 2,
                frightBlinks      : 5,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 9
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 60,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 30,
                elroySpeed2       : 1.05,
                fruitType         : 6,
                fruitScore        : 2000,
                frightTime        : 1,
                frightBlinks      : 3,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 10
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 60,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 30,
                elroySpeed2       : 1.05,
                fruitType         : 6,
                fruitScore        : 2000,
                frightTime        : 5,
                frightBlinks      : 5,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 11
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 60,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 30,
                elroySpeed2       : 1.05,
                fruitType         : 7,
                fruitScore        : 3000,
                frightTime        : 2,
                frightBlinks      : 5,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 12
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 80,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 40,
                elroySpeed2       : 1.05,
                fruitType         : 7,
                fruitScore        : 3000,
                frightTime        : 1,
                frightBlinks      : 3,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 13
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 80,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 40,
                elroySpeed2       : 1.05,
                fruitType         : 8,
                fruitScore        : 5000,
                frightTime        : 1,
                frightBlinks      : 3,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 14
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 80,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 40,
                elroySpeed2       : 1.05,
                fruitType         : 8,
                fruitScore        : 5000,
                frightTime        : 3,
                frightBlinks      : 5,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 15
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 100,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 50,
                elroySpeed2       : 1.05,
                fruitType         : 8,
                fruitScore        : 5000,
                frightTime        : 1,
                frightBlinks      : 3,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 16
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 100,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 50,
                elroySpeed2       : 1.05,
                fruitType         : 8,
                fruitScore        : 5000,
                frightTime        : 1,
                frightBlinks      : 3,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 17
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 100,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 50,
                elroySpeed2       : 1.05,
                fruitType         : 8,
                fruitScore        : 5000,
                frightTime        : 0,
                frightBlinks      : 0,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 18
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 100,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 50,
                elroySpeed2       : 1.05,
                fruitType         : 8,
                fruitScore        : 5000,
                frightTime        : 1,
                frightBlinks      : 3,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 19
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 120,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 60,
                elroySpeed2       : 1.05,
                fruitType         : 8,
                fruitScore        : 5000,
                frightTime        : 0,
                frightBlinks      : 0,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 20
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 1,
                eatingSpeed       : 0.87,
                ghostFrightSpeed  : 0.6,
                pmFrightSpeed     : 1,
                eatingFrightSpeed : 0.87,
                elroyDotsLeft1    : 120,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 60,
                elroySpeed2       : 1.05,
                fruitType         : 8,
                fruitScore        : 5000,
                frightTime        : 0,
                frightBlinks      : 0,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            },
            { // 21+
                ghostSpeed        : 0.95,
                tunnelSpeed       : 0.5,
                pmSpeed           : 0.9,
                eatingSpeed       : 0.79,
                ghostFrightSpeed  : 0.75,
                pmFrightSpeed     : 0.9,
                eatingFrightSpeed : 0.79,
                elroyDotsLeft1    : 120,
                elroySpeed1       : 1,
                elroyDotsLeft2    : 60,
                elroySpeed2       : 1.05,
                fruitType         : 8,
                fruitScore        : 5000,
                frightTime        : 0,
                frightBlinks      : 0,
                switchTimes       : [ 5, 20, 5, 20, 5, 1037, 1 / 60, 1 ],
                penForceTime      : 3,
                penLeavingLimit   : [ 0, 0, 0, 0 ]
            }
        ],
    
    /** @const Data for the Scores */
        extraLife   = 10000,
        pillMult    = 10,
        eyesBonus   = 12000,
        textTop     = 32.2,
        scoreLeft   = 3.2,
        livesLeft   = 16.3,
        scoreMargin = 0.5,
        scoreWidth  = 6,
        scoreHeight = 2,
        scoreColor  = "rgb(255, 255, 51)",
        blobTile    = { x: 19.5, y: 31.8 },
        blobDir     = { x: -1, y:  0 },
        blobMult    = 1.4;
    
    
    
    /**
     * @constructor
     * @private
     * @extends {Blob}
     * The Demo Blob Class
     * @param {Board} board
     * @param {Score} score
     */
    function ScoreBlob(board, score, number) {
		this.init(board, score, board.getBoardCanvas());
        
        this.x   = this.board.getTileCenter(blobTile.x + number * blobMult);
		this.y   = this.board.getTileCenter(blobTile.y);
        this.dir = Object.create(blobDir);
	}
    
    ScoreBlob.prototype = Object.create(Blob.prototype);
    ScoreBlob.prototype.constructor = ScoreBlob;
    ScoreBlob.prototype.parentClass = Blob.prototype;
    
    /**
     * Clears the Blob
     */
    ScoreBlob.prototype.clear = function () {
        this.ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    };
    
    
    
    
    /**
     * @constructor
     * The Score Class
     * @param {Board}      board
     * @param {Sounds}     sounds
     * @param {Animations} animations
     */
    function Score(board, sounds, animations) {
        this.board  = board;
        this.sounds = sounds;
        this.anims  = animations;
        
        this.canvas = board.getBoardCanvas();
        this.ctx    = this.canvas.getContext();
        this.size   = board.getTileSize();
        
        this.score  = 0;
        this.level  = 1;
        this.lives  = 2;
        this.bonus  = 0;
        this.ghosts = 0;
        
        this.blobs  = [
            new ScoreBlob(board, this, 0),
            new ScoreBlob(board, this, 1)
        ];
    }
    
    /**
     * Draws the Score, Blobs and Fruit in the board
     */
    Score.prototype.draw = function () {
        this.drawTexts();
        this.drawScore();
        
        this.blobs.forEach(function (blob) {
            blob.draw();
        });
//        pmFruit.draw(pmBoard.getBoard(), 313, 378);
    };
    
    
    // Change Functions
    Score.prototype.addScore = function (amount) {
        this.score += amount;
        if (this.score > extraLife * Math.pow(10, this.bonus)) {
            if (this.lives < 4) {
                this.addLife(true);
            }
            this.bonus += 1;
        }
        this.drawScore();
    };
    
    Score.prototype.addLife = function (inc) {
        var blob;
        this.lives += inc ? 1 : -1;
        
        if (inc) {
            blob = new ScoreBlob(this.board, this, this.lives - 1);
            this.blobs.push(blob);
            blob.draw();
        } else if (this.blobs.length) {
            blob = this.blobs.pop();
            blob.clear();
        }
    };
    
    Score.prototype.newLevel = function () {
        this.level += 1;
        this.ghosts = 0;
        pmSequences.newLevel();
    };
    
    
    // Actions
    Score.prototype.pill = function (value) {
        this.addScore(value * pillMult);
    };
    
    Score.prototype.fruit = function () {
        this.addScore(this.getLevelData("fruitScore"));
        this.anims.fruitScore();
    };
    
    Score.prototype.kill = function (amount, pos) {
        var score = this.getGhostScore(amount);
        this.addScore(score);
        this.anims.ghostScore(score, pos);
        this.sounds.kill();
        
        if (amount === 4) {
            this.ghosts += 1;
            if (this.ghosts === 4) {
                this.addScore(eyesBonus);
            }
        }
    };
    
    Score.prototype.died = function () {
        this.addLife(false);
        return this.lives >= 0;
    };
    
    
    /**
     * Draws the texts in the board
     */
    Score.prototype.drawTexts = function () {
        this.canvas.drawText({ text: "Score", pos: { x: scoreLeft, y: textTop }});
        this.canvas.drawText({ text: "Lives", pos: { x: livesLeft, y: textTop }});
    };
    
    /**
     * Draws the score in the board
     */
    Score.prototype.drawScore = function () {
        var left   = this.ctx.measureText("Score").width,
            margin = scoreMargin * this.size,
            top    = textTop     * this.size,
            height = scoreHeight * this.size;
        
        this.ctx.save();
        this.ctx.fillStyle = scoreColor;
        this.ctx.textAlign = "left";
        this.ctx.clearRect(left + margin / 2, top - height / 2, scoreWidth * this.size + margin / 2, height);
        this.ctx.fillText(this.score, left + margin, top);
        this.ctx.restore();
    };
    
    
    /**
     * Returns the Score for a dead Ghost
     * @param {number} amount
     * @return {number}
     */
    Score.prototype.getGhostScore = function (amount) {
        return Math.pow(2, amount) * 100;
    };
    
    /**
     * Returns the current level
     * @return {number}
     */
    Score.prototype.getLevel = function () {
        return this.level;
    };
    
    /**
     * Returns the value asociated with the given key for the current level
     * @param {string} variable
     * @return {(number|string|Array.<number>)}
     */
    Score.prototype.getLevelData = function (variable) {
        var data  = this.level >= levelsData.length ? levelsData[levelsData.length - 1] : levelsData[this.level - 1],
            value = data[variable];
        
        if (Array.isArray(value)) {
            return Object.create(value);
        }
		return value;
	};
    
    /**
     * Returns the Pen Force time in miliseconds
     * @return {number}
     */
	Score.prototype.getPenForceTime = function () {
		return this.getLevelData("penForceTime") * 1000;
	};
    
    /**
     * Returns the switch time at the given mode in miliseconds
     * @param {number} mode
     * @return {number}
     */
	Score.prototype.getSwitchTime = function (mode) {
		return this.getLevelData("switchTimes")[mode] * 1000;
	};
    
    /**
     * Returns the Fright time in miliseconds
     * @return {number}
     */
	Score.prototype.getFrightTime = function () {
		return this.getLevelData("frightTime") * 1000;
	};
    
    /**
     * Returns the amount of switchs when blinking in fright mode 
     * @return {number}
     */
	Score.prototype.getBlinks = function () {
		return this.getLevelData("frightBlinks") * 2;
	};
    
    
    
    // The public API
    return Score;
}());