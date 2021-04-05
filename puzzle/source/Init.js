(function () {
    "use strict";

    let sounds, selection, puzzle, partial;



    /**
     * Stores the used DOM elements and initializes the Event Handlers
     * @returns {Void}
     */
    function initDomListeners() {
        document.body.addEventListener("click", (e) => {
            const element = Utils.getTarget(e);
            switch (element.dataset.action) {
            case "next":
                selection.moveSlider(1);
                break;
            case "prev":
                selection.moveSlider(-1);
                break;
            case "select":
                selection.select(element);
                break;
            case "start":
                selection.start(element);
                break;
            case "restart":
                puzzle.destroy();
                selection.build();
                selection.show();
                puzzle = null;
                break;

            case "borders":
                if (puzzle) {
                    puzzle.drawer.toggleBorders();
                }
                break;
            case "preview":
                if (puzzle) {
                    puzzle.togglePreview(e);
                }
                break;
            case "pause":
                if (puzzle) {
                    puzzle.togglePause();
                }
                break;
            case "mute":
                sounds.toggle();
                element.innerHTML = sounds.isMute() ? "Unmute" : "Mute";
                break;
            case "exit":
                puzzle.destroy();
                selection.show();
                puzzle = null;
                break;
            }
        });

        document.body.addEventListener("mousedown", (e) => {
            if (e.button !== 0 || !puzzle || partial) {
                return;
            }
            const element = Utils.getTarget(e, "piece", "set");
            if (element) {
                partial = puzzle.pickAny(element.dataset.id);
                e.preventDefault();
            }
        });

        document.addEventListener("mousemove", (e) => {
            if (partial) {
                partial.drag();
            }
            e.preventDefault();
        });

        document.addEventListener("mouseup", (e) => {
            if (partial) {
                puzzle.dropAny(e, partial);
                partial = null;
            }
            e.preventDefault();
        });
    }

    /**
     * The main Function
     * @returns {Void}
     */
    function main() {
        initDomListeners();

        sounds    = new Sounds([ "drop", "piece", "set", "fireworks" ], "puzzle.sound", true, ".mp3");
        selection = new Selection();
        selection.onStart = (image, pieces) => {
            puzzle = new Puzzle(sounds, image, pieces);
        };
    }


    // Load the game
    window.addEventListener("load", main, false);

}());