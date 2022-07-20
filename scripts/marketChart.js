/**
 * 
 **/
const MAX_MARKET_HISTORY = 100;
const HOURS_PER_DAY = 6;
const DAYS_PER_WEEK = 5;
const LONG_TERM_GROWTH = 1.0001;
const MARKET_HOUR = "hour";
const MARKET_DAY = "day";
const MARKET_WEEK = "week";
const MARKET_MAX_DISPLAY = 38;
const DISPLAY_HEIGHT = 320;
const DISPLAY_Y_OFFSET = 19;
const UPDATE_INTERVAL = 120; // frames

 class MarketChart {
    constructor(x, y, depth = 1) {
        this.x = x;
        this.y = y;
        this.accumulatedTime = 0;
        this.displayTime = MARKET_HOUR;
        this.initMarketData();
        this.initDisplay(x, y, depth);
        this.displayMarket();
        // This line listens to messageBus.publish('bloombergNews', ...); then runs updateBloomberg()
        // messageBus.subscribe('bloombergNews', this.updateBloomberg.bind(this));
    }

    initMarketData() {
        this.trueMarketVal = 14;
        // Each unit of S&P starts at an accessible 14-20
        let startVal = 14 + Math.random() * 6;
        this.marketHistory = [startVal];
        // TODO figure out minimum number of needed vals
        for (let i = 1; i < MAX_MARKET_HISTORY; i++) {
            let prevVal = this.marketHistory[i - 1];
            this.trueMarketVal *= LONG_TERM_GROWTH;
            let newVal = (prevVal + (Math.random() - 0.5) * prevVal * 0.05) * 0.9 + this.trueMarketVal * 0.1;
            this.marketHistory.push(newVal);
        }
        messageBus.publish("setMarketHistory", this.marketHistory);
    }

    initDisplay(x, y, depth) {
        this.displayedBars = [];
        this.displayedLines = [];
        for (let i = 0; i < MARKET_MAX_DISPLAY; i++) {
            let xOffset = x - 272 + i * 13;
            let newBar = PhaserScene.add.image(xOffset, y, 'whitePixel');
            newBar.setOrigin(0.5, 0);
            newBar.scaleX = 5;
            newBar.scaleY = 5;
            newBar.setDepth(depth + 1)
            newBar.setTint(0xFF0000);
            this.displayedBars.push(newBar);
        }
        this.displayedBars[0].alpha = 0;

        this.priceText = PhaserScene.add.text(x - 260, y - 165, "INDEX 9000: XX", {fontFamily: 'Arial', fontSize: 20, color: '#000000', align: 'left'});
        this.priceText.setDepth(depth + 1);
    }

    setPriceText(newNum) {
        let stringVer = newNum.toString();
        let decPlace = stringVer.indexOf('.');

        if (decPlace === -1) {
            stringVer += '.00';
        } else if (decPlace === stringVer.length - 2) {
            stringVer += '0';
        } else if (decPlace < stringVer.length - 3) {
            stringVer = stringVer.substring(0, decPlace + 3);
        }
        this.priceText.setText("INDEX 9000: " + stringVer);
    }

    displayMarket() {
        let x = this.x;
        let y = this.y;
        let maxVal = 0;
        let minVal = 99999999;
        let maxValDisplay = 0;
        let minValDisplay = 99999999;
        switch(this.displayTime) {
            case MARKET_HOUR:
                // 
                for (let i = MAX_MARKET_HISTORY - (MARKET_MAX_DISPLAY + 15); i < MAX_MARKET_HISTORY; i++) {
                    let dataVal = this.marketHistory[i];
                    maxVal = Math.max(dataVal, maxVal);
                    minVal = Math.min(dataVal, minVal);
                    if (i > MAX_MARKET_HISTORY - MARKET_MAX_DISPLAY) {
                        maxValDisplay = Math.max(dataVal, maxValDisplay);
                        minValDisplay = Math.min(dataVal, minValDisplay);
                    }
                }
                let range = maxVal - minVal;
                let displayRange = maxValDisplay - minValDisplay;
                let rangeMax = maxVal + range * 0.1;
                let rangeMin = minVal - range * 0.05;
                for (let i = 1; i < MARKET_MAX_DISPLAY; i++) {
                    let prevDataVal = this.marketHistory[MAX_MARKET_HISTORY - MARKET_MAX_DISPLAY + i - 1];
                    let dataVal = this.marketHistory[MAX_MARKET_HISTORY - MARKET_MAX_DISPLAY + i];
                    let currBar = this.displayedBars[i];
                    let startPos = this.convertDataPointToHeight(rangeMin, rangeMax, prevDataVal);
                    let endPos = this.convertDataPointToHeight(rangeMin, rangeMax, dataVal);
                    currBar.y = startPos;
                    let goalScaleY = (endPos - startPos)*0.5;
                    if (Math.abs(goalScaleY) < 2) {
                        if (goalScaleY < 0) {
                            goalScaleY = -2;
                        } else {
                            goalScaleY = 2;
                        }
                    }
                    currBar.scaleY = goalScaleY;
                    if (i === MARKET_MAX_DISPLAY - 1) {
                        currBar.scaleY *= 0.1;
                        PhaserScene.tweens.add({
                            targets: currBar,
                            scaleY: goalScaleY,
                            ease: "Cubic.easeOut",
                            duration: 500,
                            delay: 120
                        });
                    }

                    if (currBar.scaleY < 0) {
                        currBar.setTint(0x00FF00);
                    } else {
                        currBar.setTint(0xFF0000);
                    }
                }


            break;
        }

        this.setPriceText(this.marketHistory[MAX_MARKET_HISTORY - 1]);
    }

    convertDataPointToHeight(rangeMin, rangeMax, dataVal) {
        let percentageDown = 1 - ((rangeMax - dataVal) / (rangeMax - rangeMin));
        return this.y + DISPLAY_HEIGHT * 0.5 - DISPLAY_HEIGHT * percentageDown + DISPLAY_Y_OFFSET;
    }

    generateNewMarketData(updateDisplay = true) {
        let prevVal = this.marketHistory[this.marketHistory.length - 1];
        this.trueMarketVal *= LONG_TERM_GROWTH;
        let newVal = ((prevVal + (Math.random() - 0.5) * prevVal * 0.05) * 0.9 + this.trueMarketVal * 0.1) * (1 + tempSentiment * 0.05);
        this.marketHistory.push(newVal);
        this.marketHistory.shift();
        if (updateDisplay) {
            this.displayMarket();
        }
        messageBus.publish("setMarketHistory", this.marketHistory);
    }

    update(deltaScale = 0) {
        this.accumulatedTime += deltaScale;
        if (this.accumulatedTime > UPDATE_INTERVAL) {
            this.accumulatedTime = UPDATE_INTERVAL - this.accumulatedTime;
            this.generateNewMarketData();
        }
    }
}