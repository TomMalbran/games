import Display      from "./Display.js";
import HighScores   from "./HighScores.js";

// Utils
import KeyCode      from "../../utils/KeyCode.js";



/**
 * Snake Keyboard
 */
export default class Keyboard {

    /**
     * Snake Keyboard constructor
     * @param {Display}    display
     * @param {HighScores} scores
     * @param {Object}     shortcuts
     */
    constructor(display, scores, shortcuts) {
        this.display   = display;
        this.scores    = scores;
        this.shortcuts = shortcuts;

        document.addEventListener("keydown", (e) => this.pressKey(e));
    }



    /**
     * Key Press Event
     * @param {KeyboardEvent} event
     * @returns {Void}
     */
    pressKey(event) {
        const key      = event.keyCode;
        const keyCode  = KeyCode.keyToCode(key);
        let   shortcut = "";

        if (this.scores.isFocused) {
            if (KeyCode.isEnter(key)) {
                this.shortcuts.saveHighScore();
            }
        } else {
            if (!this.display.isPlaying) {
                event.preventDefault();
            }

            if ([ "Y", "1", "Numpad1" ].includes(keyCode)) {
                shortcut = "Y";
            } else if ([ "E", "2", "Numpad2" ].includes(keyCode)) {
                shortcut = "E";
            } else if ([ "R", "3", "Numpad3" ].includes(keyCode)) {
                shortcut = "R";
            } else if ([ "U", "4", "Numpad4" ].includes(keyCode)) {
                shortcut = "U";
            } else if ([ "Enter", "Return", "Space", "O" ].includes(keyCode)) {
                shortcut = "O";
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

            if (this.shortcuts[this.display.current][shortcut]) {
                this.shortcuts[this.display.current][shortcut]();
            }
        }
    }
}
