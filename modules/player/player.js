import webview from "../webview/webview";

class Player {
    constructor() {
        this.name = "";
        this.team = 1;
        this.isCuffed = false;
        this.isInjured = false;
        this.isFreezed = false;
        this.cloth = {};
        this.props = {};
        this.maxArmor = 100;
        this.maxHealth = 100;
        this.weapons = {};
        this.gender = 0;

        mp.events.add("PlayerLoaded", (_player) => {
            var player = JSON.parse(_player);

            webview.updateView("SetMoney", [player.m]);
            webview.updateView("HidePlayerHud", [false]);
        });
    }
}

export default new Player();