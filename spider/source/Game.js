import Animation    from "./Animation.js";
import Card         from "./Card.js";
import Chain        from "./Chain.js";
import Data         from "./Data.js";
import Deck         from "./Deck.js";
import Display      from "./Display.js";
import Foundations  from "./Foundations.js";
import HighScores   from "./HighScores.js";
import Hints        from "./Hints.js";
import History      from "./History.js";
import Instance     from "./Instance.js";
import Score        from "./Score.js";
import Stock        from "./Stock.js";
import Tableau      from "./Tableau.js";

// Utils
import Sounds       from "../../utils/Sounds.js";
import Utils        from "../../utils/Utils.js";



/**
 * Spider Game
 */
export default class Game {

    /**
     * Spider Game constructor
     * @param {Instance} instance
     * @param {Display}  display
     * @param {Sounds}   sounds
     * @param {Number}   suits
     */
    constructor(instance, display, sounds, suits) {
        this.instance    = instance;
        this.display     = display;
        this.sounds      = sounds;
        this.suits       = suits;

        this.animation   = new Animation();
        this.deck        = new Deck(this.suits);
        this.stock       = new Stock();
        this.foundations = new Foundations();
        this.tableau     = new Tableau();
        this.score       = new Score(this.instance, this.suits);
        this.history     = new History();
        this.hints       = new Hints(this.tableau, this.stock);
        this.highScores  = new HighScores(this.suits);
    }

    /**
     * Resets the Game
     * @returns {Void}
     */
    reset() {
        this.deck.reset();
        this.stock.reset();
        this.foundations.reset();
        this.tableau.reset();
        this.score.reset();
        this.history.reset();
        this.display.closeDialogs();
    }

    /**
     * Starts the Game
     * @returns {Void}
     */
    start() {
        this.highScores.addLoose();
        this.sounds.play("start");
        this.reset();
        this.deck.shuffle();
        this.highScores.addGame();
        this.instance.addGame(this.suits, this.deck);
        this.startGame();
    }

    /**
     * Restarts the Game
     * @returns {Void}
     */
    restart() {
        this.sounds.play("restart");
        this.reset();
        this.instance.addGame(this.suits, this.deck);
        this.startGame();
    }

    /**
     * Restores the Game
     * @returns {Void}
     */
    restore() {
        this.deck.restore(this.instance.cards, this.instance.usedCards);
        this.stock.restore(this.instance.dealsLeft);
        this.foundations.restore(this.instance.getFoundationCards(this.deck));
        this.tableau.restore(this.instance.getColumnCards(this.deck));
        this.score.restore(this.instance.score, this.instance.moves, this.instance.time);
        this.history.restore(this.instance.getHistory(), this.instance.current);

        this.display.closeDialogs();
        this.score.startTimer();
    }

    /**
     * Pauses the Game
     * @returns {Void}
     */
    pause() {
        this.display.showPause();
        this.score.stopTimer();
    }

    /**
     * Continues the Game
     * @returns {Void}
     */
    continue() {
        this.display.closeDialogs();
        this.score.startTimer();
    }

    /**
     * Shows the Game Scores
     * @returns {Void}
     */
    scores() {
        this.display.showScores();
        this.score.stopTimer();
        this.highScores.build();
    }

    /**
     * Resets the Game Scores
     * @returns {Void}
     */
    resetScores() {
        this.score.stopTimer();
        this.highScores.reset();
        this.highScores.build();
    }



    /**
     * Starts the Game
     * @returns {Promise}
     */
    async startGame() {
        for (let i = 0; i < Data.initialCards; i++) {
            const card  = this.deck.pick();
            const index = i % Data.columns;
            if (i < Data.initialCards - Data.columns) {
                card.showBack();
            }
            await this.animation.deal(card, this.stock.bounds, this.tableau.columns[index].bounds, 15, true);
            this.tableau.columns[index].addCard(card);
        }
        this.instance.saveGame(this.tableau, this.foundations, this.history);
        this.score.startTimer();
    }

    /**
     * Deals 10 cards from the Stock
     * @returns {Promise}
     */
    async deal() {
        if (this.stock.isEmpty) {
            return;
        }
        if (!this.tableau.canDeal()) {
            this.display.showDealError();
            this.score.stopTimer();
            return;
        }
        this.sounds.play("deal");
        for (let i = 0; i < Data.columns; i++) {
            const card = this.deck.pick();
            await this.animation.deal(card, this.stock.bounds, this.tableau.columns[i].bounds, 15);
            this.tableau.columns[i].addCard(card);
            await this.completeSequence(i);
        }
        this.stock.remove();
        this.history.addDeal();
        this.hints.invalidate();

        this.instance.saveGame(this.tableau, this.foundations, this.history);
    }

    /**
     * Drops the picked Card or Chain
     * @param {(Card|Chain)} picked
     * @returns {Void}
     */
    drop(picked) {
        const newColumn = this.tableau.getDropColumn(picked);
        this.afterMove(picked, newColumn);
    }

    /**
     * Moves the picked Card or Chain
     * @param {(Card|Chain)} picked
     * @returns {Void}
     */
    move(picked) {
        const newColumn = this.tableau.getMoveColumn(picked);
        this.afterMove(picked, newColumn);
    }

