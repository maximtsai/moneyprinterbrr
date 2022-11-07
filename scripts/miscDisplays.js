class MiscDisplays {
    constructor(x, y) {
        let font = {fontFamily: 'Arial', fontSize: 20, color: '#ffffff', align: 'left'};
        this.cashText = PhaserScene.add.text(x, y, 'CASH: $XX', font);
        messageBus.subscribe("updateCashDisplay", this.updateDisplay.bind(this));
        messageBus.subscribe("showCashChange", this.showCashChange.bind(this));
        this.listOfFreeText = [];
    }

    updateDisplay(newText) {
        newText = newText.toString();
        let dotPos = newText.indexOf('.');
        if (dotPos === -1) {
            newText += '.00';
        } else if (dotPos === newText.length - 2) {
            newText += '0';
        } else if (dotPos < newText.length - 3) {
            newText = newText.substring(0, dotPos + 3);
        }
        this.cashText.setText('CASH: $' + newText);
    }

    showCashChange(changeAmt) {
        let textObj = this.getFreeText();
        let absChangeAmt = Math.abs(changeAmt);
        textObj.x = this.cashText.x + (Math.random() - 0.5) * 30 + 90;
        textObj.y = this.cashText.y + (Math.random() - 0.5) * 10 - 10;
        let displayStr;
        if (changeAmt >= 0) {
            displayStr = '$' + changeAmt.toString();
            textObj.setTint(0x00bb00);
        } else if (changeAmt < 0) {
            displayStr = '-$' + Math.abs(changeAmt).toString();
            textObj.setTint(0xdd0000);
        }
        if (absChangeAmt >= 10) {
            let dotPos = displayStr.indexOf('.');
            if (dotPos === -1) {
                displayStr += '.00';
            } else if (dotPos === displayStr.length - 2) {
                displayStr += '0';
            } else if (dotPos < displayStr.length - 3) {
                displayStr = displayStr.substring(0, dotPos + 3);
            }
        }
        textObj.scaleX = 0.6; textObj.scaleY = 0.6;
        let goalScale = 0.6;
        let duration = 1300;
        let elevateAmt = "-=40";
        textObj.setDepth(2);
        if (absChangeAmt >= 10000) {
            textObj.setDepth(4);
            duration = 1500;
            goalScale = 1;
        } else if (absChangeAmt >= 1000) {
            elevateAmt = "-=35";
            textObj.setDepth(3);
            duration = 1400;
            goalScale = 0.9;
        } else if (absChangeAmt >= 100) {
            elevateAmt = "-=30";
            goalScale = 0.8;
        } else if (absChangeAmt >= 10) {
            elevateAmt = "-=20";
            duration = 1100;
            goalScale = 0.7;
        } else {
            duration = 900;
            textObj.setDepth(1);
            elevateAmt = "-=15";
        }
        textObj.alpha = 1;
        textObj.setText(displayStr);
        PhaserScene.tweens.add({
            targets: textObj,
            y: elevateAmt,
            ease: 'Cubic.easeOut',
            duration: duration
        });
        if (absChangeAmt >= 10) {
            PhaserScene.tweens.add({
                targets: textObj,
                scaleX: goalScale,
                scaleY: goalScale,
                ease: 'Back.easeOut',
                duration: duration - 100
            });
        } 
        PhaserScene.tweens.add({
            targets: textObj,
            alpha: 0,
            ease: 'Cubic.easeIn',
            duration: duration + 50,
            onComplete: () => {
                this.listOfFreeText.push(textObj);
            }
        });
    }

    getFreeText() {
        if (this.listOfFreeText.length > 0) {
            return this.listOfFreeText.pop();
        } else {
            let font = {fontStyle: 'bold', fontFamily: 'Arial', fontSize: 32, color: '#ffffff', align: 'center'};
            let newText = PhaserScene.add.text(-999, 0, '$$$', font);
            newText.setOrigin(0.5, 0.5);
            newText.setDepth(1);
            return newText;
        }
    }
}