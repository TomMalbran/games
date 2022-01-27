import Board        from "./board/Board.js";



/**
 * Pacman Fruit
 */
export default class Fruit {

    /**
     * Pacman Fruit constructor
     * @param {Board} board
     */
    constructor(board) {
        this.board = board;
        this.level = board.level;
        this.ctx   = board.boardCanvas.ctx;
        this.timer = 0;
    }



    /**
     * Try to add a fruit in the board
     * @param {Number} dotsLeft
     * @returns {Void}
     */
    add(dotsLeft) {
        if (dotsLeft === this.level.fruitDots1 || dotsLeft === this.level.fruitDots2) {
            this.timer = this.level.fruitTime;
            this.draw(this.board.fruitTile);
        }
    }

    /**
     * Reduces the fruit timer when there is one
     * @param {Number} time
     * @returns {Void}
     */
    reduceTimer(time) {
        if (this.timer > 0) {
            this.timer -= time;
            if (this.timer <= 0) {
                this.eat();
            }
        }
    }

    /**
     * Eats the Fruit
     * @returns {Void}
     */
    eat() {
        this.clear();
        this.timer = 0;
    }

    /**
     * Returns true if the given tile is at the fruit position
     * @param {{x: Number, y: Number}} tile
     * @returns {Boolean}
     */
    isAtPos(tile) {
        if (this.timer <= 0) {
            return false;
        }
        const rect = this.board.fruitRect;
        const pos  = this.board.tileToPos(tile);
        return (
            pos.x >= rect.left && pos.x <= rect.right &&
            pos.y >= rect.top  && pos.y <= rect.bottom
        );
    }



    /**
     * Draws a Fruit
     * @param {{x: Number, y: Number}} tile
     * @returns {Void}
     */
    draw(tile) {
        const pos = this.board.tileToPos(tile);
        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this[`draw${this.level.fruitName}`]();
        this.ctx.restore();
    }

    /**
     * Clears the Fruit
     * @returns {Void}
     */
    clear() {
        const pos = this.board.fruitPos;
        this.ctx.clearRect(pos.x - 1, pos.y - 1, this.board.fruitSize, this.board.fruitSize);
    }



    /**
     * Draws the Cherries Fruit
     * @returns {Void}
     */
    drawCherries() {
        const nums = this.board.numbers;

        this.ctx.fillStyle = "rgb(255, 0, 0)";
        this.ctx.beginPath();
        this.ctx.arc(nums.n10, nums.n14, nums.n4, 0, 2 * Math.PI);
        this.ctx.arc(nums.n4, nums.n10, nums.n4, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.beginPath();
        this.ctx.arc(nums.n8, nums.n15, nums.r2, 0, 2 * Math.PI);
        this.ctx.arc(nums.r2, nums.n11, nums.r2, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.strokeStyle = "rgb(0, 153, 0)";
        this.ctx.lineWidth = nums.n2;
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n17, nums.n1);
        this.ctx.quadraticCurveTo(nums.n9, nums.n1, nums.n5, nums.n9);
        this.ctx.moveTo(nums.n17, nums.n1);
        this.ctx.quadraticCurveTo(nums.n12, nums.n3, nums.n10, nums.n12);
        this.ctx.stroke();

        this.ctx.strokeStyle = "rgb(222, 151, 81)";
        this.ctx.lineWidth = nums.n3;
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n17, nums.n1);
        this.ctx.lineTo(nums.n16, nums.n2);
        this.ctx.stroke();
    }

