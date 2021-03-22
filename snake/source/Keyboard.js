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
        if (this.scores.isFocused) {
            if (key === 13) {
                this.shortcuts.saveHighScore();
            }
        } else {
            if (!this.display.isPlaying) {
                event.preventDefault();
            }
            if ([ 89, 49, 97 ].includes(key)) {           // Y / 1
                key = "Y";
            } else if ([ 69, 50, 98 ].includes(key)) {    // E / 2
                key = "E";
            } else if ([ 82, 51, 99 ].includes(key)) {    // R / 3
                key = "R";
            } else if ([ 85, 52, 100 ].includes(key)) {   // U / 4
                key = "U";
            } else if ([ 8, 66, 78 ].includes(key)) {     // Backspace / B / N
                key = "B";
            } else if ([ 13, 32, 79 ].includes(key)) {    // Enter / Space / O
                key = "O";
            } else if ([ 80, 67 ].includes(key)) {        // P / C
                key = "P";
            } else if ([ 38, 87 ].includes(key)) {        // Up    / W
                key = "W";
            } else if ([ 37, 65 ].includes(key)) {        // Left  / A
                key = "A";
            } else if ([ 40, 83 ].includes(key)) {        // Down  / S
                key = "S";
            } else if ([ 39, 68 ].includes(key)) {        // Right / D
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
