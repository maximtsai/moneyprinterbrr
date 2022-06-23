/**
 * This file contains the code for the 
 * 
 **/
const PRINTER_CHECKPOINT_1 = 0.785;
const PRINTER_CHECKPOINT_2 = 2.356;
const PRINTER_CHECKPOINT_3 = -0.785;
const PRINTER_CHECKPOINT_4 = -2.356;
 
 class Printer {
    constructor(x, y, rotSpeedCap = 1, depth = 10) {
        this.bg = PhaserScene.add.image(x, y, 'printerBase');
        this.bg.setDepth(depth);
        this.guideArrow = PhaserScene.add.image(0, -9999, 'arrow');
        this.guideArrow.setOrigin(0.01, 0.5);
        this.guideArrow.setDepth(depth);

        this.spinnerGlow = PhaserScene.add.image(x, y, 'spinnerGlow');
        this.spinnerGlow.setDepth(depth);
        this.spinner = PhaserScene.add.image(x, y, 'spinner');
        this.spinner.setDepth(depth);

        this.billArray = [];
        this.freeCashSignArray = [];

        this.x = x;
        this.y = y;
        this.depth = depth;

        this.spinnerVel = 0;
        this.spinnerMaxVel = 0.08;

        this.spinnerLength = 190;
        this.handle = new Button(
        {
            normal: {
                ref: "whitePixel",
                scaleX: 65,
                scaleY: 65,
                alpha: 0.001,
                x: this.spinner.x + this.spinnerLength * Math.cos(this.spinner.rotation),
                y: this.spinner.y + this.spinnerLength * Math.sin(this.spinner.rotation)
            },
            onMouseUp: this.resetHandle.bind(this),
            isDraggable: true
        });

        this.lastPointGotMoney = null;

    }

    update(deltaScale) {
        if (this.handle.getIsInteracted()) {
            this.spinner.visible = false;
        } else {
            this.spinner.visible = true;
        }
        if (this.handle.getIsDragged()) {
            let handleDragX = this.handle.getXPos();
            let handleDragY = this.handle.getYPos();
            let spinnerX = this.spinner.x + this.spinnerLength * Math.cos(this.spinner.rotation);
            let spinnerY = this.spinner.y + this.spinnerLength * Math.sin(this.spinner.rotation);

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
                acceleration = Math.min(0.001, torque * 0.000025);
            } else if (torque < -0.01) {
                acceleration = Math.max(-0.001, torque * 0.000025);
            }

            console.log(deltaScale);
            this.spinnerVel += acceleration * deltaScale;

            this.guideArrow.x = this.spinner.x + (this.spinnerLength + 9) * Math.cos(this.spinner.rotation + this.spinnerVel);
            this.guideArrow.y = this.spinner.y + (this.spinnerLength + 9) * Math.sin(this.spinner.rotation + this.spinnerVel);

            // this.guideArrow.rotation = rotation;
            this.guideArrow.scaleX = Math.min(0.8, distTotal / 200);
            this.guideArrow.scaleY = Math.min(0.8, distTotal / 200);
            this.guideArrow.rotation = forceAngle;
            this.guideArrow.visible = true;
        } else {
            this.resetHandle();
            this.guideArrow.visible = false;
        }
        let oldRotation = this.spinner.rotation;
        this.spinner.rotation += this.spinnerVel * deltaScale;
        this.spinnerGlow.rotation = this.spinner.rotation;
        if (Math.abs(this.spinnerVel) > this.spinnerMaxVel) {
            this.spinnerVel *= Math.abs(this.spinnerMaxVel / this.spinnerVel);
        }
        if (this.spinnerVel > 0) {
            this.spinnerVel = Math.max(0, this.spinnerVel * 0.9999 - 0.0005 * deltaScale);
        } else {
            this.spinnerVel = Math.min(0, this.spinnerVel * 0.9999 + 0.0005 * deltaScale);
        }

        this.handleCheckpoints(oldRotation, this.spinner.rotation);

    }

    resetHandle() {
        let xPos = this.spinner.x + this.spinnerLength * Math.cos(this.spinner.rotation);
        let yPos = this.spinner.y + this.spinnerLength * Math.sin(this.spinner.rotation);
        this.handle.setPos(xPos, yPos);
    }

    handleCheckpoints(oldRot, newRot) {
        if (oldRot - newRot > Math.PI) {
            oldRot -= Math.PI * 2;
        } else if (oldRot - newRot < -Math.PI) {
            oldRot += Math.PI * 2;
        }
        if (this.lastCheckpointHit !== PRINTER_CHECKPOINT_1 && (PRINTER_CHECKPOINT_1 - oldRot) * (PRINTER_CHECKPOINT_1 - newRot) < 0) {
            this.lastCheckpointHit = PRINTER_CHECKPOINT_1;
            this.checkpointHit(130, 130);
        } else if (this.lastCheckpointHit !== PRINTER_CHECKPOINT_2 && (PRINTER_CHECKPOINT_2 - oldRot) * (PRINTER_CHECKPOINT_2 - newRot) < 0) {
            this.lastCheckpointHit = PRINTER_CHECKPOINT_2;
            this.checkpointHit(-130, 130);
        } else if (this.lastCheckpointHit !== PRINTER_CHECKPOINT_3 && (PRINTER_CHECKPOINT_3 - oldRot) * (PRINTER_CHECKPOINT_3 - newRot) < 0) {
            this.lastCheckpointHit = PRINTER_CHECKPOINT_3;
            this.checkpointHit(130, -130);
        } else if (this.lastCheckpointHit !== PRINTER_CHECKPOINT_4 && (PRINTER_CHECKPOINT_4 - oldRot) * (PRINTER_CHECKPOINT_4 - newRot) < 0) {
            this.lastCheckpointHit = PRINTER_CHECKPOINT_4;
            this.checkpointHit(-130, -130);
        }
    }

    checkpointHit(offsetX, offsetY) {
        this.createCashSign(this.x + offsetX, this.y + offsetY);
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
}