/**
 * This file contains the code for the buttons menu in the bottom left of the game
 * 
 **/
 
 class ButtonsPanel {
    constructor(x, y) {
        this.bg = PhaserScene.add.image(x, y, 'buttonsPanelBase');


        this.initButtons(x, y);

        messageBus.subscribe("addUpgradeButton", this.handleAddButton.bind(this));
        messageBus.subscribe("addMoney", this.refreshButtonBuys.bind(this));

    }

    handleAddButton(buttonText = '', buttonCost = 1, buttonFunc) {
        console.log(buttonText, buttonCost);
        // Do stuff
        let nextFreeButton;
        for (let i = 0; i < this.listOfButtons.length; i++) {
            nextFreeButton = this.listOfButtons[i];
            if (nextFreeButton.isAvailable) {
                break;
            }
        }
        nextFreeButton.isAvailable = false;
        // this.enableButton(nextFreeButton);
        nextFreeButton.descText.setText(buttonText);
        nextFreeButton.priceText.setText('$' + buttonCost.toString());
        this.disableButton(nextFreeButton);
        nextFreeButton.price = buttonCost;
        nextFreeButton.setOnMouseUpFunc(() => {
            buttonFunc();
            messageBus.publish("addMoney", -buttonCost);
            this.hideButton(nextFreeButton);
        });
    }

    initButtons(xStart, yStart) {
        this.listOfButtons = [];
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 2; x++) {
                let xPos = xStart + x * 262 - 131;
                let yPos = yStart + y * 39 - 58;

                let newButton = new Button(
                {
                    normal: {
                        "ref": "upgradeBtn",
                        "x": xPos,
                        "y": yPos,
                        "tint": 0xDDDDDD
                    },
                    hover: {
                        "tint": 0xFFFFFF
                    },
                    press: {
                        "tint": 0x999999
                    },
                    disable: {
                        "tint": 0xFFFFFF
                    },
                    onMouseUp: () => {
                    }
                });
                let descText = PhaserScene.add.text(xPos - 118, yPos - 1, " ", {fontStyle: 'bold', fontFamily: 'Arial', fontSize: 16, color: '#000000', align: 'left'});
                descText.setOrigin(0, 0.5);
                descText.setDepth(1);
                let priceText = PhaserScene.add.text(xPos + 118, yPos - 1, " ", {fontStyle: 'bold', fontFamily: 'Arial', fontSize: 16, color: '#000000', align: 'right'});
                priceText.setOrigin(1, 0.5);
                priceText.setDepth(1);

                newButton.descText = descText;
                newButton.priceText = priceText;
                newButton.price = -1;
                newButton.isAvailable = true;
                this.disableButton(newButton);

                this.listOfButtons.push(newButton);
           }
        }
    }

    enableButton(button) {
        button.setState(NORMAL);
        button.descText.alpha = 1;
        button.priceText.alpha = 1;
    }

    disableButton(button) {
        button.setState(DISABLE);
        button.descText.alpha = 0.5;
        button.priceText.alpha = 0.5;
    }


    hideButton(button) {
        button.setState(DISABLE);
        button.descText.setText(' ');
        button.priceText.setText(' ');
        button.price = -1;
        button.setOnMouseUpFunc(() => {

        });
        button.isAvailable = true;
    }

    refreshButtonBuys() {
        let moneyAmt = globalObjects.gameStats.getMoney();
        for (let i = 0; i < this.listOfButtons.length; i++) {
            let currButton = this.listOfButtons[i];
            if (currButton.price !== -1 && moneyAmt > currButton.price) {
                this.enableButton(currButton);
            }
        }
    }

}