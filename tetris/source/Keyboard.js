import Display      from "./Display.js";
import HighScores   from "./HighScores.js";

// Utils
import KeyCode      from "../../utils/KeyCode.js";



/**
 * Tetris Keyboard
 */
export default class Keyboard {

    /**
     * Tetris Keyboard constructor
     * @param {Display}    display
     * @param {HighScores} scores
     * @param {Object}     shortcuts
     */
    constructor(display, scores, shortcuts) {
        this.shortcuts  = shortcuts;
        this.keyPressed = null;
        this.count      = 0;

        this.display    = display;
        this.scores     = scores;

        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.addEventListener("keyup",   (e) => this.onKeyUp());
    }



    /**
     * Called when holding a key
     */
    holdingKey() {
        if (this.keyPressed) {
            this.count += 1;
            if (this.count > 8) {
                this.onKeyHold();
                this.count -= 3;
            }
        }
    }

    /**
     * Resets the counter
     */
    reset() {
        this.count = 0;
    }



    /**
     * Key Press Event
     * @param {Number}         key
     * @param {KeyboardEvent=} event
     * @returns {Void}
     */
    pressKey(key, event) {
        const keyCode  = KeyCode.keyToCode(key);
        const number   = KeyCode.keyToNumber(key, true);
        let   shortcut = "";

        if (this.scores.isFocused) {
            if (KeyCode.isEnter(key)) {
                this.shortcuts.gameOver.O();
            }
        } else {
            if (!this.display.isPlaying) {
                event.preventDefault();
            }

            if ([ "Enter", "Return", "O", "T" ].includes(keyCode)) {
                shortcut = "O";
            } else if ([ "Control", "Space" ].includes(keyCode)) {
                shortcut = "C";
            } else if (KeyCode.isErase(key)) {
                shortcut = "B";
            } else if (KeyCode.isPauseContinue(key)) {
                shortcut = "P";
            } else if (KeyCode.isUp(key)) {
                shortcut = "W";
            } else if (KeyCode.isLeft(key)) {
                shortcut = "A";
            } else if (KeyCode.isDown(key)) {
                shortcut = "S";
            } else if (KeyCode.isRight(key)) {
                shortcut = "D";
            } else {
                shortcut = keyCode;
            }

            if (number !== null) {
                this.shortcuts.number(number);
            } else if (this.shortcuts[this.display.current][shortcut]) {
                this.shortcuts[this.display.current][shortcut]();
            }
        }
    }

    /**
     * Key handler for the on key down event
     * @param {KeyboardEvent} event
     * @returns {Void}
     */
    onKeyDown(event) {
        if (this.display.isPlaying && KeyCode.isFastKey(event.keyCode)) {
            if (this.keyPressed === null) {
                this.keyPressed = event.keyCode;
            } else {
                return;
            }
        }
        this.pressKey(event.keyCode, event);
    }

    /**
     * Key handler for the on key up event
     * @returns {Void}
     */
    onKeyUp() {
        this.keyPressed = null;
        this.count      = 0;
    }

    /**
     * When a key is pressed, this is called on each frame for fast key movements
     * @returns {Void}
     */
    onKeyHold() {
        if (this.keyPressed !== null && this.display.isPlaying) {
            this.pressKey(this.keyPressed);
        }
    }
}
