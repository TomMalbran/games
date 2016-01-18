/**
 * The Game Display
 */
class Display {
    
    /**
     * The Game Display constructor
     */
    constructor() {
        this.display   = "mainScreen";
        this.container = document.querySelector("#container");
        this.header    = document.querySelector(".messages h2");
        this.paragraph = document.querySelector(".messages p");
        
        this.messages  = {
            mainScreen : [ "Snake",      "Select a level"     ],
            paused     : [ "Pause",      "Continue the game?" ],
            continuing : [ "Continue",   "Continue the game?" ],
            gameOver   : [ "GameOver",   "Write your name"    ],
            highScores : [ "HighScores", "Select a level"     ],
            help       : [ "Help",       "Game controlls"     ]
        };
    }
    
    
    /**
     * Gets the Game Display
     * @return {string}
     */
    get() {
        return this.display;
    }
    
    /**
     * Sets the Game Display
     * @param {string} display
     * @return {Display}
     */
    set(display) {
        this.display = display;
        return this;
    }
    
    
    /**
     * Sets the container class
     */
    setClass() {
        this.container.className = this.display;
    }

    /**
     * Show the message
     */
    show() {
        this.header.innerHTML    = this.messages[this.display][0];
        this.paragraph.innerHTML = this.messages[this.display][1];
        this.setClass();
    }
    
    /**
     * Hide the message
     */
    hide() {
        this.container.className = "playing";
    }

    
    /**
     * Returns true if is starting the game
     * @return {boolean}
     */
    isStarting() {
        return this.display === "starting";
    }
    
    /**
     * Returns true if is playing the game
     * @return {boolean}
     */
    isPlaying() {
        return this.display === "playing";
    }
    
    /**
     * Returns true if is demoing the game
     * @return {boolean}
     */
    isDemoing() {
        return this.display === "demo";
    }
}
