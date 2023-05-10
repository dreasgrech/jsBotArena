"use strict";

const RobotSetupFactory = (function() {

    const robotSetupFactory = {
        createRobotSetup: function() {
            const robotSetup = {
                hull: {
                    hullType: EnumHelpers.getRandomValue(RobotHullTypes),
                    //hullColor: EnumHelpers.getRandomValue(RobotHullColors),
                    colors: {
                        topLeft: 0xff0000, // [red] bottom left
                        topRight: 0x00ff00, // [green] top left
                        bottomLeft: 0x0000ff, // [blue] bottom right
                        bottomRight: 0xffffff // [white] top right
                    }
                },
                turret: {
                    turretType: EnumHelpers.getRandomValue(RobotTurretTypes),
                    turretColor: EnumHelpers.getRandomValue(RobotTurretColors)
                },
                //    radar: {
                //    }
            };

            return robotSetup;
        }
    };

    return robotSetupFactory;
}());
