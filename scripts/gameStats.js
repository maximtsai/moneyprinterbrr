/**
 * This file contains the code for the game's stats such as amount of money and upgrades purchased.
 * 
 **/
 
 class GameStats {
    constructor() {
        this.reset();
    }

    addMoney(amt) {
        if (amt < 0 && this.money + amt < 0) {
            console.warn("cannot go into debt!")
            return false;
        }
        this.money += amt;
        return this.money;
    }

    addStocks(amt) {
        if (amt < 0 && this.stocks + amt < 0) {
            console.warn("cannot short the market!")
            return false;
        }
        this.stocks += amt;
        return this.stocks;
    }

    addUpgrade(upgrade) {
        if (this.upgrades[upgrade]) {
            console.warn("Already purchased upgrade")
        } else {
            this.upgrades[upgrade] = true;
        }
    }

    setTitle(title) {
        this.title = title;
    }

    hasUpgrade(upgrade) {
        return this.upgrades[upgrade];
    }

    getMoney() {
        return this.money;
    }

    getStocks() {
        return this.stocks;
    }

    getTitle() {
        return this.title;
    }

    reset() {
        this.money = 0;
        this.stocks = 0;
        this.upgrades = {};
        this.title = "Junior Money Printer Operator";
    }
}