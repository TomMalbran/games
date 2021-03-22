/**
 * The Tower Builder Class
 * @param {Towers} parent
 */
class Builder {

    /**
     * The Tower Builder constructor
     * @param {Towers} parent
     */
    constructor(parent) {
        this.parent   = parent;
        this.tower    = null;
        this.row      = 1;
        this.col      = 1;
        this.top      = 0;
        this.left     = 0;
        this.size     = 2;
        this.range    = 120;
        this.selected = null;
        this.canPay   = true;
        this.canBuild = true;

        this.towers   = document.querySelector(".towersPanel");
        this.building = document.querySelector(".building");

        this.addListeners();
    }

    /**
     * Creates the event handlers and adds them
     * @returns {Void}
     */
    addListeners() {
        document.addEventListener("mousemove",    (e) => this.drag(e));
        this.towers.addEventListener("click",     (e) => this.select(e));
        this.towers.addEventListener("mouseover", (e) => this.preview(e));
        this.towers.addEventListener("mouseout",  (e) => this.hide(e));
        this.parent.board.addListener("build",    ()  => this.build());
    }

    /**
     * Removes the events listeners
     * @returns {Void}
     */
    removeListeners() {
        document.removeEventListener("mousemove",    (e) => this.drag(e));
        this.towers.removeEventListener("click",     (e) => this.select(e));
        this.towers.removeEventListener("mouseover", (e) => this.preview(e));
        this.towers.removeEventListener("mouseout",  (e) => this.hide(e));
    }



    /**
     * The select Tower listener
     * @param {Event} event
     * @returns {Void}
     */
    select(event) {
        if (event.target.classList.contains("towerBuild")) {
            this.selectByElement(event.target);
        }
    }

    /**
     * The preview Tower listener
     * @param {Event} event
     * @returns {Void}
     */
    preview(event) {
        if (event.target.classList.contains("towerBuild")) {
            this.showPreview(event.target);
        }
    }

    /**
     * The hide Tower listener
     * @param {Event} event
     * @returns {Void}
     */
    hide(event) {
        if (event.target.classList.contains("towerBuild")) {
            this.hidePreview();
        }
    }



    /**
     * Shows the Tower Description
     * @param {DOMElement} element
     * @returns {Void}
     */
    showPreview(element) {
        if (!this.selected && !this.parent.selection.hasSelected) {
            this.parent.panel.previewTower(Tower.create(element.dataset.type));
        }
    }

    /**
     * Hides the Tower Description
     * @returns {Void}
     */
    hidePreview() {
        if (!this.selected && !this.parent.selection.hasSelected) {
            this.parent.panel.disappear();
        }
    }



    /**
     * Selects a new tower to build from a Dom Element, or it ends the builder
     * if the selected tower is the currently selected one
     * @param {DOMElement} element
     * @returns {Void}
     */
    selectByElement(element) {
        if (this.selected !== element) {
            this.pick(element);
        } else {
            this.drop();
        }
    }

    /**
     * Selects a new tower to build from a number
     * @param {Number} type
     * @returns {Void}
     */
    selectByType(type) {
        const selects = this.towersElems;
        if (selects[type]) {
            this.pick(selects[type]);
        }
    }

    /**
     * Picks the tower and starts the Dragging
     * @param {DOMElement} element
     * @returns {Void}
     */
    pick(element) {
        if (this.selected) {
            this.selected.classList.remove("selected");
        }
        this.parent.selection.drop();

        this.tower    = Tower.create(element.dataset.type);
        this.selected = element;
        this.canBuild = false;

        this.selected.classList.add("selected");
        this.parent.panel.previewTower(this.tower);

        this.initBuildingElem();
        this.setPosition(this.row, this.col);
    }

    /**
     * Drops the tower endind the drag and building process
     * @returns {Void}
     */
    drop() {
        if (this.selected) {
            this.selected.classList.remove("selected");
            this.building.style.display = "none";
            this.selected = null;
        }
    }

    /**
     * Drags the Tower around the board
     * @param {Event} event
     * @returns {Void}
     */
    drag(event) {
        if (this.selected) {
            const mouse = Utils.getMousePos(event);
            const board = this.parent.board.pos;
            const size  = MapsData.squareSize;
            const top   = mouse.top  - board.top;
            const left  = mouse.left - board.left;
            const row   = Math.floor(top  / size) - 1;
            const col   = Math.floor(left / size) - 1;

            if (this.row !== row || this.col !== col) {
                if (this.parent.board.inMatrix(row, col, this.size - 1)) {
                    this.setPosition(row, col);
                } else {
                    this.canBuild = false;
                    this.building.style.display = "none";
                }
            }
        }
    }

