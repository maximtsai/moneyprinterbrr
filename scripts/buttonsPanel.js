/**
 * This file contains the code for the buttons menu in the bottom left of the game
 * 
 **/
 
 class ButtonsPanel {
    constructor(x, y) {
        this.bg = PhaserScene.add.image(x, y, 'buttonsPanelBase');

        // TODO: Temporary placeholder text
        setTimeout(() => {
            messageBus.publish("addButton", "Does a thing", 100, () => {console.log("Button pressed")})
        }, 4000)
        setTimeout(() => {
            messageBus.publish("addButton", "Does a thing", 100, () => {console.log("Button pressed")})
        }, 6000)


        messageBus.subscribe("addButton", this.handleAddButton.bind(this));

    }

    handleAddButton(buttonText, buttonCost, buttonFunc) {
      // Do stuff
    }

}