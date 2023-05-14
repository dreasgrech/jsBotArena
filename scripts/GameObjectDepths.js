"use strict";

const GameObjectDepths = (function() {

    const baseUILayer = 100;

    const obj = {
        Projectile: 4,
        RobotBody: 5,
        RobotTurret: 6,

        ImpactAnimation: 10,

        RobotRadarArc: 30,

        UI_RobotInformationPanel: baseUILayer + 1
    };

    return obj;
}());
