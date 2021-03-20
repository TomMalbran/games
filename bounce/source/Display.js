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
     * Returns true if the display is in playing mode
     * @return {boolean}
     */
    isPlaying() {
        return this.display === "playing";
    }
}
