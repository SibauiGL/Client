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

        mp.events.add("SetAppearance", (appearanceData) => {
            this.appearance = JSON.parse(appearanceData);
            this.setAppearance();
        });
    }

    setAppearance(reset = false) {
        const appearance = this.appearance;

        mp.players.local.setHeadBlendData(
            parseInt(appearance.parents.fatherShape),
            parseInt(appearance.parents.motherShape),
            0,
            parseInt(appearance.parents.fatherSkin),
            parseInt(appearance.parents.motherSkin),
            0,
            parseFloat(appearance.parents.similarity),
            parseFloat(appearance.parents.skinSimilarity),
            0,
            false
        );

        mp.players.local.setComponentVariation(
            2,
            parseInt(appearance.hair.hair),
            0,
            0
        );

        mp.players.local.setHairColor(
            parseInt(appearance.hair.color),
            parseInt(appearance.hair.highlightColor)
        );

        mp.players.local.setEyeColor(parseInt(appearance.eyeColor));

        for (const index in appearance.features) {
            mp.players.local.setFaceFeature(
                parseInt(index),
                parseFloat(appearance.features[index])
            );
        }

        for (const index in appearance.appearance) {
            const part = appearance.appearance[index];
            if (parseInt(part.value) == 255 && !reset) continue;
            mp.players.local.setHeadOverlay(
                parseInt(index),
                parseInt(part.value),
                parseFloat(part.opacity),
                0, 0
            );
        }

        mp.players.local.setHeadOverlayColor(
            2,
            1,
            parseInt(appearance.eyebrowColor),
            0
        );

        mp.players.local.setHeadOverlayColor(
            1,
            1,
            parseInt(appearance.beardColor),
            0
        );

        mp.players.local.setHeadOverlayColor(
            10,
            1,
            parseInt(appearance.chestHairColor),
            0
        );

        mp.players.local.setHeadOverlayColor(
            5,
            2,
            parseInt(appearance.blushColor),
            0
        );

        mp.players.local.setHeadOverlayColor(
            8,
            2,
            parseInt(appearance.lipstickColor),
            0
        );
    }
}

export default new Player();