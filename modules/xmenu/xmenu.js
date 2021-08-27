import webview from "../webview/webview"
import raycast from "../raycast/raycast"

class XMenu {
    constructor() {
        this.playerOnPlayerItems = [
            { text: "Geld geben", event: "GiveMoney", server: true },
            { text: "Dokument zeigen", event: "ShowDoc", server: true },
            { text: "Dokument nehmen", event: "TakeDoc", server: true }, //Person macht animation?
            { text: "Durchsuchen", event: "InvSearch", server: true },
            { text: "Gegenstand geben", event: "Give", server: true },
            { text: "Ins Fahrzeug ziehen", event: "GrabPlayer", server: true },
            { text: "Fesseln", event: "Tie", server: true }
        ]

        this.playerInVehicleItems = [
            { text: "Motor an/aus", event: "ToggleEngine", server: true },
            { text: "Türen auf/zu", event: "ToggleDoor", server: true },
            { text: "Kofferraum auf/zu", event: "ToggleTrunk", server: true },
            { text: "Rauswerfen", event: "Eject", server: true }
        ]

        this.playerOutVehicleItems = [
            { text: "Kofferraum auf/zu", event: "ToggleTrunk", server: true },
            { text: "Türen auf/zu", event: "ToggleDoor", server: true },
            { text: "Reparieren", event: "Repair", server: true },
            { text: "Einparken", event: "Park", server: true }
        ]

        this.vehiclesWithComputer = new Set([
            /* PD */
            0x432EA949,
            0x9DC66994,
            0x79FBB0C5,
            0x9F05F101,
            0x71FA16EA,
            0x8A63C7B9,
            0xFDEFAEC3,
            0x1517D4D9,
            0xA46462F7,
            0x95F4C618,
            0x1B38E955,
            0xE2E7D4AB,
            0xB822A1AA,
            0x9B16A3B4,
            0x9BAA707C,
            0x72935408,
            0xFE457F00,
            0xC80F1294,
            0x5714B7DA,
            0x243133AB,
            0x295306FA,
            0xC4BAC3AC,
            0x6090706C,
            0x35AC5ADF,
            0xAC384A90,
            0x9745D4D9,
            0x8F3BC3CD,
            0xCC66AF42,
            0x43CCAF27,
            0x3A0E34C1,
            0xB1C5826,
            0xE69FECAD,
            0xAB7C8500,
            0xFE457F00,
            0xC80F1294,
            0xA02CD259,
            0x63E9AE91,
            /* FIB */
            0xAE2BFE94,
            0xC94C6317,
            0x16C5BC6E,
            0xB5D306A4,
            0xC2EFE913,
            0xE7AF8816,
            0x8DC6408D,
            0x5E92D1C6
        ])

        this.vehiclesWithServicelist = new Set([
            /* Medics */
            0x45D56ADA,
            0x1517D4D9,
            0x432EA949,
            0x9DC66994,
            0x33B47F96,
            0xB5D306A4,
            0x5E92D1C6,
            0xC2EFE913,
            /* DPOS */
            0xB12314E0,
            0xE5A2D6C6,
            0xCFB3870C,
            0x50B0215A,
            0x60A7EA10,
            0xAF966F3C,
            0xFCFCB68B,

            /* TAXI */
            0xC703DB5F
        ])

        this.items = null
        this.inVehicle = false
        this.entity = null
    }

    getItems() {
        this.inVehicle = mp.players.local.vehicle != null;
        this.items = null;
        this.type = undefined


        if (this.inVehicle) {
            this.entity = { entity: mp.players.local.vehicle };
            this.getPlayerInVehicleItems()
        } else {
            this.entity = raycast.createRaycast()
            if (this.entity != null) {
                if (this.entity.entity.isAPed()) {
                    this.getPlayerOnPlayerItems()
                } else if (this.entity.entity.isAVehicle()) {
                    this.getPlayerOnVehicleItems()
                }
            }
        }

        return this.items
    }

    getPlayerOnPlayerItems() {
        this.items = [...this.playerOnPlayerItems]
        if (player.team == 3 || player.team == 7) { //Pd, Fib
            this.items.push({ text: "Festnehmen", event: "Cuff", server: true })
            this.items.push({ text: "Fußfesseln", event: "FootCuff", server: true })
        }
    }

    getPlayerInVehicleItems() {
        this.items = [...this.playerInVehicleItems]
    }

    getPlayerOnVehicleItems() {
        this.items = [...this.playerOutVehicleItems]
    }

    show(items) {
        webview.updateView("XMenu", [items])
        mp.gui.cursor.position = [mp.game.graphics.getScreenActiveResolution(0, 0).x / 2, mp.game.graphics.getScreenActiveResolution(0, 0).y / 2];
    }

    onItemSelected(item) {
        webview.updateView("CloseIF")

        if (item.server) {
            if (this.entity == null) mp.gui.chat.push("entity null")

            mp.events.callRemote(item.event, this.entity.entity)
        }

        this.items = null
        this.entity = null
    }
}

export default new XMenu();