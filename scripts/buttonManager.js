class InternalButtonManager {
    constructor() {
        this.buttonList = [];
        this.lastHovered = null;
        this.lastClickedButton = null;
        this.draggedObj = null;

        messageBus.subscribe("pointerUp", this.onPointerUp.bind(this));
        messageBus.subscribe("pointerDown", this.onPointerDown.bind(this));
    }

    update() {
        let handX = gameVars.mouseposx;
        let handY = gameVars.mouseposy;
        // check hovering
        let hasHovered = false;
        let currentHovered = null;

        for (let i = this.buttonList.length - 1; i >= 0; i--) {
            let buttonObj = this.buttonList[i];
            if (buttonObj && buttonObj.checkCoordOver(handX, handY)) {
                buttonObj.onHover();
                hasHovered = true;
                currentHovered = buttonObj;
                break;
            }
        }
        if (this.lastHovered && this.lastHovered !== currentHovered 
            && this.lastHovered.getState() !== 'disable') {
            this.lastHovered.setState('normal');
            this.lastHovered.onHoverOut();
        }

        this.lastHovered = currentHovered;
    }

    onPointerUp(mouseX, mouseY) {
        let buttonObj = this.getLastClickedButton();
        if (buttonObj && buttonObj.checkCoordOver(mouseX, mouseY)) {
            buttonObj.onMouseUp();
        }
        if (this.draggedObj && this.draggedObj.onDrop) {
            this.draggedObj.onDrop();
        }
    }

    onPointerDown(mouseX, mouseY) {
        for (let i = this.buttonList.length - 1; i >= 0; i--) {
            let buttonObj = this.buttonList[i];
            if (buttonObj.checkCoordOver(mouseX, mouseY)) {
                buttonObj.onMouseDown();
                this.lastClickedButton = buttonObj;
                break;
            }
        }
    }

    addToButtonList(button) {
        this.buttonList.push(button);
    }

    getLastClickedButton() {
        return this.lastClickedButton;
    }

    removeButton(button) {
        for (let i in this.buttonList) {
            if (this.buttonList[i] === button) {
                this.buttonList.splice(parseInt(i), 1);
                break;
            }
        }
    }

    setDraggedObj(newObj = null) {
        this.draggedObj = newObj;
    }
}

buttonManager = new InternalButtonManager();
