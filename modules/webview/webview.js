import interfaces from "./interfaces";
import xmenu from "../xmenu/xmenu"

class WebView {
    constructor() {
        this.mainView = mp.browsers.new('package://sibaui/index.html');

        let bodyCam = null,
            freezeInterval = null,
            bodyCamStart = null;

        mp.gui.chat.show(true);

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
            mp.gui.chat.push(`AddNotify ${JSON.stringify( [message, color])}`);

            this.mainView.call("UpdateView", "AddNotify", [message, color])
        })

        mp.events.add("PointCameraAtFace", () => {
            this.bodyCamStart = mp.players.local.position;
            let camValues = { Angle: mp.players.local.getRotation(2).z + 90, Dist: 2.6, Height: 0.2 };
            let pos = this.getCameraOffset(new mp.Vector3(this.bodyCamStart.x, this.bodyCamStart.y, this.bodyCamStart.z + camValues.Height), camValues.Angle, camValues.Dist);
            this.bodyCam = mp.cameras.new('default', pos, new mp.Vector3(0, 0, 0), 50);
            this.bodyCam.pointAtCoord(this.bodyCamStart.x, this.bodyCamStart.y, this.bodyCamStart.z + camValues.Height);
            this.bodyCam.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 500, true, false);

            this.freezeInterval = setInterval(() => mp.players.local.clearTasksImmediately(), 0);
        })

        mp.events.add("DestroyCamera", () => {
            if (this.freezeInterval != null) clearInterval(this.freezeInterval)
            mp.players.local.freezePosition(false);

            if (this.bodyCam == null) return;
            this.bodyCam.setActive(false);
            this.bodyCam.destroy();
            mp.game.cam.renderScriptCams(false, false, 3000, true, true);

            this.bodyCam = null;
        })

        mp.events.add("SetPart", (method, ...args) => {
            mp.players.local[method](...args)
        })

        mp.events.add("SetRotation", rot => {
            mp.players.local.setHeading(parseInt(rot));
        })

        mp.events.add("XMenuSelected", (item) => {
            xmenu.onItemSelected(JSON.parse(item))
        })

        /* just temporary, for login */
        mp.events.add("SetInvincible", bool => {
            mp.players.local.setInvincible(bool);
        });
    }

    getCameraOffset(pos, angle, dist) {
        angle = angle * 0.0174533;
        pos.y = pos.y + dist * Math.sin(angle);
        pos.x = pos.x + dist * Math.cos(angle);
        return pos;
    }

    updateView(eventName, args = []) {
        mp.gui.chat.push(`${eventName} ${JSON.stringify(args)}`);

        this.mainView.call("UpdateView", eventName, args)
    }

    showInterface(args) {
        mp.gui.chat.push(`ShowIF ${args[0]} (${JSON.stringify(args)})`);

        mp.gui.cursor.show(true, true);
        interfaces.open(args[0]);
        this.mainView.call("ShowIF", args);
    }

    closeInterface() {
        this.mainView.call("ShowIF", "");
        mp.gui.cursor.show(false, false);
        interfaces.hide();
    }
}

export default new WebView();