    /**
     * Called after a drop or move of the picked Card or Chain
     * @param {(Card|Chain)} picked
     * @param {Number}       newColumn
     * @returns {Promise}
     */
    async afterMove(picked, newColumn) {
        const oldColumn = picked.column;
        if (oldColumn === newColumn) {
            this.tableau.columns[oldColumn].addCards(picked.cards);
            picked.drop();
            return;
        }

        this.sounds.play("drop");
        await this.animation.move(picked, this.tableau.columns[newColumn]);
        this.tableau.columns[newColumn].addCards(picked.cards);
        picked.drop();

        this.history.addMove(oldColumn, newColumn, picked.amount);
        this.score.incMoves();
        this.hints.invalidate();
        this.flip(oldColumn);

        this.instance.saveGame(this.tableau, this.foundations, this.history);

        this.completeSequence(newColumn);
    }

    /**
     * Completes a Sequence if possible
     * @param {Number} column
     * @returns {Promise}
     */
    async completeSequence(column) {
        const sequence = this.tableau.columns[column].getCompleteSequence();
        if (!sequence) {
            return;
        }

        this.sounds.play("foundation");
        await this.animation.foundation(sequence, null, this.foundations.bounds);
        this.foundations.push(sequence);
        this.history.addFoundation(column);
        this.score.addFoundation();
        this.flip(column);

        this.instance.saveGame(this.tableau, this.foundations, this.history);

        if (this.foundations.amount === Data.foundations) {
            this.win();
        }
    }

    /**
     * Flips a Card if needed
     * @param {Number} column
     * @returns {Void}
     */
    flip(column) {
        if (this.tableau.columns[column].showCardFront()) {
            this.history.addFilp(column);
            this.score.addFilp();
        }
    }

    /**
     * Wins the Game
     * @returns {Promise}
     */
    async win() {
        this.score.stopTimer();
        this.score.addBonus();
        this.sounds.play("win");
        while (this.foundations.amount > 0) {
            const cards = this.foundations.pop();
            await this.animation.win(cards, this.foundations.bounds);
        }
        this.display.showCongrats(`
            You won the game with a score of <b>${this.score.score}</b>
            in <b>${Utils.timeToString(this.score.time)}</b> and
            <b>${this.score.moves} moves</b>.
        `);
        this.highScores.addWin(this.score.score, this.score.time, this.score.moves);
        // this.instance.removeGame();
    }

    /**
     * Lost the Game
     * @returns {Void}
     */
    lost() {
        this.highScores.addLoose();
        this.display.closeDialogs();
    }

    /**
     * Undoes the last action
     * @returns {Promise}
     */
    async undo() {
        if (this.isUndoing || !this.history.canUndo()) {
            return;
        }
        this.isUndoing = true;
        this.hints.invalidate();

        const action = this.history.undoAction();
        switch (action.type) {
        case "filp": {
            this.tableau.columns[action.column].showCardBack();
            this.score.subTurn();
            break;
        }
        case "move": {
            const chain = this.tableau.columns[action.to].removeAmount(action.amount);
            await this.animation.move(chain, this.tableau.columns[action.from]);
            this.tableau.columns[action.from].addCards(chain.cards);
            break;
        }
        case "deal": {
            for (let i = 0; i < Data.columns; i++) {
                const card = this.tableau.columns[i].removeLast();
                card.float();
                await this.animation.deal(card, card.bounds, this.stock.bounds, 0);
                card.remove();
            }
            this.deck.add(Data.columns);
            this.stock.add();
            break;
        }
        case "foundation": {
            const column = this.tableau.columns[action.column];
            const cards  = this.foundations.pop();
            await this.animation.foundation(cards, this.foundations.bounds, column.bounds, column);
            column.addCards(cards);
            this.score.subFoundation();
            break;
        }
        }

        this.instance.saveGame(this.tableau, this.foundations, this.history);
        this.isUndoing = false;

        if (this.history.undoAgain()) {
            this.undo();
        } else {
            this.score.subUndo();
            this.sounds.play("undo");
        }
    }

    /**
     * Redoes the last action
     * @returns {Promise}
     */
    async redo() {
        if (this.isRedoing || !this.history.canRedo()) {
            return;
        }
        this.isRedoing = true;
        this.hints.invalidate();

        const action = this.history.redoAction();
        switch (action.type) {
        case "filp": {
            this.tableau.columns[action.column].showCardFront();
            this.score.addFilp();
            break;
        }
        case "move": {
            const chain = this.tableau.columns[action.from].removeAmount(action.amount);
            await this.animation.move(chain, this.tableau.columns[action.to]);
            this.tableau.columns[action.to].addCards(chain.cards);
            break;
        }
        case "deal": {
            for (let i = 0; i < Data.columns; i++) {
                const card = this.deck.pick();
                await this.animation.deal(card, this.stock.bounds, this.tableau.columns[i].bounds, 0);
                this.tableau.columns[i].addCard(card);
            }
            this.stock.remove();
            break;
        }
        case "foundation": {
            const cards = this.tableau.columns[action.column].removeSequence();
            await this.animation.foundation(cards, null, this.foundations.bounds);
            this.foundations.push(cards);
            this.score.addFoundation();
            break;
        }
        }

        this.instance.saveGame(this.tableau, this.foundations, this.history);
        this.isRedoing = false;

        if (this.history.redoAgain()) {
            this.redo();
        } else {
            this.score.addUndo();
            this.sounds.play("redo");
        }
    }

    /**
     * Shows a Hint
     * @returns {Void}
     */
    showHint() {
        if (!this.hints.showHint()) {
            this.display.showMovesError();
            this.score.stopTimer();
        }
        this.score.subHint();
    }

    /**
     * Hides the Hint
     * @returns {Void}
     */
    hideHint() {
        this.hints.hideHint();
    }
}
