import webview from "../webview/webview"
import interfaces from "../webview/interfaces"

class Keys {
    constructor() {
        let lastPressedE = 0;

        mp.keys.bind(0x45, false, function() {
            const now = Date.now()

            if (now - lastPressedE > 1500) {
                mp.events.callRemote("PressE", 0x45)
                lastPressedE = now
            } else mp.events.call("AddNotify", "[Anti-Spam] Nur jede Sekunde möglich", "#c72020")
        });

        mp.keys.bind(0x4D, false, function() {
            if (interfaces.isOpen("Self")) {
                webview.closeInterface();
                mp.events.call("AddNotify", "CloseSelf", "#c72020")
            } else {
                webview.showInterface(["Self"]);
                mp.events.call("AddNotify", "OpenSelf", "#c72020")
            }
        });
    }
}

export default new Keys();