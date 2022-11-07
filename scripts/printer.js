/**
 * This file contains the code for the 
 * 
 **/
const PRINTER_CHECKPOINT_1 = 0.785;
const PRINTER_CHECKPOINT_2 = 2.356;
const PRINTER_CHECKPOINT_3 = -0.785;
const PRINTER_CHECKPOINT_4 = -2.356;
const PRINTER_SPINNER_LENGTH = 107;
const PRINTER_MAX_ACCEL = 0.0005;
 
 class Printer {
    constructor(x, y, rotSpeedCap = 1, depth = 10) {
        this.bg = PhaserScene.add.image(x, y, 'printerBase');
        this.bg.setDepth(depth);

        this.spinnerCircle = PhaserScene.add.image(x, y, 'spinnerCircle');
        this.spinnerCircle.setDepth(depth);

        this.fire1 = PhaserScene.add.image(x, y, 'fire1');
        this.fire1.setDepth(depth);
        this.fire1.visible = false;
        this.fire1.setScale(0.5);

        this.fire2 = PhaserScene.add.image(x, y, 'fire2');
        this.fire2.setDepth(depth);
        this.fire2.visible = false;
        this.fire2.setScale(0.5);

        this.guideArrow = PhaserScene.add.image(0, -9999, 'arrow');
        this.guideArrow.setOrigin(0.01, 0.5);
        this.guideArrow.setDepth(depth);

        this.spinnerGlow = PhaserScene.add.image(x, y, 'spinnerGlow');
        this.spinnerGlow.setDepth(depth);
        this.spinner = PhaserScene.add.image(x, y, 'spinner');
        this.spinner.setDepth(depth);
        this.spinnerDisabled = PhaserScene.add.image(x, y, 'spinnerDisabled');
        this.spinnerDisabled.setDepth(depth);
        this.spinnerDisabled.visible = false;


        this.billArray = [];
        this.freeCashSignArray = [];

        this.x = x;
        this.y = y;
        this.depth = depth;

        this.spinnerVel = 0;
        this.spinnerMaxVel = 0.07;
        this.maxBrrr = false;

        this.handle = new Button(
        {
            normal: {
                ref: "whitePixel",
                scaleX: 55,
                scaleY: 55,
                alpha: 0,
                x: this.spinner.x + PRINTER_SPINNER_LENGTH * Math.cos(this.spinner.rotation),
                y: this.spinner.y + PRINTER_SPINNER_LENGTH * Math.sin(this.spinner.rotation)
            },
            onMouseUp: this.resetHandle.bind(this),
            isDraggable: true
        });

        this.lastPointGotMoney = null;

        messageBus.subscribe("activateMaxBrrr", this.startFire.bind(this));
        messageBus.subscribe("activateMaxBrrrPhase2", this.startFire2.bind(this));
        messageBus.subscribe("endMaxBrrr", this.stopFire.bind(this));
    }

    update(deltaScale) {
        if (this.handle.getIsInteracted()) {
            this.spinner.visible = false;
        } else if (!gameVars.printerIsBroken) {
            this.spinner.visible = true;
        }
        let shouldUpdateGuideArrow = false;
        if (gameVars.maxBrrr) {
            if (gameVars.maxBrrrPhase2) {
                this.spinnerVel = 0.44;
            } else {
                this.spinnerVel = 0.25;
            }
        }
        if (this.handle.getIsDragged() && !gameVars.printerIsBroken) {
            let handleDragX = this.handle.getXPos();
            let handleDragY = this.handle.getYPos();
            let spinnerX = this.spinner.x + PRINTER_SPINNER_LENGTH * Math.cos(this.spinner.rotation);
            let spinnerY = this.spinner.y + PRINTER_SPINNER_LENGTH * Math.sin(this.spinner.rotation);

            let distX = handleDragX - spinnerX;
            let distY = handleDragY - spinnerY;
            let distTotal = Math.max(0, Math.sqrt(distX*distX + distY*distY) - 2); // a basic cutoff of 2
            let forceAngle = Math.atan2(distY, distX);

            let angleDiff = forceAngle - this.spinner.rotation;
            if (angleDiff > Math.PI) {
                angleDiff -= Math.PI * 2;
            } else if (angleDiff < -Math.PI) {
                angleDiff += Math.PI * 2;
            }
            let torque = Math.sin(angleDiff) * distTotal;

            let goalAngle = Math.atan2(distY, distX);
            if (goalAngle > Math.PI) {
                goalAngle -= Math.PI * 2;
            }

            let acceleration = 0;
            if (torque > 0.01) {
                acceleration = Math.min(PRINTER_MAX_ACCEL + torque * 0.000001, torque * 0.000005);
            } else if (torque < -0.01) {
                acceleration = Math.max(-PRINTER_MAX_ACCEL + torque * 0.000001, torque * 0.000005);
            }

            this.spinnerVel += acceleration * deltaScale;

            shouldUpdateGuideArrow = true;
            // this.guideArrow.rotation = rotation;
            this.guideArrow.scaleX = Math.min(0.75, distTotal / 150);
            this.guideArrow.scaleY = Math.min(0.75, distTotal / 150);
            this.guideArrow.rotation = forceAngle;
            this.guideArrow.visible = true;
        } else {
            this.resetHandle();
            this.guideArrow.visible = false;
        }
        let oldRotation = this.spinner.rotation;
        this.spinnerCircle.rotation = oldRotation;
        this.spinner.rotation += this.spinnerVel * deltaScale;
        this.spinnerGlow.rotation = this.spinner.rotation;

        if (shouldUpdateGuideArrow) {
            this.guideArrow.x = this.spinner.x + PRINTER_SPINNER_LENGTH * Math.cos(this.spinner.rotation + this.spinnerVel);
            this.guideArrow.y = this.spinner.y + PRINTER_SPINNER_LENGTH * Math.sin(this.spinner.rotation + this.spinnerVel);
        }
        if (Math.abs(this.spinnerVel) > this.spinnerMaxVel && !gameVars.maxBrrr) {
            this.spinnerVel *= Math.abs(this.spinnerMaxVel / this.spinnerVel);
        }
        if (this.spinnerVel > 0) {
            this.spinnerVel = Math.max(0, this.spinnerVel * (1 - (0.00006 * deltaScale)) - 0.0002 * deltaScale);
        } else {
            this.spinnerVel = Math.min(0, this.spinnerVel * (1 - (0.00006 * deltaScale)) + 0.0002 * deltaScale);
        }

        this.handleCheckpoints(oldRotation, this.spinner.rotation);

    }

    resetHandle() {
        let xPos = this.spinner.x + PRINTER_SPINNER_LENGTH * Math.cos(this.spinner.rotation);
        let yPos = this.spinner.y + PRINTER_SPINNER_LENGTH * Math.sin(this.spinner.rotation);
        this.handle.setPos(xPos, yPos);
    }

    upgradePrinter(type) {
        if (type === 1) {

        } else if (type === 2) {

        } else if (type === 3) {

        }
    }

    handleCheckpoints(oldRot, newRot) {
        if (oldRot - newRot > Math.PI) {
            oldRot -= Math.PI * 2;
        } else if (oldRot - newRot < -Math.PI) {
            oldRot += Math.PI * 2;
        }
        let spinScale = Math.min(1, globalObjects.printer.spinnerVel / 0.075);

        if (this.lastCheckpointHit !== PRINTER_CHECKPOINT_1 && (PRINTER_CHECKPOINT_1 - oldRot) * (PRINTER_CHECKPOINT_1 - newRot) < 0) {
            this.lastCheckpointHit = PRINTER_CHECKPOINT_1;
            this.checkpointHit(130, 130);
            if (tempSentiment > 0.85) {
                zoomTemp(1 + tempSentiment * 0.006);
            }
        } else if (this.lastCheckpointHit !== PRINTER_CHECKPOINT_2 && (PRINTER_CHECKPOINT_2 - oldRot) * (PRINTER_CHECKPOINT_2 - newRot) < 0) {
            this.lastCheckpointHit = PRINTER_CHECKPOINT_2;
            this.checkpointHit(-130, 130);
        } else if (this.lastCheckpointHit !== PRINTER_CHECKPOINT_3 && (PRINTER_CHECKPOINT_3 - oldRot) * (PRINTER_CHECKPOINT_3 - newRot) < 0) {
            this.lastCheckpointHit = PRINTER_CHECKPOINT_3;
            this.checkpointHit(130, -130);
        } else if (this.lastCheckpointHit !== PRINTER_CHECKPOINT_4 && (PRINTER_CHECKPOINT_4 - oldRot) * (PRINTER_CHECKPOINT_4 - newRot) < 0) {
            this.lastCheckpointHit = PRINTER_CHECKPOINT_4;
            this.checkpointHit(-130, -130);
            if (tempSentiment > 0.85) {
                zoomTemp(1 + tempSentiment * 0.006);
            }
        }
    }

    checkpointHit(offsetX, offsetY) {
        this.createCashSign(this.x + offsetX, this.y + offsetY);
        let brrrMultiplier = 1;
        if (gameVars.maxBrrrPhase2) {
            brrrMultiplier = 1.75;
        } else if (gameVars.maxBrrr) {
            brrrMultiplier = 1.3;
        }
        if (this.spinnerVel > 0) {
            messageBus.publish('createCash', this.x - 90, this.y + 170, -8 - Math.random() * 8 * brrrMultiplier, - 5 -Math.random() * 5 * brrrMultiplier, Math.random() * 0.1 * brrrMultiplier);
        } else {
            messageBus.publish('createCash', this.x - 100, this.y - 170, -8 - Math.random() * 8 * brrrMultiplier, -Math.random() * 5 * brrrMultiplier, Math.random() * 0.1 * brrrMultiplier);
        }
        messageBus.publish("addMoney");
    }

    createCashSign(x, y) {
        let cashSign = null;
        if (this.freeCashSignArray.length > 0) {
            cashSign = this.freeCashSignArray.pop();
        } else {
            cashSign = PhaserScene.add.image(x, y, 'cashsign');
            cashSign.setDepth(this.depth);
        }
        cashSign.x = x; cashSign.y = y;
        cashSign.alpha = 1;
        
        PhaserScene.tweens.timeline({
            targets: [cashSign],
            tweens: [
                {
                    alpha: 0,
                    y: "-=25",
                    duration: 1000,
                    ease: 'Quad.easeOut',
                    onComplete: () => {
                        this.freeCashSignArray.push(cashSign);
                    }
                }
            ]
        });

    }

    startFire() {
        this.fire1.visible = true;
        this.fire1.scaleX = 0.5; this.fire1.scaleY = 0.5; this.fire1.alpha = 0.5;
        PhaserScene.tweens.timeline({
            targets: [this.fire1],
            tweens: [
                {
                    alpha: 1,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 5000,
                    ease: 'Quad.easeIn',
                    delay: 500
                }
            ]
        });
    }

    startFire2() {
        this.fire2.visible = true;
        this.fire2.scaleX = 0.5; this.fire2.scaleY = 0.5; this.fire2.alpha = 0.5;
        PhaserScene.tweens.timeline({
            targets: [this.fire2],
            tweens: [
                {
                    alpha: 1,
                    scaleX: 3,
                    scaleY: 3,
                    duration: 6000,
                    ease: 'Cubic.easeIn'
                }
            ]
        });
    }

    stopFire() {
        this.fire1.scaleX = 15; this.fire1.scaleY = 15;
        this.fire1.alpha = 1;
        PhaserScene.tweens.timeline({
            targets: [this.fire1],
            tweens: [
                {
                    alpha: 0,
                    duration: 1500,
                    ease: 'Quad.easeOut'
                }
            ]
        });
        this.fire2.visible = false;

        this.spinnerGlow.visible = false;
        this.spinner.visible = false;
        this.spinnerDisabled.visible = true;
        this.spinnerDisabled.rotation = this.spinnerGlow.rotation;
        this.spinnerVel = 0;
        gameVars.printerIsBroken = true;
    }
}