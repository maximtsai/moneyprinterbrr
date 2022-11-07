 class MaxBrrrButton {
    constructor(x, y, depth = 9999) {
        this.origY = y;
        this.button = new Button(
        {
            normal: {
                "ref": "maxBrrrNormal",
                "x": x,
                "y": y
            },
            hover: {
                "ref": "maxBrrrHover",
            },
            press: {
                "ref": "maxBrrrPress",
            },
            disable: {
            },
            onMouseUp: () => {
                this.activate();
            }
        });
        this.button.setDepth(depth);
        // This line listens to messageBus.publish('bloombergNews', ...); then runs updateBloomberg()
        messageBus.subscribe('showBrrrButton', this.show.bind(this));
    }

    show() {
        gameVars.showingMaxBrrr = true;
        this.button.tweenToPos(this.button.getPosX(), this.button.getPosY() - 220, 1500, 'Cubic.easeInOut');
        messageBus.publish('tweenTotalLight', 0.5, 1500);
        tweenVolume('bgm1Main', 0.15, 1500);
    }

    activate() {
        zoomTemp(1.03);
        gameVars.showingMaxBrrr = false;
        this.button.tweenToPos(this.button.getPosX(), this.origY, 250, 'Quad.easeIn');
        messageBus.publish('tweenTotalLight', 0, 300);
        messageBus.publish('activateMaxBrrr');
        gameVars.maxBrrr = true;
        setTimeout(() => {
            zoomTemp(1.1);
            gameVars.maxBrrrPhase2 = true;
            messageBus.publish('activateMaxBrrrPhase2');
        }, 6400);
        setTimeout(() => {
            gameVars.maxBrrr = false;
            gameVars.maxBrrrPhase2 = false;
            messageBus.publish('endMaxBrrr');
        }, 12500);
        playSound('bgm1Fast');
    }
}