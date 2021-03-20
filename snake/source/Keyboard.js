/**
 * The Game Keyboard
 */
class Keyboard {

    /**
     * The Game Keyboard constructor
     * @param {Display} display
     * @param {Scores}  scores
     * @param {Object}  shortcuts
     */
    constructor(display, scores, shortcuts) {
        this.display   = display;
        this.scores    = scores;
        this.shortcuts = shortcuts;

        document.addEventListener("keydown", e => this.pressKey(e));
    }

    /**
     * Key Press Event
     * @param {Event} event
     * @returns {Void}
     */
    pressKey(event) {
        let key = event.keyCode;
        if (this.scores.isFocused()) {
            if (key === 13) {
                this.shortcuts.saveHighScore();
            }
        } else {
            if (!this.display.isPlaying()) {
                event.preventDefault();
            }
            if ([ 89, 49, 97 ].indexOf(key) > -1) {           // Y / 1
                key = "Y";
            } else if ([ 69, 50, 98 ].indexOf(key) > -1) {    // E / 2
                key = "E";
            } else if ([ 82, 51, 99 ].indexOf(key) > -1) {    // R / 3
                key = "R";
            } else if ([ 85, 52, 100 ].indexOf(key) > -1) {   // U / 4
                key = "U";
            } else if ([ 8, 66, 78 ].indexOf(key) > -1) {     // Backspace / B / N
                key = "B";
            } else if ([ 13, 32, 79 ].indexOf(key) > -1) {    // Enter / Space / O
                key = "O";
            } else if ([ 80, 67 ].indexOf(key) > -1) {        // P / C
                key = "P";
            } else if ([ 38, 87 ].indexOf(key) > -1) {        // Up    / W
                key = "W";
            } else if ([ 37, 65 ].indexOf(key) > -1) {        // Left  / A
                key = "A";
            } else if ([ 40, 83 ].indexOf(key) > -1) {        // Down  / S
                key = "S";
            } else if ([ 39, 68 ].indexOf(key) > -1) {        // Right / D
                key = "D";
            } else {
                key = String.fromCharCode(key);
            }

            if (this.shortcuts[this.display.get()][key]) {
                this.shortcuts[this.display.get()][key]();
            }
        }
    }
}
