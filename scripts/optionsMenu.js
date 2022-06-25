/**
 * This file contains the code for the options menu that appears when you click on OPTION$
 * 
 **/
 
 class OptionsMenu {
    constructor(x, y, depth = 100) {
        this.bg = PhaserScene.add.image(x, y, 'optionsBackground');
        this.bg.setDepth(depth);
        this.isClosed = false;
        this.closeButton = new Button(
        {
            normal: {
                "ref": "closeButtonNormal",
                "x": x + 250,
                "y": y - 200
            },
            hover: {
                "ref": "closeButtonHover"
            },
            press: {
                "ref": "closeButtonPress"
            },
            onMouseUp: () => {
                this.destroy();
            }
        });
        this.closeButton.setDepth(depth + 1);
    }

    destroy() {
        this.isClosed = true;
        this.bg.destroy();
        this.closeButton.destroy();
    }
}