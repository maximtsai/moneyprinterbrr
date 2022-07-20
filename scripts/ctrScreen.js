/**
 * This file contains the code for the computer screen at the top left
 * 
 **/
 const TRANSACTION_FEE = 4.95;
 class CTRScreen {
   constructor(x, y) {
         this.bg = PhaserScene.add.image(x, y, 'ctrBase');
         let feeFont = {fontFamily: 'Arial', fontSize: 12, color: '#909090', align: 'right'};
         this.feeText = PhaserScene.add.text(x + 14, y + 159, "$"+TRANSACTION_FEE+" TRANSACTION FEE PER BUY ORDER", feeFont);

         let portfolioFont = {fontFamily: 'Arial', fontSize: 12, color: '#000000', align: 'left'};
         this.portfolioText = PhaserScene.add.text(x - 260, y + 159, "Account Value: $0.00", portfolioFont);
         // this.feeText.setDepth(10);
         this.createButtons(x, y);
         let stockFont = {fontFamily: 'Arial', fontSize: 18, color: '#000000', align: 'center'};

         this.stockAmtText = PhaserScene.add.text(x, y + 196.5, "STOCK\nXX", stockFont);
         this.stockAmtText.setOrigin(0.5, 0.5);

        messageBus.subscribe("updateStocksAmt", this.updateStockText.bind(this));
        messageBus.subscribe("addMoney", this.updateButtonStateBuy.bind(this));
        messageBus.subscribe("addStocks", this.updateButtonStateSell.bind(this));
        messageBus.subscribe("setMarketHistory", this.updatePortfolioText.bind(this));

        setTimeout(() => {
           this.updateButtonStateBuy();
           this.updateButtonStateSell();
        }, 0);
   }

   updateStockText(newText) {
      this.stockAmtText.setText("STOCK\n"+newText);
   }

   updatePortfolioText() {
      let portfolioVal = globalObjects.gameStats.getStockPrice() * globalObjects.gameStats.getStocks();
      let portfolioText = portfolioVal.toString();
      let dotPos = portfolioText.indexOf('.');
      if (dotPos === -1) {
         portfolioText += '.00';
      } else if (dotPos === portfolioText.length - 2) {
         portfolioText += '0';
      } else if (dotPos < portfolioText.length - 3) {
         portfolioText = portfolioText.substring(0, dotPos + 3);
      }
      this.portfolioText.setText("Account Value: $"+portfolioText);
   }

   createButtons(x, y) {
      let buttonHeight = y + 196;
      this.buyOne = new Button(
      {
         normal: {
            "ref": "buyOne",
            "x": x - 232,
            "y": buttonHeight,
            "tint": 0xDDDDDD
         },
         hover: {
            "tint": 0xFFFFFF
         },
         press: {
            "tint": 0x999999
         },
         disable: {
            "tint": 0x884488
         },
         onMouseUp: () => {
            this.attemptBuy(1);
         }
      });
      this.buyOne.setDepth(1);

      this.buyTen = new Button(
      {
         normal: {
            "ref": "buyTen",
            "x": x - 168,
            "y": buttonHeight,
            "tint": 0xDDDDDD
         },
         hover: {
            "tint": 0xFFFFFF
         },
         press: {
            "tint": 0x999999
         },
         disable: {
            "tint": 0x884488
         },
         onMouseUp: () => {
            this.attemptBuy(10);
         }
      });
      this.buyTen.setDepth(1);

      this.buyAll = new Button(
      {
         normal: {
            "ref": "buyAll",
            "x": x - 96,
            "y": buttonHeight,
            "tint": 0xDDDDDD
         },
         hover: {
            "tint": 0xFFFFFF
         },
         press: {
            "tint": 0x999999
         },
         disable: {
            "tint": 0x884488
         },
         onMouseUp: () => {
            this.attemptBuy();
         }
      });
      this.buyAll.setDepth(1);

      this.sellOne = new Button(
      {
         normal: {
            "ref": "sellOne",
            "x": x + 85,
            "y": buttonHeight,
            "tint": 0xDDDDDD
         },
         hover: {
            "tint": 0xFFFFFF
         },
         press: {
            "tint": 0x999999
         },
         disable: {
            "tint": 0x558888
         },
         onMouseUp: () => {
            this.attemptSell(1);
         }
      });
      this.sellOne.setDepth(1);

      this.sellTen = new Button(
      {
         normal: {
            "ref": "sellTen",
            "x": x + 152,
            "y": buttonHeight,
            "tint": 0xDDDDDD
         },
         hover: {
            "tint": 0xFFFFFF
         },
         press: {
            "tint": 0x999999
         },
         disable: {
            "tint": 0x558888
         },
         onMouseUp: () => {
            this.attemptSell(10);
         }
      });
      this.sellTen.setDepth(1);

      this.sellAll = new Button(
      {
         normal: {
            "ref": "sellAll",
            "x": x + 226,
            "y": buttonHeight,
            "tint": 0xDDDDDD
         },
         hover: {
            "tint": 0xFFFFFF
         },
         press: {
            "tint": 0x999999
         },
         disable: {
            "tint": 0x558888
         },
         onMouseUp: () => {
            this.attemptSell();
         }
      });
      this.sellAll.setDepth(1);
   }

   attemptBuy(amt = 'all') {
      let moneyAmt = globalObjects.gameStats.getMoney();
      let stockPrice = globalObjects.gameStats.getStockPrice();
      if (amt === 'all') {
         amt = Math.floor((moneyAmt - TRANSACTION_FEE) / stockPrice);
      }
      let purchaseCost = stockPrice * amt + TRANSACTION_FEE;
      if (moneyAmt >= purchaseCost) {
         messageBus.publish("addStocks", amt);
         messageBus.publish("addMoney", -purchaseCost);
         this.updatePortfolioText();
         this.emphasizePortfolioText();
      } else {
         console.log("insufficient funds");
      }
   }

   attemptSell(amt = 'all') {
      let stockAmt = globalObjects.gameStats.getStocks();
      let stockPrice = globalObjects.gameStats.getStockPrice();
      if (amt === 'all') {
         amt = stockAmt;
      }
      if (stockAmt >= amt) {
         let sellMoney = stockPrice * amt;
         messageBus.publish("addStocks", -amt);
         messageBus.publish("addMoney", sellMoney);
         this.updatePortfolioText();
         this.emphasizePortfolioText();
      } else {
         console.log("insufficient stock to sell");
      }
   }

   emphasizePortfolioText() {
      this.portfolioText.scaleY = 1.08;

      PhaserScene.tweens.add({
         targets: this.portfolioText,
         scaleY: 1,
         duration: 150
      });
   }

   updateButtonStateBuy() {
      let moneyAmt = globalObjects.gameStats.getMoney();
      let stockPrice = globalObjects.gameStats.getStockPrice();
      let purchaseCostOne = stockPrice + TRANSACTION_FEE;
      let purchaseCostTen = stockPrice * 10 + TRANSACTION_FEE;
      if (this.buyOne.getState() === DISABLE && moneyAmt >= purchaseCostOne) {
         this.buyOne.setState(NORMAL);
         this.buyAll.setState(NORMAL);
      } else if (this.buyOne.getState() !== DISABLE && moneyAmt < purchaseCostOne) {
         this.buyOne.setState(DISABLE);
         this.buyAll.setState(DISABLE);
      }
      if (this.buyTen.getState() === DISABLE && moneyAmt >= purchaseCostTen) {
         this.buyTen.setState(NORMAL);
      } else if (this.buyTen.getState() !== DISABLE && moneyAmt < purchaseCostTen) {
         this.buyTen.setState(DISABLE);
      }

   }

   updateButtonStateSell() {
      let stockAmt = globalObjects.gameStats.getStocks();
      if (this.sellOne.getState() === DISABLE && stockAmt >= 1) {
         this.sellOne.setState(NORMAL);
         this.sellAll.setState(NORMAL);
      } else if (this.sellOne.getState() !== DISABLE && stockAmt < 1) {
         this.sellOne.setState(DISABLE);
         this.sellAll.setState(DISABLE);
      }
      if (this.sellTen.getState() === DISABLE && stockAmt >= 10) {
         this.sellTen.setState(NORMAL);
      } else if (this.sellTen.getState() !== DISABLE && stockAmt < 10) {
         this.sellTen.setState(DISABLE);
      }
   }
}