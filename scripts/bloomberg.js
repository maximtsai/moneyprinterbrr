/**
 * This file contains the code for the bloomberg terminal located in the top right of the game.
 * This is a screen that contains 5 lines of text. Each line of text refers to world news.
 * The newest news appears at the bottom and bumps older news upwards.
 * 
 **/
 const MAX_BLOOMBERG_LINES = 5;
 
 class Bloomberg {
    constructor(x, y) {
        this.bg = PhaserScene.add.image(x, y, 'bloombergBase');
        this.createTextLines(x, y);

        // This line listens to messageBus.publish('bloombergNews', ...); then runs updateBloomberg()
        messageBus.subscribe('bloombergNews', this.updateBloomberg.bind(this));
    }

    createTextLines(x, y) {
        let lineOffsetX = -225;
        let lineOffsetY = -62;
        this.textLines = [];
        let lineFont = {fontFamily: 'Times New Roman', fontSize: 16, color: '#ff2200', align: 'left'};
        for (let i = 0; i < MAX_BLOOMBERG_LINES; i++) {
            let newText = PhaserScene.add.text(x + lineOffsetX, y + lineOffsetY + i * 20 + 13, "Test line " + i, lineFont);
            newText.setOrigin(0, 0);
            this.textLines.push(newText);
        }
    }

    updateBloomberg(newText) {
        // TODO: Make this work right
        // this.textLines[0].text = newText;
        if(newText.length > 70){
            newText = newText.slice(0,71);
            newText = newText.concat("...");
        }

        for(let i = 0; i < MAX_BLOOMBERG_LINES; ++i){
            if(this.textLines[i] == null){
                this.textLines[i].text = newText;
                break;
            }
            if(i == 4){
                for(let j = 0; j < MAX_BLOOMBERG_LINES - 1; ++j){
                    this.textLines[j].text = this.textLines[j + 1].text;
                }
                this.textLines[4].text = newText;
            }
        }
    }
}