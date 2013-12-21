/*jslint browser: true */

var Score = (function () {
    "use strict";
    
    var initialGold    = 100,
        initialLives   = 20,
        initialTimer   = 25,
        initialSeconds = 800,
        livesMult      = 25;
    
    
    /**
     * @constructor
     * The Score Panel
     * @param {number} level
     */
    function Score(level, onGameOver) {
        this.level      = Number(level) + 1;
        this.onGameOver = onGameOver;
        this.enable     = function () {};
        this.disable    = function () {};
        
        this.goldElem   = document.querySelector(".goldScore");
        this.livesElem  = document.querySelector(".livesScore");
        this.timeElem   = document.querySelector(".timeScore");
        this.scoreElem  = document.querySelector(".scoreScore");
        this.finalElem  = document.querySelector(".finalScore");
        
        this.gold       = initialGold;
        this.lives      = initialLives;
        this.timer      = initialTimer;
        this.score      = 0;
        this.bonus      = 0;
        this.seconds    = initialSeconds;
        
        this.showScores();
    }
    
    /**
     * Calls the on Game Over function
     */
    Score.prototype.gameOver = function () {
        this.onGameOver();
    };
    
    /**
     * Sets the functions that are called when the gold is increased or decreased
     * @param {function()} enable
     * @param {function()} disable
     */
    Score.prototype.setFunctions = function (enable, disable) {
        this.enable  = enable;
        this.disable = disable;
    };
        
    /**
     * Increases the Gold by the given amount
     * @param {number} amount
     */
    Score.prototype.incGold = function (amount) {
        this.gold += amount;
        this.showScores();
        this.enable();
    };
    
    /**
     * Decreases the Gold by the given amount
     * @param {number} amount
     */
    Score.prototype.decGold = function (amount) {
        this.gold -= amount;
        this.showScores();
        this.disable();
    };
        
    /**
     * Decreases one Life
     */
    Score.prototype.decLives = function () {
        this.lives -= 1;
        this.showScores();
        
        if (this.lives <= 0) {
            this.lives = 0;
            this.onGameOver();
        }
    };
    
    
    /**
     * Starts the Timer for a new Wave
     */
    Score.prototype.startTimer = function () {
        this.addBonus();
        this.timer = initialTimer;
        this.showScores();
    };
    
    /**
     * Decreases the Timer by the given amount
     * @param {number} time
     */
    Score.prototype.decTimer = function (time) {
        this.seconds -= time;
        if (this.seconds <= 0) {
            this.timer   -= 1;
            this.seconds += initialSeconds;
            this.showScores();
            return true;
        }
        return false;
    };
    
    /**
     * Removes the Timer for the last wave
     */
    Score.prototype.removeTimer = function () {
        this.timer = "";
        this.showScores();
    };
            
    /**
     * Increases the Score byt the given amount
     * @param {number} amount
     */
    Score.prototype.incScore = function (amount) {
        this.score += amount;
        this.showScores();
    };
        
    /**
     * Adds the bonus for calling a new wave before the time ended
     */
    Score.prototype.addBonus = function () {
        this.bonus += this.timer;
    };
    
    /**
     * Returns the final Bonus for the Final Score
     * @return {number}
     */
    Score.prototype.getBonus = function () {
        return this.bonus * (this.lives <= 0 ? 0 : 1);
    };
    
    /**
     * Returns the total Score for the Final Score
     * @return {number}
     */
    Score.prototype.getTotal = function () {
        return (this.score + this.lives * livesMult + this.getBonus()) * this.level;
    };
    
    /**
     * Sets the Scores
     */
    Score.prototype.showScores = function () {
        this.goldElem.innerHTML  = "Gold:  " + this.gold;
        this.livesElem.innerHTML = "Lives: " + this.lives;
        this.timeElem.innerHTML  = "Time:  " + this.timer;
        this.scoreElem.innerHTML = "Score: " + this.score;
    };
    
    /**
     * Sets the Final Score
     */
    Score.prototype.showFinal = function () {
        this.finalElem.innerHTML =
            "<dt>Score</dt><dd>" + this.score + "</dd>" +
            "<dt>+ " + this.lives + " lives x" + livesMult + "</dt><dd>" + (this.lives * livesMult) + "</dd>" +
            "<dt>+ Time Bonus</dt><dd>" + this.getBonus() + "</dd>" +
            "<dt>x Multiplier</dt><dd>" + this.level + "</dd>" +
            "<dt>Total Score</dt><dd>" + this.getTotal() + "</dd>";
    };
    
    /**
     * Returns the current Gold
     * @return {number}
     */
    Score.prototype.getGold  = function () {
        return this.gold;
    };
    
    /**
     * Returns the current Lives
     * @return {number}
     */
    Score.prototype.getLives = function () {
        return this.lives;
    };
    
    /**
     * Returns the current Timer
     * @return {number}
     */
    Score.prototype.getTimer = function () {
        return this.timer;
    };
    
    /**
     * Returns the current Score
     * @return {number}
     */
    Score.prototype.getScore = function () {
        return this.score;
    };
    
    
    
    // The public API
    return Score;
}());