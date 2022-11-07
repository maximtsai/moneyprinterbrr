
 class Lights {
   constructor(depth) {
      this.mainEnergy = 0;
      this.updateFreq = 1.75;
      this.updateAcc = 0;
      this.mainLight = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'lights');
      this.mainLight.setDepth(depth);
      this.mainLight.setScale(2);
      this.mainLight.alpha = 0;
      this.totalLight = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel');
      this.totalLight.setScale(1000);
      this.totalLight.alpha = 0;
      this.totalLight.setDepth(depth);

      messageBus.subscribe("setMainLight", this.setMainLight.bind(this));
      messageBus.subscribe("tweenTotalLight", this.tweenTotalLight.bind(this));
   }

   setMainLight(alpha) {
      this.mainLight = alpha;
   }

   tweenTotalLight(alpha, duration = 1000) {
      PhaserScene.tweens.add({
         targets: this.totalLight,
         alpha: alpha,
         duration: duration
      });
   }

   addEnergy(amt) {
      if (this.mainEnergy > 350) {
         this.mainEnergy += amt * 0.25;
      } else if (this.mainEnergy < 50) {
         if (this.mainEnergy < 10) {
            this.mainEnergy = 15;
         }
         this.mainEnergy += amt * 5;
      } else {
         this.mainEnergy += amt;
      }
   }

   update(deltaScale) {
      let spinVel = Math.abs(globalObjects.printer.spinnerVel);
      if (spinVel > 0.01) {
         this.mainEnergy = Math.max(0, this.mainEnergy - deltaScale * 0.2);
         let energyAdded = spinVel * deltaScale * 10;
         this.addEnergy(energyAdded);
      } else {
         if (this.mainEnergy < 50) {
            this.mainEnergy = Math.max(0, this.mainEnergy - deltaScale * 0.1);
         } else {
            this.mainEnergy = Math.max(0, this.mainEnergy - deltaScale * 2);
         }
      }

      if (this.mainEnergy < 0.1) {
         this.mainLight.alpha = 1;
      } else if (this.mainEnergy < 1) {
         // total black
         console.log('x')
         this.mainLight.alpha = 0.5;
      } else if (this.mainEnergy < 100) {
         // flickery
         this.updateAcc += deltaScale;
         if (this.updateAcc > this.updateFreq) {
            let randLightBonus = 0;
            if (Math.random() < this.mainEnergy / 1000) {
               randLightBonus = 0.1 + Math.random() * 0.2;
            }
            this.mainLight.alpha = Math.max(0, 1 - (this.mainEnergy / 100) - randLightBonus);
         }
      } else {
         this.mainLight.alpha = 0;
      }
   }
}