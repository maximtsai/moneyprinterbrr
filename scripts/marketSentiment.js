
class MarketSentiment {
    constructor(initData) {
        // all values go from -inf to inf, default at 0
        this.counterShort = 0;
        this.counterMid = 0;
        this.counterLong = 0;
        this.counterVeryLong = 0;

        this.shortTermSine = 0;
        this.midTermSine = 0;
        this.longTermSine = 0;
        this.veryLongTermSine = 0;

        this.shortTermSentiment = 0;
        this.midTermSentiment = 0;
        this.longTermSentiment = 0;
        this.veryLongTermSentiment = -10;
        // volatility is caused by large shifts in sentment, 
    }

    updateTick() {
        this.counterShort += 0.2;
        this.counterMid += 0.04;
        this.counterLong += 0.008;
        this.counterVeryLong += 0.0016;

        this.shortTermSine = Math.sin(this.counterShort) - 0.5;
        this.midTermSine = Math.sin(this.counterMid) - 0.5;
        this.longTermSine = Math.sin(this.counterLong) - 0.5;
        this.veryLongTermSine = Math.sin(this.counterVeryLong) - 0.5;
        // this.shortTermSentiment = 
        this.shortTermSentiment += this.shortTermSine; 
        this.midTermSentiment += this.midTermSine; 
        this.longTermSentiment += this.longTermSine; 
        this.veryLongTermSentiment += this.veryLongTermSine; 


        this.midTermSentiment += this.shortTermSentiment * 0.01;
        this.longTermSentiment += this.midTermSentiment * 0.01;
        this.veryLongTermSentiment += this.longTermSentiment * 0.01; 




        this.shortTermSentiment *= 0.999;
        this.midTermSentiment *= 0.999;
        this.longTermSentiment *= 0.999;
        this.veryLongTermSentiment *= 0.999;

        console.log(this.shortTermSentiment, this.midTermSentiment, this.longTermSentiment, this.veryLongTermSentiment);
    }
}