/**
 * The Mobs Create Class
 */
class Create {

    /**
     * The Mobs Create constructor
     * @param {Mobs} parent
     */
    constructor(parent) {
        this.moveDirs = [[0,1], [1,1], [1,0], [1,-1], [0,-1], [-1,-1], [-1,0], [-1,1], [0,0]];

        this.parent   = parent;
        this.monsters = document.querySelector(".monsters");
        this.blooder  = document.querySelector(".blood");

        this.monsters.innerHTML = "";
        this.blooder.innerHTML  = "";
    }

    /**
     * Creates the Mobs for all the starts
     * @param {{type: String, isBoss: Boolean, wave: Number, lastWave: Boolean}} data
     * @returns {Void}
     */
    mobs(data) {
        let starts  = this.parent.board.getStarts(),
            targets = this.parent.board.getTargets(),
            amount  = 0;

        starts.forEach((element, index) => {
            amount += this.createMobs(data, starts[index], targets[index]);
        });
        return amount;
    }

    /**
     * For a single path, it creates all the required Mobs
     * @param {{type: String, isBoss: Boolean, wave: Number, lastWave: Boolean}} data
     * @param {Array.<Array.<[Number, Number]>>} starts
     * @param {Array.<Array.<[Number, Number]>>} targets
     * @returns {Void}
     */
    createMobs(data, starts, targets) {
        let i = 0, mob, mobs = [];

        do {
            let pos   = Utils.rand(0, starts.length - 1),
                start = starts[pos].pos,
                path  = this.parent.paths.getCellName(start[0], start[1], data.type === "Hopper"),
                dir   = this.parent.paths.getMobDir(path, 0, data.type === "Flying");

            mob = Mob.create(data.type, {
                id          : this.parent.manager.getNextID(),
                pos         : i,
                boss        : data.isBoss,
                wave        : data.wave,
                row         : start[1],
                col         : start[0],
                top         : start[1] * this.parent.board.getSize(),
                left        : start[0] * this.parent.board.getSize(),
                dirTop      : dir.top,
                dirLeft     : dir.left,
                path        : path,
                targetPos   : targets[pos].pos,
                targetValue : targets[pos].value,
                angle       : this.parent.paths.getAngle(path),
                deg         : this.parent.paths.getDeg(dir),
                gameLevel   : this.parent.gameLevel,
                boardSize   : this.parent.board.getSize()
            });

            this.parent.manager.add(mob);
            this.monsters.appendChild(mob.createElement());
            mobs.push(mob);
            i += 1;
        } while (mob.getAmount(data.lastWave) > i);

        this.parent.manager.addCreate(mobs);
        return i;
    }


    /**
     * Creates all the childs of a single parent
     * @param {Mob} parent
     * @returns {Void}
     */
    childs(parent) {
        let cells  = this.getCloseCells(parent),
            childs = [],
            i      = 0,
            mob;

        do {
            let dist  = Math.floor(this.parent.board.getSize() / 2),
                move  = Utils.rand(-dist, dist),
                dtop  = Utils.rand(0, 1),
                dleft = 1 - dtop,
                cell  = cells[i % cells.length],
                dir   = {
                    top  : move < 0 ? -dtop  : dtop,
                    left : move < 0 ? -dleft : dleft
                };

            mob = Mob.create(parent.getChildName(), {
                pos         : i,
                id          : this.parent.manager.getNextID(),
                boss        : parent.isBoss(),
                wave        : parent.getWave(),
                row         : parent.getRow(),
                col         : parent.getCol(),
                top         : parent.getPos().top,
                left        : parent.getPos().left,
                dirTop      : dir.top,
                dirLeft     : dir.left,
                path        : null,
                targetPos   : parent.getTargetPos(),
                targetValue : parent.getTargetValue(),
                angle       : 0,
                deg         : this.parent.paths.getDeg(dir),
                spawnTo     : {
                    top  : cell[0] * this.parent.board.getSize() + move * dtop,
                    left : cell[1] * this.parent.board.getSize() + move * dleft
                },
                gameLevel : this.parent.gameLevel,
                boardSize : this.parent.board.getSize()
            });

            this.parent.manager.add(mob);
            this.monsters.appendChild(mob.createElement());
            childs.push(mob);
            i += 1;
        } while (mob.getAmount() > i);

        this.parent.manager.addSpawn(childs);
    }


    /**
     * Creates the blood after killing a mob
     * @param {Mob} mob
     * @returns {Void}
     */
    createBlood(mob) {
        let element = document.createElement("DIV");
        element.className  = "blood";
        element.style.top  = Utils.toPX(mob.getPos().top);
        element.style.left = Utils.toPX(mob.getPos().left);
        this.blooder.appendChild(element);
    }


    /**
     * Returns a random list with all the cells around the given Mob
     * with nothing on them
     * @param {Mob} mob
     * @returns {Void}
     */
    getCloseCells(mob) {
        let nothing = this.parent.board.getNothingValue(),
            cells   = [];

        this.moveDirs.forEach((dir) => {
            let row = mob.getRow() + dir[0],
                col = mob.getCol() + dir[1];

            if (this.parent.board.inMatrix(row, col) &&
                    this.parent.board.getContent(row, col) <= nothing) {
                cells.push([ row, col ]);
            }
        });

        cells.forEach((cell, i) => {
            let pos = Utils.rand(0, cells.length - 1);

            cells[i]   = cells[pos];
            cells[pos] = cell;
        });

        return cells;
    }
}
