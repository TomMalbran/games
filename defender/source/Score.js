/**
 * The Score Panel Class
 */
class Score {
    
    /**
     * The Score Panel constructor
     * @param {number}   level
     * @param {function} onGameOver
     */
    constructor(level, onGameOver) {
        this.level        = Number(level) + 1;
        this.onGameOver   = onGameOver;
        this.enable       = () => {};
        this.disable      = () => {};
        
        this.goldElem     = document.querySelector(".goldScore");
        this.livesElem    = document.querySelector(".livesScore");
        this.timeElem     = document.querySelector(".timeScore");
        this.scoreElem    = document.querySelector(".scoreScore");
        this.finalElem    = document.querySelector(".finalScore");
        
        this.initialTimer = 25;
        this.initialSecs  = 800;
        
        this.gold         = 100;
        this.lives        = 20;
        this.timer        = this.initialTimer;
        this.score        = 0;
        this.bonus        = 0;
        this.seconds      = this.initialSecs;
        this.livesMult    = 25;
        
        this.showScores();
    }
    
    
    /**
     * Calls the on Game Over function
     */
    gameOver() {
        this.onGameOver();
    }
    
    /**
     * Sets the functions that are called when the gold is increased or decreased
     * @param {function} enable
     * @param {function} disable
     */
    setFunctions(enable, disable) {
        this.enable  = enable;
        this.disable = disable;
    }
        
    /**
     * Increases the Gold by the given amount
     * @param {number} amount
     */
    incGold(amount) {
        this.gold += amount;
        this.showScores();
        this.enable();
    }
    
    /**
     * Decreases the Gold by the given amount
     * @param {number} amount
     */
    decGold(amount) {
        this.gold -= amount;
        this.showScores();
        this.disable();
    }
    
    /**
     * Decreases one Life
     */
    decLives() {
        this.lives -= 1;
        this.showScores();
        
        if (this.lives <= 0) {
            this.lives = 0;
            this.onGameOver();
        }
    }
    
    
    /**
     * Starts the Timer for a new Wave
     */
    startTimer() {
        this.addBonus();
        this.timer = this.initialTimer;
        this.showScores();
    }
    
    /**
     * Decreases the Timer by the given amount
     * @param {number} time
     * @return {boolean}
     */
    decTimer(time) {
        this.seconds -= time;
        if (this.seconds <= 0) {
            this.timer   -= 1;
            this.seconds += this.initialSecs;
            this.showScores();
            return true;
        }
        return false;
    }
    
    /**
     * Removes the Timer for the last wave
     */
    removeTimer() {
        this.timer = "";
        this.showScores();
    }
            
    /**
     * Increases the Score byt the given amount
     * @param {number} amount
     */
    incScore(amount) {
        this.score += amount;
        this.showScores();
    }
        
    /**
     * Adds the bonus for calling a new wave before the time ended
     */
    addBonus() {
        this.bonus += this.timer;
    }
    
    /**
     * Returns the final Bonus for the Final Score
     * @return {number}
     */
    getBonus() {
        return this.bonus * (this.lives <= 0 ? 0 : 1);
    }
    
    /**
     * Returns the total Score for the Final Score
     * @return {number}
     */
    getTotal() {
        return (this.score + this.lives * this.livesMult + this.getBonus()) * this.level;
    }
    
    
    /**
     * Sets the Scores
     */
    showScores() {
        this.goldElem.innerHTML  = "Gold:  " + this.gold;
        this.livesElem.innerHTML = "Lives: " + this.lives;
        this.timeElem.innerHTML  = "Time:  " + this.timer;
        this.scoreElem.innerHTML = "Score: " + this.score;
    }
    
    /**
     * Sets the Final Score
     */
    showFinal() {
        this.finalElem.innerHTML =
            "<dt>Score</dt><dd>" + this.score + "</dd>" +
            "<dt>+ " + this.lives + " lives x" + this.livesMult + "</dt><dd>" + (this.lives * this.livesMult) + "</dd>" +
            "<dt>+ Time Bonus</dt><dd>" + this.getBonus() + "</dd>" +
            "<dt>x Multiplier</dt><dd>" + this.level + "</dd>" +
            "<dt>Total Score</dt><dd>" + this.getTotal() + "</dd>";
    }
    
    
    /**
     * Returns the current Gold
     * @return {number}
     */
    getGold () {
        return this.gold;
    }
    
    /**
     * Returns the current Lives
     * @return {number}
     */
    getLives() {
        return this.lives;
    }
    
    /**
     * Returns the current Timer
     * @return {number}
     */
    getTimer() {
        return this.timer;
    }
    
    /**
     * Returns the current Score
     * @return {number}
     */
    getScore() {
        return this.score;
    }
}
