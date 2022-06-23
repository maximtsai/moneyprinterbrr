let config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-app',
        width: 1080,
        height: 680
    },
    antialias: true,
    backgroundColor: '#001000',
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
};
let globalObjects = {};
let updateFunctions = {};
let PhaserScene = null; // Global

function preload ()
{
    loadFileList(this, imageFilesPreload, 'image');
}

function create ()
{
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
}

function update(time, delta) {
    // check mouse
    let deltaScale = delta / 16.67;
    buttonManager.update(deltaScale);
    updateManager.update(deltaScale);
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