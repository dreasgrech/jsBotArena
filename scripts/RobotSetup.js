"use strict";

const RobotSetupFactory = (function() {

    const robotSetupFactory = {
        createRobotSetup: function() {
            const robotSetup = {
                hullType: EnumHelpers.getRandomValue(RobotHullTypes),
                turretType: EnumHelpers.getRandomValue(RobotTurretTypes),
                hullColor: EnumHelpers.getRandomValue(RobotHullColors),
                turretColor: EnumHelpers.getRandomValue(RobotTurretColors)
            };

            return robotSetup;
        }
    };

    return robotSetupFactory;
}());