    /**
     * Draws the Strawberry Fruit
     * @returns {Void}
     */
    drawStrawberry() {
        const nums = this.board.numbers;
        const dots = [
            nums.n3, nums.n7, nums.n5, nums.n6, nums.n4, nums.n10, nums.n7,
            nums.n8, nums.n6, nums.n11, nums.n7, nums.n13, nums.n9, nums.n10,
            nums.n9, nums.n14, nums.n10, nums.n12, nums.n11, nums.n8, nums.n12,
            nums.n11, nums.n14, nums.n6, nums.n14, nums.n9,
        ];

        this.ctx.fillStyle = "rgb(222, 0, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n9, nums.n3);
        this.ctx.quadraticCurveTo(nums.n17, nums.n3, nums.n17, nums.n7);
        this.ctx.quadraticCurveTo(nums.n17, nums.n14, nums.n9, nums.n17);
        this.ctx.quadraticCurveTo(nums.n1, nums.n14, nums.n1, nums.n7);
        this.ctx.quadraticCurveTo(nums.n1, nums.n3, nums.n9, nums.n3);
        this.ctx.fill();

        this.ctx.fillStyle = "rgb(0, 222, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n5, nums.n3);
        this.ctx.lineTo(nums.n13, nums.n3);
        this.ctx.lineTo(nums.n14, nums.n4);
        this.ctx.lineTo(nums.n9, nums.n7);
        this.ctx.lineTo(nums.n4, nums.n4);
        this.ctx.fill();

        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.fillRect(nums.n8, 0, nums.n2, nums.n4);

        for (let i = 0; i < dots.length; i += 2) {
            this.ctx.fillRect(dots[i], dots[i + 1], 1, 1);
        }
    }

