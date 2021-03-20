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
     * @returns {String}
     */
    get() {
        return this.display;
    }

    /**
     * Sets the Game Display
     * @param {String} display
     * @returns {Display}
     */
    set(display) {
        this.display = display;
        return this;
    }


    /**
     * Sets the container class
     * @returns {Void}
     */
    setClass() {
        this.container.className = this.display;
    }

    /**
     * Show the message
     * @returns {Void}
     */
    show() {
        this.header.innerHTML    = this.messages[this.display][0];
        this.paragraph.innerHTML = this.messages[this.display][1];
        this.setClass();
    }

    /**
     * Hide the message
     * @returns {Void}
     */
    hide() {
        this.container.className = "playing";
    }


    /**
     * Returns true if is starting the game
     * @returns {Boolean}
     */
    isStarting() {
        return this.display === "starting";
    }

    /**
     * Returns true if is playing the game
     * @returns {Boolean}
     */
    isPlaying() {
        return this.display === "playing";
    }

    /**
     * Returns true if is demoing the game
     * @returns {Boolean}
     */
    isDemoing() {
        return this.display === "demo";
    }
}
