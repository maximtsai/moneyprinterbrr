let config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-app',
        width: 1080,
        height: 680
    },
    antialias: true,
    transparent: false,
    roundPixels: true,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config); // var canvas = game.canvas;
let gameConsts = {
    width: 1080,
    halfWidth: 540,
    height: 680,
    halfHeight: 340,
    SDK: null
};
let gameVars = {
    gameConstructed: false,
    mousedown: false,
    mouseposx: 0,
    mouseposy: 0,
    lastmousedown: {x: 0, y: 0},
    maxBrrr: false,
    maxBrrrPhase2: false,
    printerIsBroken: false
};
let globalObjects = {};
let updateFunctions = {};
let PhaserScene = null; // Global
let oldTime = 0;
let deltaScale = 1;
let timeUpdateCounter = 0;
let timeUpdateCounterMax = 5;

function preload ()
{
    loadFileList(this, imageFilesPreload, 'image');
}

function create ()
{
    oldTime = Date.now();
    PhaserScene = this;
    onPreloadComplete(this);
}

function onPreloadComplete (scene)
{
    setupMouseInteraction(scene);
    setupLoadingBar(scene);

    loadFileList(scene, audioFiles, 'audio');
    loadFileList(scene, imageAtlases, 'atlas');
    loadFileList(scene, imageFiles, 'image');

    scene.load.start();
}

function onLoadComplete(scene) {
    initializeSounds(scene);
    setupGame(scene);
    // TODO Refactor
    soundList['bgm1Lite'].play();
    soundList['bgm1Main'].play();
    soundList['bgm1Main'].on('complete', () => {
        setTimeout(() => {
            soundList['bgm1Lite'].play();
            soundList['bgm1Main'].play();
        }, 250);
    });
    soundList['bgm1Main'].volume = 0;

    gameVars.marketSentTemp = new MarketSentiment();
}

function update(time, delta) {
    // check mouse
    if (timeUpdateCounter >= timeUpdateCounterMax) {
        timeUpdateCounter = 0;
        let newTime = Date.now();
        let deltaTime = newTime - oldTime;
        oldTime = newTime;
        deltaScale = Math.min(5, deltaTime / 100);
    } else {
        timeUpdateCounter++;
    }

    buttonManager.update(deltaScale);
    updateManager.update(deltaScale);

    updateSentimentTemp();
    if (gameVars.marketSentTemp) {
        // gameVars.marketSentTemp.updateTick();
    }
}

function loadFileList(scene, filesList, type) {
    for (let i in filesList) {
        let data = filesList[i];
        switch (type) {
            case 'audio':
                scene.load.audio(data.name, data.src);
            break;
            case 'image':
                scene.load.image(data.name, data.src);
            break;
            case 'atlas':
                scene.load.multiatlas(data.name, data.src);
            break;
        }
    }
}

let tempSentiment = 0;
let counterUpdate = 0;
function updateSentimentTemp() {
    if (globalObjects.printer) {
        let spinScale = Math.min(1, Math.abs(globalObjects.printer.spinnerVel) / 0.065);
        if (spinScale > 0.65) {
            tempSentiment = Math.min(1, tempSentiment + 0.002);
        } else {
            tempSentiment = Math.max(0, tempSentiment - 0.005);
        }
        if (gameVars.maxBrrrPhase2) {
            tempSentiment = 4;
        } else if (gameVars.maxBrrr) {
            tempSentiment = 2;
        } else if (gameVars.printerIsBroken) {
            tempSentiment = 0;
        }
        let volAmt;
        if (tempSentiment < 0.98) {
            volAmt = tempSentiment * 0.8 + spinScale * 0.03;
        } else {
            volAmt = 1;
        }
        soundList['bgm1Lite'].volume = 0; // 1 - volAmt;
        if (gameVars.maxBrrr || gameVars.printerIsBroken) {
            soundList['bgm1Main'].volume = 0;
        } else if (!gameVars.showingMaxBrrr) {
            soundList['bgm1Main'].volume = 1;
        }
    }
    if (counterUpdate > 20) {
        counterUpdate = 0;

    } else {
        counterUpdate++;
    }
}

function zoomTemp(zoomAmt) {
    PhaserScene.cameras.main.setZoom(zoomAmt);
    PhaserScene.tweens.add({
        targets: PhaserScene.cameras.main,
        zoom: 1,
        ease: "Cubic.easeOut",
        duration: 200
    });
}