    /**
     * Moves the Tower using the keayboard
     * @param {Number} deltaX
     * @param {Number} deltaY
     * @returns {Void}
     */
    move(deltaX, deltaY) {
        if (this.row === null || this.col === null) {
            this.setPosition(1, 1);
        } else if (this.parent.board.inMatrix(this.row + deltaY, this.col + deltaX, this.size - 1)) {
            this.setPosition(this.row + deltaY, this.col + deltaX);
        }
    }

    /**
     * Updates the can build property while playing the game
     * @returns {Void}
     */
    updateBuild() {
        if (this.selected) {
            this.canBuild = this.parent.board.canBuild(this.row, this.col, this.size);
            this.setClass();
        }
    }

    /**
     * Sets the position of the tower on drag
     * @param {Number} row
     * @param {Number} col
     * @returns {Void}
     */
    setPosition(row, col) {
        this.row      = row;
        this.col      = col;
        this.top      = this.cellToPx(this.row);
        this.left     = this.cellToPx(this.col);
        this.canBuild = this.parent.board.canBuild(this.row, this.col, this.size);
        this.canPay   = this.tower.actualCost <= this.parent.score.gold;

        this.building.style.display = "block";
        this.building.style.top     = this.top;
        this.building.style.left    = this.left;

        this.setClass();
    }

    /**
     * Sets the classes on the bluiding element
     * @returns {Void}
     */
    setClass() {
        if (this.canBuild && this.canPay) {
            this.setValidClass();
        } else {
            this.setInvalidClass();
        }
    }

    /**
     * Adds the valid class and removes the invalid one
     * @returns {Void}
     */
    setValidClass() {
        this.building.classList.add("valid");
        this.building.classList.remove("invalid");
    }

    /**
     * Adds the invalid class and removes the valid one
     * @returns {Void}
     */
    setInvalidClass() {
        this.building.classList.add("invalid");
        this.building.classList.remove("valid");
    }

    /**
     * It builds the tower
     * @returns {Void}
     */
    build() {
        if (this.canBuild && this.canPay) {
            this.building.classList.remove("invalid");

            this.parent.manager.build({
                type : this.tower.type,
                row  : this.row,
                col  : this.col
            });
        }
    }



    /**
     * Enables the Towers that can be build depending on the amount of gold
     * @param {Number} gold
     * @returns {Void}
     */
    enableBuilds(gold) {
        const selects = this.towersElems;

        for (let i = 0; i < selects.length; i += 1) {
            const type  = selects[i].dataset.type;
            const tower = Tower.create(type);

            if (tower.actualCost <= gold) {
                selects[i].classList.remove("disabled");
                if (this.tower && this.tower.type === type) {
                    this.setValidClass();
                    this.canPay = true;
                }
            }
        }
    }

    /**
     * Disables the Towers that can't be build depending on the amount of gold
     * @param {Number} gold
     * @returns {Void}
     */
    disableBuilds(gold) {
        const selects = this.towersElems;

        for (let i = 0; i < selects.length; i += 1) {
            const type  = selects[i].dataset.type;
            const tower = Tower.create(type);

            if (tower.actualCost > gold) {
                selects[i].classList.add("disabled");
                if (this.tower && this.tower.type === type) {
                    this.setInvalidClass();
                    this.canPay = false;
                }
            }
        }
    }



    /**
     * Initializes the building element
     * @returns {Void}
     */
    initBuildingElem() {
        this.building.classList.remove(`towerRange${Math.floor(this.range)}`);
        this.building.classList.remove(`dim${this.size}`);

        this.range = this.tower.realRange;
        this.size  = this.tower.size;

        this.building.classList.add(`towerRange${Math.floor(this.range)}`);
        this.building.classList.add(`dim${this.size}`);
    }

    /**
     * Transform a cell number to a px position
     * @param {Number} cell
     * @returns {Number}
     */
    cellToPx(pos) {
        const center = (this.size * MapsData.squareSize) / 2;
        return Utils.toPX((pos + this.size) * MapsData.squareSize - center);
    }



    /**
     * Returns the Towers Element
     * @returns {Array.<DOMElement>}
     */
    get towersElems() {
        return this.towers.querySelectorAll(".towerBuild");
    }

    /**
     * Returns true if there is a Tower selected
     * @returns {Boolean}
     */
    get hasSelected() {
        return this.selected !== null;
    }
}
