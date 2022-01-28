import Mobs         from "./Mobs.js";
import Data         from "../Data.js";
import Factory      from "../Factory.js";
import Mob          from "../mob/Mob.js";

// Utils
import Utils        from "../../../utils/Utils.js";



/**
 * Defender Mobs Create
 */
export default class Create {

    /**
     * Defender Mobs Create constructor
     * @param {Mobs} parent
     */
    constructor(parent) {
        this.moveDirs = [ [0, 1], [1, 1], [1, 0], [1, -1], [0,-1], [-1,-1], [-1,0], [-1,1], [0,0] ];

        this.parent   = parent;
        this.monsters = document.querySelector(".monsters");
        this.blooder  = document.querySelector(".blood");

        this.monsters.innerHTML = "";
        this.blooder.innerHTML  = "";
    }

    /**
     * Creates the Mobs for all the starts
     * @param {{type: String, isBoss: Boolean, wave: Number, lastWave: Boolean}} data
     * @returns {Number}
     */
    mobs(data) {
        const starts  = this.parent.board.starts;
        const targets = this.parent.board.targets;
        let   amount  = 0;

        starts.forEach((element, index) => {
            amount += this.createMobs(data, starts[index], targets[index]);
        });
        return amount;
    }

    /**
     * For a single path, it creates all the required Mobs
     * @param {{type: String, isBoss: Boolean, wave: Number, lastWave: Boolean}} data
     * @param {{col: Number, row: Number, value: Number}[]} starts
     * @param {{col: Number, row: Number, value: Number}[]} targets
     * @returns {Number}
     */
    createMobs(data, starts, targets) {
        const mobs = [];
        let   mob  = null;
        let   i    = 0;

        do {
            const pos   = Utils.rand(0, starts.length - 1);
            const start = starts[pos];
            const path  = this.parent.paths.getCellName(start.col, start.row, data.type === "Hopper");
            const dir   = this.parent.paths.getMobDir(path, 0, data.type === "Flying");

            mob = Factory.createMob(data.type, {
                id          : this.parent.manager.nextID,
                pos         : i,
                isBoss      : data.isBoss,
                wave        : data.wave,
                row         : start.row,
                col         : start.col,
                top         : start.row * Data.squareSize,
                left        : start.col * Data.squareSize,
                dirTop      : dir.top,
                dirLeft     : dir.left,
                path        : path,
                target      : targets[pos],
                angle       : this.parent.paths.getAngle(path),
                deg         : this.parent.paths.getDeg(dir),
                gameLevel   : this.parent.gameLevel,
                boardSize   : Data.squareSize
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
        const cells  = this.getCloseCells(parent);
        const childs = [];
        let   mob    = null;
        let   i      = 0;

        do {
            const dist  = Math.floor(Data.squareSize / 2);
            const move  = Utils.rand(-dist, dist);
            const dtop  = Utils.rand(0, 1);
            const dleft = 1 - dtop;
            const cell  = cells[i % cells.length];
            const dir   = {
                top  : move < 0 ? -dtop  : dtop,
                left : move < 0 ? -dleft : dleft
            };

            mob = Factory.createMob(parent.childName, {
                pos         : i,
                id          : this.parent.manager.nextID,
                boss        : parent.isBoss,
                wave        : parent.wave,
                row         : parent.row,
                col         : parent.col,
                top         : parent.pos.top,
                left        : parent.pos.left,
                dirTop      : dir.top,
                dirLeft     : dir.left,
                path        : null,
                target      : parent.target,
                angle       : 0,
                deg         : this.parent.paths.getDeg(dir),
                spawnTo     : {
                    top  : cell.row * Data.squareSize + move * dtop,
                    left : cell.col * Data.squareSize + move * dleft
                },
                gameLevel : this.parent.gameLevel,
                boardSize : Data.squareSize
            });

            this.parent.manager.add(mob);
            this.monsters.appendChild(mob.createElement());
            childs.push(mob);
            i += 1;
        } while (mob.getAmount(false) > i);

        this.parent.manager.addSpawn(childs);
    }

    /**
     * Creates the blood after killing a mob
     * @param {Mob} mob
     * @returns {Void}
     */
    createBlood(mob) {
        const element = document.createElement("DIV");
        element.className  = "blood";
        element.style.top  = Utils.toPX(mob.pos.top);
        element.style.left = Utils.toPX(mob.pos.left);
        this.blooder.appendChild(element);
    }



    /**
     * Returns a random list with all the cells around the given Mob
     * with nothing on them
     * @param {Mob} mob
     * @returns {{row: Number, col: Number}[]}
     */
    getCloseCells(mob) {
        const nothing = Data.nothing;
        const cells   = [];

        this.moveDirs.forEach((dir) => {
            const row = mob.row + dir[0];
            const col = mob.col + dir[1];

            if (this.parent.board.inMatrix(row, col) &&
                    this.parent.board.getContent(row, col) <= nothing) {
                cells.push({ row, col });
            }
        });

        cells.forEach((cell, i) => {
            const pos = Utils.rand(0, cells.length - 1);

            cells[i]   = cells[pos];
            cells[pos] = cell;
        });

        return cells;
    }
}
