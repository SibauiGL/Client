class Keys {
    constructor() {
        let lastPressedE = 0;

        mp.keys.bind(0x45, false, function() {
            const now = Date.now()

            if (now - lastPressedE > 1500) {
                mp.events.callRemote("PressE")
                lastPressedE = now
            } else mp.events.call("AddNotify", "[Anti-Spam] Nur jede Sekunde möglich", "#c72020")
        });
    }
}

export default new Keys();