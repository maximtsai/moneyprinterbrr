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
    }

    checkEnableUpgrades() {
        let moneyAmt = globalObjects.gameStats.getMoney();
        // Promotions upgrades
        if (!this.upgradesEnabled['promotion1']) {
            this.checkPromotionUpgrade(moneyAmt, 30, 'promotion1', "GET PROMOTION", 50, 1.2);
        } else if (!this.upgradesEnabled['promotion2']) {
            this.checkPromotionUpgrade(moneyAmt, 100, 'promotion2', "GET PROMOTION 2", 500, 1.5);
        } else if (!this.upgradesEnabled['promotion3']) {
            this.checkPromotionUpgrade(moneyAmt, 1000, 'promotion3', "GET PROMOTION 3", 5000, 2);
        } else if (!this.upgradesEnabled['promotion4']) {
            this.checkPromotionUpgrade(moneyAmt, 10000, 'promotion4', "GET PROMOTION 4", 50000, 3);
        }
        // Printer upgrades
        if (!this.upgradesEnabled['printer1']) {
            this.checkPrinterUpgrade(moneyAmt, 50, 'printer1', "DE-RUST PRINTER", 100, 1);
        } else if (!this.upgradesEnabled['printer2']) {
            this.checkPrinterUpgrade(moneyAmt, 250, 'printer2', "LUBRICATE PRINTER", 1000, 2);
        } else if (!this.upgradesEnabled['printer3']) {
            this.checkPrinterUpgrade(moneyAmt, 2500, 'printer3', "LUBRICATE PRINTER 2", 10000, 3);
        }

        if (!this.upgradesEnabled['bloomberg']) {
            // bloomberg
            this.checkGeneralUpgrade(moneyAmt, 5, 'bloomberg', "FIX NEWS TERMINAL", 10, () => {});
        } else if (!this.upgradesEnabled['computer']) {
            // computer
            this.checkGeneralUpgrade(moneyAmt, 0, 'computer', "FIX COMPUTER", 20, () => {});
        } else if (!this.upgradesEnabled['music']) {
            // music
            this.checkGeneralUpgrade(moneyAmt, 0, 'music', "BUY RADIO", 25, () => {});
        }

        // Cleanup upgrades

        // e
        if (!this.upgradesEnabled['retirementcash']) {
            this.checkGeneralUpgrade(moneyAmt, 100000, 'retirementcash', "RETIRE RICH", 1000000, () => {});
        }
        // retire stocks

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

    checkGeneralUpgrade(moneyAmt, minMoney, id, title, cost, func, delay = 2500) {
        if (moneyAmt >= minMoney && !this.upgradesEnabled[id]) {
            this.upgradesEnabled[id] = true;
            setTimeout(() => {
                messageBus.publish("addUpgradeButton", title, cost, () => {
                    if (!this.upgradesEarned[id]) {
                        func();
                        this.upgradesEarned[id] = true;
                        this.totalUpgrades++;
                        checkEnableUpgrades();
                    }
                });
            }, delay);
        }
    }




}