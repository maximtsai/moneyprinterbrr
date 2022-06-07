function setupLoadingBar(scene) {
    // Basic loading bar visual
    let loadingBarBacking = scene.add.image(gameConsts.halfWidth, gameConsts.height - 30, 'whitePixel');
    loadingBarBacking.alpha = 0.25;
    loadingBarBacking.scaleY = 3;
    loadingBarBacking.scaleX = 100;
    loadingBarBacking.setDepth(100);
    let loadingBar = scene.add.image(gameConsts.halfWidth, gameConsts.height - 30, 'whitePixel');
    loadingBar.scaleY = 3;
    loadingBar.setDepth(101);

    // Setup loading bar logic
    scene.load.on('progress', function (value) {
        loadingBar.scaleX = value * loadingBarBacking.scaleX;
    });
    scene.load.on('complete', () => {
        onLoadComplete(scene);
        // Animate out the loading bar
        scene.tweens.add({
            targets: [loadingBar, loadingBarBacking],
            scaleX: loadingBar.scaleX * 2,
            scaleY: 0,
            duration: 300,
            ease: 'Quad.easeOut',
            onComplete: () => {
                loadingBar.destroy();
            }
        });
    });
}

function setupGame() {
    globalGameObjects.startButton = new Button(
    {
        normal: {
            "ref": "startGame",
            "atlas": "gameSprites",
            "x": gameConsts.halfWidth,
            "y": gameConsts.halfHeight - 60
        },
        hover: {
            "ref": "startGameHover",
            "atlas": "gameSprites",
            "x": gameConsts.halfWidth,
            "y": gameConsts.halfHeight - 60
        },
        press: {
            "ref": "startGamePress",
            "atlas": "gameSprites",
            "x": gameConsts.halfWidth,
            "y": gameConsts.halfHeight - 60
        },
        onMouseUp: () => {
            console.log("hi");
        }
    });
}

function createMenu(scene) {
    /*
    globalGameObjects.startButton = new Button(
        scene,
        () => {
            destroyMenu(scene);
            playSound('button');
        },
        {
            "ref": "startGame",
            "atlas": "gameSprites",
            "x": gameConsts.halfWidth,
            "y": gameConsts.halfHeight - 60
        },
        {
            "ref": "startGameHover",
            "atlas": "gameSprites"
        },
        {
            "ref": "startGamePress",
            "atlas": "gameSprites"
        }
    );

    globalGameObjects.creditsButton = new Button(
        scene,
        onCreditsButtonClicked,
        {
            "ref": "credits",
            "atlas": "gameSprites",
            "x": gameConsts.halfWidth,
            "y": gameConsts.halfHeight + 30
        },
        {
            "ref": "creditsHover",
            "atlas": "gameSprites"
        },
        {
            "ref": "creditsPress",
            "atlas": "gameSprites"
        }
    );

    globalGameObjects.creditsText = scene.add.text(gameConsts.halfWidth, gameConsts.height - 80, 'Game By Maxim Tsai\nMade for Boom Entertainment', 
        {fontFamily: 'Times New Roman', fontSize: 24, color: '#000000', align: 'center'});
    globalGameObjects.creditsText.setOrigin(0.5, 0.5);
    globalGameObjects.creditsText.visible = false;
    */
}


function onCreditsButtonClicked() {
    globalGameObjects.creditsText.visible = true;
    playSound('button');
}