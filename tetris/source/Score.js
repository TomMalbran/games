/**
 * The Scorer Class
 */
class Score {
    
    /**
     * The Scorer constructor
     * @param {number} level
     * @param {number} maxInitialLevel
     */
    constructor(level, maxInitialLevel) {
        this.multipliers     = [ 40, 100, 300, 1200 ];
        this.timeInterval    = 50;
        this.linesPerLevel   = 10;
        this.maxInitialLevel = maxInitialLevel;
        
        this.levelElem = document.querySelector(".level .content");
        this.scoreElem = document.querySelector(".score .content");
        this.linesElem = document.querySelector(".lines .content");
        
        this._level    = level;
        this._score    = 0;
        this._lines    = 0;
        this._amount   = 0;
        this._timer    = this.calculateTimer();
        this._time     = this._timer;
        
        this.showLevel();
        this.showScore();
        this.showLines();
    }
    
    
    /**
     * Returns the time between each drop
     * @return {number}
     */
    get timer() {
        return this._timer;
    }
    
    /**
     * Returns the current time
     * @return {number}
     */
    get time() {
        return this._time;
    }
    
    /**
     * Returns the current level
     * @return {number}
     */
    get level() {
        return this._level;
    }
    
    /**
     * Returns the current Score
     * @return {number}
     */
    get score() {
        return this._score;
    }
    
    
    
    /**
     * Decreases the time by the given amount
     * @param {number} time
     */
    decTime(time) {
        this._time -= time;
    }
    
    /**
     * Resets the time to the timer amount
     */
    resetTime() {
        this._time = this._timer;
    }
    
    
    /**
     * Adds the score for a new Piece that dropped
     * @param {number} drop - Amount of cells the Tetrimino dropped before crashing the bottom
     */
    piece(drop) {
        this._score += 21 + (3 * this._level) - drop;
        this.showScore();
    }
    
    /**
     * Adds the score for a new Line
     * @param {number} amount - Amount of lines completed in one move
     */
    line(amount) {
        this.addScore(amount);
        this.addLine(amount);
        this.addLevel(amount);
    }
    
    /**
     * Increases the score
     * @param {number} amount - Amount of lines completed in one move
     */
    addScore(amount) {
        this._score += this._level * this.multipliers[amount - 1];
        this.showScore();
    }
    
    /**
     * Increases the lines
     * @param {number} amount - Amount of lines completed in one move
     */
    addLine(amount) {
        this._lines += amount;
        this.showLines();
    }
    
    /**
     * Increases the level
     * @param {number} amount - Amount of lines completed in one move
     */
    addLevel(amount) {
        this._amount += amount;
        if (this._amount >= this.linesPerLevel) {
            this._amount -= this.linesPerLevel;
            this._timer   = this.calculateTimer();
            this._level  += 1;
            this.showLevel();
        }
    }
    
    
    /**
     * Displays the level in the Game
     */
    showLevel() {
        this.levelElem.innerHTML = this._level;
    }
    
    /**
     * Displays the score in the Game
     */
    showScore() {
        this.scoreElem.innerHTML = Utils.formatNumber(this._score, ",");
    }
    
    /**
     * Displays the lines in the Game
     */
    showLines() {
        this.linesElem.innerHTML = this._lines;
    }
    
    
    /**
     * Calculates the time used between each soft drop
     * @return {number}
     */
    calculateTimer() {
        if (this.level < this.maxInitialLevel) {
            return (this.maxInitialLevel - this.level + 1) * this.timeInterval;
        }
        return this.timeInterval;
    }
}
