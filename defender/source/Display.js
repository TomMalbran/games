/**
 * The Display Class
 */
class Display {
    
    /**
     * The Display constructor
     */
    constructor() {
        this.container = document.querySelector("#container");
        this.display   = "mainScreen";
    }
    
    
    /**
     * Returns the display
     * @return {string}
     */
    get() {
        return this.display;
    }
    
    /**
     * Sets the display and changes the container class
     * @param {string} display
     */
    set(display) {
        this.display = display;
        this.show();
    }
    
    /**
     * Changes the display to the paused version and changes the container class
     */
    setPause() {
        this.display = this.display + "Paused";
        this.show();
    }
    
    /**
     * Changes the container class
     */
    show() {
        this.container.className = this.display;
    }
    
    
    /**
     * Returns true if the display is in the "playing" mode
     * @return {boolean}
     */
    isPlaying() {
        return this.display === "playing";
    }
    
    /**
     * Returns true if the display is in the "planning" mode
     * @return {boolean}
     */
    isPlanning() {
        return this.display === "planning";
    }
    
    /**
     * Returns true if the display is in the "planningPaused" mode
     * @return {boolean}
     */
    isPlanningPaused() {
        return this.display === "planningPaused";
    }
    
    /**
     * Returns true if the display is in the "playingPaused" mode
     * @return {boolean}
     */
    isPlayingPaused() {
        return this.display === "playingPaused";
    }
}
