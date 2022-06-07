let config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-app',
        width: 640,
        height: 480
    },
    antialias: true,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config); // var canvas = game.canvas;
let gameConsts = {
    width: 640,
    halfWidth: 320,
    height: 480,
    halfHeight: 240
};
let gameVars = {
    gameConstructed: false,
    mousedown: false,
    mouseposx: 0,
    mouseposy: 0,
    lastmousedown: {x: 0, y: 0},
};
let globalGameObjects = {};
let globalScene = null; // Globall

function preload ()
{
    loadFileList(this, imageFilesPreload, 'image');
}

function create ()
{
    globalScene = this;;
    onPreloadComplete(this);
}

function onPreloadComplete (scene)
{
    setupMouseInteraction(scene);
    setupLoadingBar(scene);

    loadFileList(scene, audioFiles, 'audio');
    loadFileList(scene, imageFiles, 'atlas');

    scene.load.start();
}

function onLoadComplete(scene) {
    initializeSounds(scene);
    setupGame(scene);
}

function update() {
    // check mouse
    buttonManager.update();
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