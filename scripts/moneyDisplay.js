class MoneyDisplay {
    constructor(x, y) {
        let font = {fontFamily: 'Arial', fontSize: 20, color: '#ffffff', align: 'left'};
        this.cashText = PhaserScene.add.text(x, y, 'CASH: $XX', font);
        messageBus.subscribe("updateMoneyDisplay", this.updateDisplay.bind(this));
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
}