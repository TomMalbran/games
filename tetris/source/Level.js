/**
 * The Level Class
 */
class Level {
    
    /**
     * The Level constructor
     * @param {number} maxLevels
     */
    constructor(maxLevels) {
        this.levelerElem = document.querySelector(".leveler");
        this.maxLevels   = maxLevels;
        this.level       = 1;
    }
    
    
    /**
     * Returns the initial level
     * @return {number}
     */
    get() {
        return this.level;
    }
    
    
    /**
     * Increases the initial level
     */
    inc() {
        Utils.unselect();
        if (this.level < this.maxLevels) {
            this.level += 1;
            this.show();
        }
    }
    
    /**
     * Decreases the initial level
     */
    dec() {
        Utils.unselect();
        if (this.level > 1) {
            this.level -= 1;
            this.show();
        }
    }
    
    /**
     * Sets the initial level
     * @param {number}
     */
    choose(level) {
        if (level > 0 && level <= this.maxInitialLevel) {
            this.level = level;
            this.show();
        }
    }
    
    
    /**
     * Sets the initial level
     */
    show() {
        this.levelerElem.innerHTML = this.level;
    }
}
