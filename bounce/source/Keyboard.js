import Display      from "./Display.js";
import HighScores   from "./HighScores.js";

// Utils
import KeyCode      from "../../utils/KeyCode.js";



/**
 * Bounce Keyboard
 */
export default class Keyboard {

    /**
     * Bounce Keyboard constructor
     * @param {Display}    display
     * @param {HighScores} scores
     * @param {Object}     shortcuts
     */
    constructor(display, scores, shortcuts) {
        this.shortcuts  = shortcuts;
        this.keyPressed = null;

        this.display    = display;
        this.scores     = scores;

        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.addEventListener("keyup",   (e) => this.onKeyUp());
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



    /**
     * Key Press Event
     * @param {Number} key
     * @param {Event=} event
     * @returns {Void}
     */
    pressKey(key, event) {
        const keyCode  = KeyCode.keyToCode(key);
        let   shortcut = "";

        if (this.scores.isFocused) {
            if (KeyCode.isEnter(key)) {
                this.shortcuts.gameOver.O();
            }
        } else {
            if (!this.display.isPlaying) {
                event.preventDefault();
            }

            if ([ "E", "1", "Numpad1" ].includes(keyCode)) {
                shortcut = "E";
            } else if ([ "R", "2", "Numpad2" ].includes(keyCode)) {
                shortcut = "R";
            } else if ([ "K", "3", "Numpad3" ].includes(keyCode)) {
                shortcut = "C";
            } else if ([ "Enter", "Return", "Space", "O" ].includes(keyCode)) {
                shortcut = "O";
            } else if (KeyCode.isErase(key)) {
                shortcut = "B";
            } else if (KeyCode.isPauseContinue(key)) {
                shortcut = "P";
            } else if (KeyCode.isLeft(key)) {
                shortcut = "A";
            } else if (KeyCode.isRight(key)) {
                shortcut = "D";
            } else {
                shortcut = keyCode;
            }

            if (this.shortcuts[this.display.current][shortcut]) {
                this.shortcuts[this.display.current][shortcut]();
            }
        }
    }
}
