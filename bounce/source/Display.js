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
            mainScreen : [ "Bounce",     "Select a game"      ],
            paused     : [ "Paused",     "Continue the game?" ],
            gameOver   : [ "GameOver",   "Write your name"    ],
            highScores : [ "HighScores", "Select a game"      ],
            help       : [ "Help",       "Game controls"      ]
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
     * @returns {Void}
     */
    show() {
        this.container.className = this.display;
        this.header.innerHTML    = this.messages[this.display][0];
        this.paragraph.innerHTML = this.messages[this.display][1];
    }

    /**
     * Hide the message
     * @returns {Void}
     */
    hide() {
        this.container.className = "playing";
    }

    /**
     * Returns true if the display is in playing mode
     * @returns {Boolean}
     */
    get isPlaying() {
        return this.display === "playing";
    }
}
