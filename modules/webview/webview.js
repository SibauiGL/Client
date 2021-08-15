class WebView {
    constructor() {
        this.mainView = mp.browsers.new('package://sibaui/index.html');
        mp.gui.chat.show(false);

        mp.events.add('UpdateView', (eventName, ...args) => {
            mp.gui.chat.push(`${eventName} ${JSON.stringify(args)}`);
            this.mainView.call("UpdateView", eventName, args);
        });

        mp.events.add('ShowIF', (...args) => {
            mp.gui.chat.push(`ShowIF ${args[0]} (${JSON.stringify(args)})`);
            mp.gui.cursor.show(true, true);
            this.mainView.call("ShowIF", args);
        });

        mp.events.add('CloseIF', () => {
            this.mainView.call("ShowIF", "");
            mp.gui.cursor.show(false, false);
        });

        mp.events.add("EmitServer", (eventName, ...args) => {
            mp.events.callRemote(eventName, ...args)
        });

        mp.events.add("HideInterface", () => {
            mp.gui.cursor.show(false, false);
        });

        mp.events.add("HidePlayerHud", (bool) => {
            this.mainView.call("UpdateView", "HidePlayerHud", [bool])
        })

        mp.events.add("AddNotify", (message, color) => {
            this.mainView.call("UpdateView", "AddNotify", [message, color])
        })

        /* just temporary, for login */
        mp.events.add("SetInvincible", bool => {
            mp.players.local.setInvincible(bool);
        });
    }

    updateView(eventName, args = []) {
        this.mainView.call("UpdateView", eventName, args)
    }
}

export default new WebView();