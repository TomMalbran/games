/**
 * Bounce Display
 */
export default class Display {

    /**
     * Bounce Display constructor
     */
    constructor() {
        this.current   = "mainScreen";
        this.container = document.querySelector("#container");
        this.header    = document.querySelector(".messages h2");
        this.paragraph = document.querySelector(".messages p");

        this.messages  = {
            mainScreen : [ "Bounce",     "Select a game"      ],
            paused     : [ "Paused",     "Continue the game?" ],
            gameOver   : [ "GameOver",   "Write your name"    ],
            highScores : [ "HighScores", "Select a game"      ],
            help       : [ "Help",       "Game controls"      ],
        };
    }

    /**
     * Sets the Game Display
     * @param {String} current
     * @returns {Display}
     */
    set(current) {
        this.current = current;
        return this;
    }



    /**
     * Show the message
     * @returns {Void}
     */
    show() {
        this.container.className = this.current;
        this.header.innerHTML    = this.messages[this.current][0];
        this.paragraph.innerHTML = this.messages[this.current][1];
    }

    /**
     * Hide the message
     * @returns {Void}
     */
    hide() {
        this.container.className = "playing";
    }

    /**
     * Returns true if the current is in playing mode
     * @returns {Boolean}
     */
    get isPlaying() {
        return this.current === "playing";
    }
}
