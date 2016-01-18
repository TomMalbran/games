/**
 * The Game Score
 */
class Score {
    
    /**
     * The Game Score constructor
     */
    constructor() {
        this.score     = 0;
        this.container = document.querySelector(".count");
    }
    
    
    /**
     * Returns the current Score
     * @return {number}
     */
    get() {
        return this.score;
    }
    
    
    /**
     * Restarts the Score
     */
    restart() {
        this.score = -1;
        this.inc();
    }
    
    /**
     * Increases the Score
     */
    inc() {
        this.score += 1;
        this.container.innerHTML = this.score;
    }
}
