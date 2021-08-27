import webview from "../webview/webview"

class Vehicle {
    constructor() {
        this.fuelInterval = null
        this.speedInterval = null

        this.handbreakOn = false
        this.standing = false
        this.km = 0
        this.distance = 0
        this.fuel = 0
        this.fuelConsumption = 0
        this.fuelConsumptionFactor = 0
        this.isEmpty = false
        this.vehicleData = []
        this.engine = false
        this.door = false
        this.rpm = 0
        this.gear = 0

        this.fuelCounter = 0

        mp.events.add("VehEnter", (fuel, km, engineOn) => {
            km = parseFloat(km.toFixed(2));
            fuel = parseFloat(fuel.toFixed(2));

            webview.updateView("ShowVehHUD", [true, {
                doorOpen: true,
                engineOn,
                trunkOpen: false,
                speed: 0,
                km,
                fuel,
                maxFuel: 1000
            }])

            this.km = km
            this.fuel = fuel
            this.isEmpty = fuel == 0
            const isDriver = mp.players.local == mp.players.local.vehicle.getPedInSeat(-1)

            this.speedInterval = setInterval(() => {
                if (mp.players.local.vehicle == null) {
                    webview.updateView("ShowVehHUD", [false])

                    if (this.speedInterval != null) {
                        clearInterval(this.speedInterval)
                    }

                    if (isDriver && !this.isEmpty) {
                        this.fuelConsumption = 0
                        this.distance = 0
                        this.fuelCounter = 0
                        this.isEmpty = true
                    }

                    return
                }

                const speed = Math.floor(mp.players.local.vehicle.getSpeed() * 3.6)

                if (speed == 0 && !this.standing) {
                    webview.updateView("UpdateVehHUD", ["speed", speed])
                    this.standing = true
                    return
                }

                if (speed != 0) {
                    webview.updateView("UpdateVehHUD", ["speed", speed])
                    this.standing = false
                }

                // RPM & GEAR
                const rpm = mp.players.local.vehicle.rpm;
                if (this.rpm != rpm) {
                    this.rpm = rpm;
                    webview.updateView("UpdateVehHUD", ["rpm", rpm.toFixed(2)])
                }

                const gear = mp.players.local.vehicle.gear;
                if (this.gear != gear) {
                    this.gear = gear;
                    webview.updateView("UpdateVehHUD", ["gear", gear])
                }

                const doorOpen = mp.players.local.vehicle.getVariable("Locked");
                if (this.door != doorOpen) {
                    this.door = doorOpen;
                    webview.updateView("UpdateVehHUD", ["doorOpen", !doorOpen])
                }

                const engineOn = mp.players.local.vehicle.getVariable("Engine");
                if (this.engine != engineOn) {
                    this.engine = engineOn;
                    webview.updateView("UpdateVehHUD", ["engineOn", engineOn])
                }
            }, 50)
        })
    }
}

export default new Vehicle();