    /**
     * Draws the Peach Fruit
     * @returns {Void}
     */
    drawPeach() {
        const nums = this.board.numbers;

        this.ctx.fillStyle = "rgb(255, 181, 33)";
        this.ctx.beginPath();
        this.ctx.arc(nums.n6,  nums.n10, nums.n5, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(nums.n12, nums.n10, nums.n5, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(nums.n10, nums.n11, nums.n7, 0, 0.5 * Math.PI, false);
        this.ctx.arc(nums.n8,  nums.n11, nums.n7, 0.5 * Math.PI, Math.PI, false);
        this.ctx.fill();

        this.ctx.strokeStyle = "rgb(0, 222, 0)";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n6, nums.n5);
        this.ctx.lineTo(nums.n14, nums.n4);
        this.ctx.moveTo(nums.n14, 0);
        this.ctx.quadraticCurveTo(nums.n11, 0, nums.n10, nums.n7);
        this.ctx.stroke();
    }

    /**
     * Draws the Apple Fruit
     * @returns {Void}
     */
    drawApple() {
        const nums = this.board.numbers;

        this.ctx.fillStyle = "rgb(222, 0, 0)";
        this.ctx.beginPath();
        this.ctx.arc(nums.n6,  nums.n8,  nums.n5, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(nums.n12, nums.n8,  nums.n5, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(nums.n10, nums.n11, nums.n7, 0, 0.5 * Math.PI, false);
        this.ctx.arc(nums.n13, nums.n15, nums.n3, 0.5 * Math.PI, Math.PI, false);
        this.ctx.arc(nums.n6,  nums.n15, nums.n3, 0, 0.5 * Math.PI, false);
        this.ctx.arc(nums.n8,  nums.n11, nums.n7, 0.5 * Math.PI, Math.PI, false);
        this.ctx.fill();

        this.ctx.strokeStyle = "rgb(0, 222, 0)";
        this.ctx.lineCap = "round";
        this.ctx.beginPath();
        this.ctx.arc(nums.n3,  nums.n7, nums.n7, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(nums.n13, nums.n4, nums.n4, Math.PI, 1.5 * Math.PI, false);
        this.ctx.stroke();

        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
        this.ctx.beginPath();
        this.ctx.arc(nums.n7, nums.n9, nums.n4, Math.PI, 1.5 * Math.PI, false);
        this.ctx.stroke();
    }

    /**
     * Draws the Grapes Fruit
     * @returns {Void}
     */
    drawGrapes() {
        const nums = this.board.numbers;

        this.ctx.fillStyle = "rgb(0, 222, 0)";
        this.ctx.beginPath();
        this.ctx.arc(nums.n9, nums.n10, nums.n8, 0, 2 * Math.PI);
        this.ctx.fill();

        this.ctx.strokeStyle = "rgb(74, 74, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n9, nums.n3);
        this.ctx.lineTo(nums.n2, nums.n10);
        this.ctx.lineTo(nums.n7, nums.n15);
        this.ctx.moveTo(nums.n14, nums.n5);
        this.ctx.lineTo(nums.n8, nums.n11);
        this.ctx.lineTo(nums.n14, nums.n17);
        this.ctx.moveTo(nums.n9, nums.n5);
        this.ctx.lineTo(nums.n15, nums.n11);
        this.ctx.lineTo(nums.n10, nums.n16);
        this.ctx.moveTo(nums.n10, nums.n13);
        this.ctx.lineTo(nums.n4, nums.n17);
        this.ctx.stroke();

        this.ctx.strokeStyle = "rgb(222, 148, 74)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n4, 0);
        this.ctx.lineTo(nums.n5, nums.n1);
        this.ctx.lineTo(nums.n12, nums.n1);
        this.ctx.moveTo(nums.n9, nums.n1);
        this.ctx.lineTo(nums.n9, nums.n4);
        this.ctx.stroke();
    }

    /**
     * Draws the Galaxian Fruit
     * @returns {Void}
     */
    drawGalaxian() {
        const nums = this.board.numbers;

        this.ctx.fillStyle   = "rgb(255, 250, 55)";
        this.ctx.strokeStyle = "rgb(255, 250, 55)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n1, nums.n4);
        this.ctx.lineTo(nums.n17, nums.n4);
        this.ctx.lineTo(nums.n9, nums.n11);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n9, nums.n11);
        this.ctx.lineTo(nums.n9, nums.n18);
        this.ctx.stroke();

        this.ctx.strokeStyle = "rgb(0, 51, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n1, nums.n1);
        this.ctx.lineTo(nums.n1, nums.n6);
        this.ctx.lineTo(nums.n8, nums.n12);
        this.ctx.moveTo(nums.n17, nums.n1);
        this.ctx.lineTo(nums.n17, nums.n6);
        this.ctx.lineTo(nums.n10, nums.n12);
        this.ctx.stroke();

        this.ctx.fillStyle   = "rgb(255, 0, 0)";
        this.ctx.strokeStyle = "rgb(255, 0, 0)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n3, nums.n5);
        this.ctx.lineTo(nums.n9, 0);
        this.ctx.lineTo(nums.n15, nums.n5);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n9, nums.n3);
        this.ctx.lineTo(nums.n9, nums.n6);
        this.ctx.stroke();
    }

    /**
     * Draws the Bell Fruit
     * @returns {Void}
     */
    drawBell() {
        const nums = this.board.numbers;

        this.ctx.fillStyle = "rgb(255, 255, 33)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n1, nums.n15);
        this.ctx.quadraticCurveTo(nums.n1, nums.n1, nums.n9, nums.n1);
        this.ctx.quadraticCurveTo(nums.n17, nums.n1, nums.n17, nums.n15);
        this.ctx.fill();

        this.ctx.fillStyle = "rgb(0, 222, 222)";
        this.ctx.fillRect(nums.n3, nums.n14, nums.n12, nums.n3);
        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.fillRect(nums.n9, nums.n14, nums.n3, nums.n3);

        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n8, nums.n4);
        this.ctx.quadraticCurveTo(nums.n4, nums.n4, nums.n4, nums.n13);
        this.ctx.stroke();
    }

    /**
     * Draws the Key Fruit
     * @returns {Void}
     */
    drawKey() {
        const nums = this.board.numbers;

        this.ctx.fillStyle = "rgb(0, 222, 222)";
        this.ctx.beginPath();
        this.ctx.arc(nums.n6,  nums.n3, nums.n3, Math.PI, 1.5 * Math.PI, false);
        this.ctx.arc(nums.n12, nums.n3, nums.n3, 1.5 * Math.PI, 2 * Math.PI, false);
        this.ctx.arc(nums.n12, nums.n5, nums.n3, 0, 0.5 * Math.PI, false);
        this.ctx.arc(nums.n6,  nums.n5, nums.n3, 0.5 * Math.PI, Math.PI, false);
        this.ctx.fill();
        this.ctx.clearRect(nums.n6, nums.n2, nums.n6, nums.n2);

        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(nums.n8, nums.n8);
        this.ctx.lineTo(nums.n8, nums.n15);
        this.ctx.arc(nums.n8 + nums.r2, nums.n15 - nums.r2, nums.r2, Math.PI, 0, true);
        this.ctx.lineTo(nums.n11, nums.n8);
        this.ctx.moveTo(nums.n11, nums.n10);
        this.ctx.lineTo(nums.n14, nums.n10);
        this.ctx.moveTo(nums.n11, nums.n13);
        this.ctx.lineTo(nums.n14, nums.n13);
        this.ctx.stroke();
    }
}
