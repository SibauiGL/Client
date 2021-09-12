import webview from "../webview/webview"
import interfaces from "../webview/interfaces"
import player from "../player/player"
import xmenu from "../xmenu/xmenu"

class Keys {
    constructor() {
        let lastPressedE = 0;
        let lastPressedI = 0;

        mp.keys.bind(0x45, false, function() {
            if (!player.loaded) return;

            const now = Date.now()

            if (now - lastPressedE > 1500) {
                mp.events.callRemote("Press", 0x45)
                lastPressedE = now
            } else mp.events.call("AddNotify", "[Anti-Spam] Nur jede Sekunde möglich", "#c72020")
        });

        mp.keys.bind(0x49, false, function() {
            if (!player.loaded) return;

            if (interfaces.isOpen("Inventory")) {
                webview.closeInterface()
            } else {
                const now = Date.now()

                if (now - lastPressedI > 200) {
                    mp.events.callRemote("Press", 0x49)
                    lastPressedI = now
                } else mp.events.call("AddNotify", "[Anti-Spam] Nur jede 200ms möglich", "#c72020")
            }
        });

        mp.keys.bind(0x4D, false, function() {
            if (!player.loaded) return;

            if (interfaces.isOpen("Self")) {
                webview.closeInterface();
            } else {
                webview.showInterface(["Self"]);
            }
        });

        mp.keys.bind(0x58, true, function() {
            const items = xmenu.getItems()
            xmenu.show(items)
            if (items != null)
                mp.gui.cursor.show(true, true);
        });

        mp.keys.bind(0x58, false, function() {
            mp.gui.cursor.show(false, false);
        });
    }
}

export default new Keys();