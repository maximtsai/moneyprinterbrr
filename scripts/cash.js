const CASH_GRAVITY = 0.1;
const CASH_BOUNDS = 100;
const CASH_DECAY = 0.018;

class CashManager {
    constructor() {
        messageBus.subscribe("createCash", this.createCash.bind(this));
    }

    createCash(x = 200, y = 200, velX = -10, velY = -1, rotSpd = 0) {
        let newCash;
        if (Cash.inactiveCash.length > 0) {
            newCash = Cash.inactiveCash.pop();
            newCash.initialize(x, y, velX, velY, rotSpd);
        } else {
            newCash = new Cash(x, y, velX, velY, rotSpd);
        }
    }

    update(deltaScale) {
        for (let i = 0; i < Cash.activeCash.length; i++) {
            Cash.activeCash[i].update(deltaScale);
        }
    }

}

class Cash {
    constructor(x, y, velX, velY, rotSpd) {
        this.initialize(x, y, velX, velY, rotSpd);
        this.activeVisual = PhaserScene.add.image(this.x, this.y, 'dollar1');
        this.activeVisual.setDepth(5);
    }

    initialize(x, y, velX, velY) {
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.velX = velX;
        this.velY = velY;
        this.state = 0;
        this.rotSpd = 0;
        Cash.activeCash.push(this);
    }

    update(deltaScale) {
        this.x += this.velX * deltaScale;
        this.y += this.velY * deltaScale;
        this.rotation += this.rotSpd;

        let decayAmt = 1 - CASH_DECAY * deltaScale;
        this.velX *= decayAmt;
        this.velY *= decayAmt;
        this.rotSpd *= decayAmt;
        this.velY += CASH_GRAVITY * decayAmt * deltaScale;
        this.rotSpd += (Math.random() - 0.5) * 0.01;


        this.updateVisual();
        this.checkActive();
    }

    updateVisual() {
        this.activeVisual.x = this.x;
        this.activeVisual.y = this.y;
        this.activeVisual.rotation = this.rotation;
    }

    /**
     * if cash out of bounds, then remove from activeCash and place into inactiveCash
     **/
    checkActive() {
        if (this.x < -CASH_BOUNDS || this.y > gameConsts.height + CASH_BOUNDS) {
            for (let i = 0; i < Cash.activeCash.length; i++) {
                if (Cash.activeCash[i] === this) {
                    Cash.activeCash.splice(i, 1);
                    Cash.inactiveCash.push(this);
                    return;
                }
            }
        }
    }
}

Cash.inactiveCash = [];
Cash.activeCash = [];