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
     */
    addListeners() {
        this.selectHandler  = this.selectEvent.bind(this);
        this.previewHandler = this.previewEvent.bind(this);
        this.hideHandler    = this.hideEvent.bind(this);
        this.dragHandler    = this.drag.bind(this);
        
        document.addEventListener("mousemove",    this.dragHandler);
        this.towers.addEventListener("click",     this.selectHandler);
        this.towers.addEventListener("mouseover", this.previewHandler);
        this.towers.addEventListener("mouseout",  this.hideHandler);
        this.parent.board.addListener("build",    this.build.bind(this));
    }
    
    /**
     * Removes the events listeners
     */
    removeListeners() {
        document.removeEventListener("mousemove",    this.dragHandler);
        this.towers.removeEventListener("click",     this.selectHandler);
        this.towers.removeEventListener("mouseover", this.previewHandler);
        this.towers.removeEventListener("mouseout",  this.hideHandler);
    }
    
    
    /**
     * The select Tower listener
     * @param {Event} event
     */
    selectEvent(event) {
        if (event.target.classList.contains("towerBuild")) {
            this.selectByElement(event.target);
        }
    }
    
    /**
     * The preview Tower listener
     * @param {Event} event
     */
    previewEvent(event) {
        if (event.target.classList.contains("towerBuild")) {
            this.showPreview(event.target);
        }
    }
    
    /**
     * The hide Tower listener
     * @param {Event} event
     */
    hideEvent(event) {
        if (event.target.classList.contains("towerBuild")) {
            this.hidePreview();
        }
    }
    
    
    /**
     * Shows the Tower Description
     * @param {DOMElement} element
     */
    showPreview(element) {
        if (!this.selected && !this.parent.selection.hasSelected()) {
            this.parent.panel.previewTower(Tower.create(element.dataset.type));
        }
    }
    
    /**
     * Hides the Tower Description
     */
    hidePreview() {
        if (!this.selected && !this.parent.selection.hasSelected()) {
            this.parent.panel.disappear();
        }
    }
    
        
    /**
     * Selects a new tower to build from a Dom Element, or it ends the builder
     * if the selected tower is the currently selected one
     * @param {DOMElement} element
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
     * @param {number} type
     */
    selectByType(type) {
        let selects = this.getTowersElems();
        if (selects[type]) {
            this.pick(selects[type]);
        }
    }
    
    /**
     * Picks the tower and starts the Dragging
     * @param {DOMElement} element
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
     */
    drag(event) {
        if (this.selected) {
            let mouse = Utils.getMousePos(event),
                board = this.parent.board.getPos(),
                size  = this.parent.board.getSize(),
                top   = mouse.top  - board.top,
                left  = mouse.left - board.left,
                row   = Math.floor(top  / size) - 1,
                col   = Math.floor(left / size) - 1;
            
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
     * @param {number} deltaX
     * @param {number} deltaY
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
     */
    updateBuild() {
        if (this.selected) {
            this.canBuild = this.parent.board.canBuild(this.row, this.col, this.size);
            this.setClass();
        }
    }
    
    /**
     * Sets the position of the tower on drag
     * @param {number} row
     * @param {number} col
     */
    setPosition(row, col) {
        this.row      = row;
        this.col      = col;
        this.top      = this.cellToPx(this.row);
        this.left     = this.cellToPx(this.col);
        this.canBuild = this.parent.board.canBuild(this.row, this.col, this.size);
        this.canPay   = this.tower.getActualCost() <= this.parent.score.getGold();
        
        this.building.style.display = "block";
        this.building.style.top     = this.top;
        this.building.style.left    = this.left;
        
        this.setClass();
    }
    
    /**
     * Sets the classes on the bluiding element
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
     */
    setValidClass() {
        this.building.classList.add("valid");
        this.building.classList.remove("invalid");
    }
    
    /**
     * Adds the invalid class and removes the valid one
     */
    setInvalidClass() {
        this.building.classList.add("invalid");
        this.building.classList.remove("valid");
    }
    
        
    /**
     * It builds the tower
     */
    build() {
        if (this.canBuild && this.canPay) {
            this.building.classList.remove("invalid");
            
            this.parent.manager.build({
                type : this.tower.getType(),
                row  : this.row,
                col  : this.col
            });
        }
    }
    
    
    /**
     * Enables the Towers that can be build depending on the amount of gold
     * @param {number} gold
     */
    enableBuilds(gold) {
        let selects = this.getTowersElems();
        
        for (let i = 0; i < selects.length; i += 1) {
            let type  = selects[i].dataset.type,
                tower = Tower.create(type);
            
            
            if (tower.getActualCost() <= gold) {
                selects[i].classList.remove("disabled");
                if (this.tower && this.tower.getType() === type) {
                    this.setValidClass();
                    this.canPay = true;
                }
            }
        }
    }
    
    /**
     * Disables the Towers that can't be build depending on the amount of gold
     * @param {number} gold
     */
    disableBuilds(gold) {
        let selects = this.getTowersElems();
        
        for (let i = 0; i < selects.length; i += 1) {
            let type  = selects[i].dataset.type,
                tower = Tower.create(type);
            
            if (tower.getActualCost() > gold) {
                selects[i].classList.add("disabled");
                if (this.tower && this.tower.getType() === type) {
                    this.setInvalidClass();
                    this.canPay = false;
                }
            }
        }
    }
    
    
    /**
     * Initializes the building element
     */
    initBuildingElem() {
        this.building.classList.remove("towerRange" + Math.floor(this.range));
        this.building.classList.remove("dim"   + this.size);
        
        this.range = this.tower.getRealRange();
        this.size  = this.tower.getSize();
        
        this.building.classList.add("towerRange" + Math.floor(this.range));
        this.building.classList.add("dim"   + this.size);
    }
    
    /**
     * Transform a cell number to a px position
     * @param {number} cell
     * @return {number}
     */
    cellToPx(pos) {
        let center = (this.size * this.parent.board.getSize()) / 2;
        return ((pos + this.size) * this.parent.board.getSize() - center) + "px";
    }
    
    /**
     * Returns the Towers Element
     * @return {Array.<DOMElement>}
     */
    getTowersElems() {
        return this.towers.querySelectorAll(".towerBuild");
    }
    
    /**
     * Returns true if there is a Tower selected
     * @return {boolean}
     */
    hasSelected() {
        return this.selected !== null;
    }
}
