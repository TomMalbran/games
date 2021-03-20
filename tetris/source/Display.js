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
            mainScreen : [ "Tetris",     "Select the starting level" ],
            paused     : [ "Pause",      "Continue with the game?"   ],
            continuing : [ "Continue",   "Continue with the game?"   ],
            gameOver   : [ "GameOver",   "Write your name"           ],
            highScores : [ "HighScores", "Select a level"            ],
            help       : [ "Help",       "Game controlls"            ]
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
     * Show the message
     */
    show() {
        this.container.className = this.display;
        this.header.innerHTML    = this.messages[this.display][0];
        this.paragraph.innerHTML = this.messages[this.display][1];
    }

    /**
     * Hide the message
     */
    hide() {
        this.container.className = "playing";
    }


    /**
     * Returns true if the display is in the main screen
     * @returns {Boolean}
     */
    inMainScreen() {
        return this.display === "mainScreen";
    }

    /**
     * Returns true if the display is in playing mode
     * @returns {Boolean}
     */
    isPlaying() {
        return this.display === "playing";
    }

    /**
     * Returns true if the display is in paused mode
     * @returns {Boolean}
     */
    isPaused() {
        return this.display === "paused";
    }
}
