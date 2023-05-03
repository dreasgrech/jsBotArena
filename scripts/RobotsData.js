"use strict";

const RobotsData_PhysicsBodies = (function() {
    const obj = {
        robotBodyImages: [],
        robotTurretImages: []
    };

    return obj;
}());

// Data that is updated per frame
const RobotsData_CurrentData = (function() {
    const obj = {
        positionXs: [],
        positionYs: [],
        currentRobotAngles_degrees: [],
        currentRobotVelocities: [],
        currentTurretAngles: [],
        currentRadarAngles_degrees: [],
        robotCollisions: [], // [[{,,}], [{,,}], [{,,}]]
        arenaCollisions: [], // [[{,,}], [{,,}], [{,,}]]
        //totalCollisions: 0,
        getPosition: function(index) {
            return new Phaser.Math.Vector2(obj.positionXs[index], obj.positionYs[index]);
        }
    };

    return obj;
}());

const RobotsData_Instance = (function() {
    const obj = {
        ids: [],
        names: [],
        updateFunctions: [],
        robotAPIs: [],
        robotSpeeds: []
    };

    return obj;
}());

const RobotsData_Radar = (function() {
    const obj = {
        radarGraphics: [],
        radarFOVAngles_degrees: [],
        radarMaxScanDistance: []
    };

    return obj;
}());
