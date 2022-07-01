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
    globalObjects.optionsButton = new Button(
    {
        normal: {
            "ref": "optionsNormal",
            "x": 1000,
            "y": 650
        },
        hover: {
            "ref": "optionsHover"
        },
        press: {
            "ref": "optionsPress"
        },
        onMouseUp: () => {
            if(globalObjects.optionsMenu == null || globalObjects.optionsMenu.isClosed == true){
                globalObjects.optionsMenu = new OptionsMenu(gameConsts.halfWidth, gameConsts.halfHeight);
            }
        }
    });

    globalObjects.printer = new Printer(805, 390);
    updateManager.addFunction(globalObjects.printer.update.bind(globalObjects.printer));

    globalObjects.bloomberg = new Bloomberg(822, 75);
    globalObjects.buttonsPanel = new ButtonsPanel(286, 545);
    globalObjects.ctrScreen = new CTRScreen(285, 229);


    // TODO: Remove, this is just used for temporary testing
    messageBus.publish('bloombergNews', "New news update 1");
    messageBus.publish('bloombergNews', "New news update 2");
    setTimeout(() => {
        messageBus.publish('bloombergNews', "New critical stock market news 3, it's crashing!");
    }, 2000);
    setTimeout(() => {
        messageBus.publish('bloombergNews', "New critical stock market news 4, it's going back up!");
    }, 5000);

}


function onCreditsButtonClicked() {
    globalObjects.creditsText.visible = true;
    playSound('button');
}