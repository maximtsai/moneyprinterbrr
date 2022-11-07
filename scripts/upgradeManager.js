/**
 * This file contains the code for the game's stats such as amount of money and upgrades purchased.
 * 
 **/
 
 class UpgradeManager {
    constructor() {
        this.reset();
        this.upgradesEarned = [];
        this.upgradesEnabled = [];
        this.totalUpgrades = 0;
        messageBus.subscribe("addMoney", this.checkEnableUpgrades.bind(this));
        messageBus.subscribe("checkEnableStockSellUpgrades", this.checkEnableStockSellUpgrades.bind(this));
    }

    checkEnableUpgrades() {
        let moneyAmt = globalObjects.gameStats.getMoney();
        // Promotions upgrades
        if (!this.upgradesEnabled['promotion1']) {
            this.checkPromotionUpgrade(moneyAmt, 50, 'promotion1', "GET PROMOTION", 120, 1.2);
        } else if (!this.upgradesEnabled['promotion2'] && this.upgradesEarned['promotion1']) {
            this.checkPromotionUpgrade(moneyAmt, 100, 'promotion2', "GET PROMOTION 2", 500, 1.5);
        } else if (!this.upgradesEnabled['promotion3'] && this.upgradesEarned['promotion2']) {
            this.checkPromotionUpgrade(moneyAmt, 1000, 'promotion3', "GET PROMOTION 3", 5000, 2);
        } else if (!this.upgradesEnabled['promotion4'] && this.upgradesEarned['promotion3']) {
            this.checkPromotionUpgrade(moneyAmt, 10000, 'promotion4', "GET PROMOTION 4", 50000, 3);
        }
        // Printer upgrades
        if (!this.upgradesEnabled['printer1']) {
            this.checkPrinterUpgrade(moneyAmt, 25, 'printer1', "DE-RUST PRINTER", 50, 1);
        } else if (!this.upgradesEnabled['printer2'] && this.upgradesEarned['printer1']) {
            this.checkPrinterUpgrade(moneyAmt, 250, 'printer2', "LUBRICATE PRINTER", 1000, 2);
        } else if (!this.upgradesEnabled['printer3'] && this.upgradesEarned['printer2']) {
            this.checkPrinterUpgrade(moneyAmt, 2500, 'printer3', "LUBRICATE PRINTER 2", 10000, 3);
        }

        if (!this.upgradesEnabled['bloomberg']) {
            // bloomberg
            this.checkGeneralUpgrade(moneyAmt, 1, 'bloomberg', "FIX NEWS TERMINAL", 10, () => {});
        } else if (!this.upgradesEnabled['computer'] && this.upgradesEarned['bloomberg']) {
            // computer
            this.checkGeneralUpgrade(moneyAmt, 0, 'computer', "FIX COMPUTER", 20, () => {});
        } else if (!this.upgradesEnabled['music'] && this.upgradesEarned['computer']) {
            // music
            this.checkGeneralUpgrade(moneyAmt, 0, 'music', "BUY RADIO", 30, () => {});
        }

        // Cleanup upgrades

        // e
        if (!this.upgradesEnabled['retirementcash']) {
            this.checkGeneralUpgrade(moneyAmt, 100000, 'retirementcash', "RETIRE RICH", 1000000, () => {}, 0, true);
        }

        // retire wealthy
        if (!this.upgradesEnabled['buycar']) {
            this.checkGeneralUpgrade(moneyAmt, 10000, 'buycar', "BUY CAR", 30000, () => {});
        } else if (!this.upgradesEnabled['buyhouse']) {
            this.checkGeneralUpgrade(moneyAmt, 0, 'buyhouse', "BUY HOUSE", 500000, () => {}, 6000);
        } else if (!this.upgradesEnabled['buyyacht']) {
            this.checkGeneralUpgrade(moneyAmt, 0, 'buyyacht', "BUY LUXURY YACHT", 2500000, () => {}, 6000);
        } else if (!this.upgradesEnabled['buyplane']) {
            this.checkGeneralUpgrade(moneyAmt, 0, 'buyplane', "BUY PERSONAL PLANE", 5000000, () => {}, 6000);
        } 

        // retire stocks
        // retire gold
        // retire digital
    }

    // upgrades enabled by triggering sales
    checkEnableStockSellUpgrades(totalStocksSold) {
        // borrow money
        if (!this.upgradesEnabled['leverage1'] && totalStocksSold > 10) {
            // computer
            this.checkGeneralUpgrade(0, 0, 'leverage1', "$1000 LOAN", 0, () => {this.createLoan(1000)}, 10000);
        }
    }

    reset() {

    }

    checkPromotionUpgrade(moneyAmt, minMoney, id, title, cost, income) {
        if (moneyAmt >= minMoney && !this.upgradesEnabled[id]) {
            this.upgradesEnabled[id] = true;
            messageBus.publish("addUpgradeButton", title, cost, () => {
                if (!this.upgradesEarned[id]) {
                    globalObjects.gameStats.setIncome(income);
                    this.upgradesEarned[id] = true;
                    this.totalUpgrades++;
                }
            });
        }
    }

    checkPrinterUpgrade(moneyAmt, minMoney, id, title, cost, type) {
        if (moneyAmt >= minMoney && !this.upgradesEnabled[id]) {
            this.upgradesEnabled[id] = true;
            messageBus.publish("addUpgradeButton", title, cost, () => {
                if (!this.upgradesEarned[id]) {
                    globalObjects.printer.upgradePrinter(type);
                    this.upgradesEarned[id] = true;
                    this.totalUpgrades++;
                }
            });
        }
    }

    checkGeneralUpgrade(moneyAmt, minMoney, id, title, cost, func, delay = 2500, addToEnd = false) {
        if (moneyAmt >= minMoney && !this.upgradesEnabled[id]) {
            this.upgradesEnabled[id] = true;
            setTimeout(() => {
                let publishMessage = addToEnd ? "addUpgradeButtonEnd" : "addUpgradeButton";
                messageBus.publish(publishMessage, title, cost, () => {
                    if (!this.upgradesEarned[id]) {
                        func();
                        this.upgradesEarned[id] = true;
                        this.totalUpgrades++;
                        this.checkEnableUpgrades();
                    }
                });
            }, delay);
        }
    }

    createLoan(loanAmt) {
        let debtAmt = loanAmt * 1.1;
        messageBus.publish("addMoney", loanAmt);
        messageBus.publish("addDebt", debtAmt);
        messageBus.publish("setInterest", 10);
    }


}