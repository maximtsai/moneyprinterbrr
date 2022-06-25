/**
 * This file contains the code for the options menu that appears when you click on OPTION$
 * 
 **/

class OptionsMenu {
    constructor(x, y, depth = 100) {
        this.bg = PhaserScene.add.image(x, y, 'optionsBackground');
        this.bg.setDepth(depth);
        this.isClosed = false;
        let newText = PhaserScene.add.text(x - 75, y, "\"Wish you good luck\"", {
            fontFamily: 'Times New Roman',
            fontSize: 20,
            color: 'black',
            fixedWidth: 240
        });
        this.wishText = newText;
        this.closeButton = new Button({
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

        this.donationLink1 = new Button({
            normal: {
                "ref": "donationLinkNormal",
                "x": x - 130,
                "y": y + 100
            },
            hover: {
                "ref": "donationLinkHover"
            },
            press: {
                "ref": "donationLinkPress"
            },
            onMouseUp: () => {
                this.openDonationLink(1);
            }
        })
        this.donationLink1.setScale(0.6, 0.6);

        this.donationLink2 = new Button({
            normal: {
                "ref": "donationLinkNormal",
                "x": x + 130,
                "y": y + 100
            },
            hover: {
                "ref": "donationLinkHover"
            },
            press: {
                "ref": "donationLinkPress"
            },
            onMouseUp: () => {
                this.openDonationLink(2);
            }
        })
        this.donationLink2.setScale(0.6, 0.6);
        
        this.wishText.setDepth(depth + 1);
        this.donationLink1.setDepth(depth + 1);
        this.donationLink2.setDepth(depth + 1);
        this.closeButton.setDepth(depth + 1);
    }

    destroy() {
        this.isClosed = true;
        this.wishText.destroy();
        this.donationLink1.destroy();
        this.donationLink2.destroy();
        this.bg.destroy();
        this.closeButton.destroy();
    }

    openDonationLink(index) {
        let url = "";
        switch(index){
            case 1:
                url = "https://www.google.com/";
                break;
            case 2:
            default:
                url = "https://github.com/maximtsai/moneyprinterbrr";
            break;
        }
        let donationPage = window.open(url, '_blank');
        if(donationPage && donationPage.focus){
            donationPage.focus();
        }
        else if(!donationPage){
            window.location.href = url;
        }
    }
}