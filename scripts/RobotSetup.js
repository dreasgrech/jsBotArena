"use strict";

const RobotSetupFactory = (function() {

    const robotSetupFactory = {
        createRobotSetup: function() {
            const robotSetup = {
                hull: {
                    hullType: EnumHelpers.getRandomValue(RobotHullTypes),
                    hullColor: EnumHelpers.getRandomValue(RobotHullColors),
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

