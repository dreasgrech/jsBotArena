"use strict";

// TODO: It might be beneficial to even remove the const objects completely and only have arrays, globally.
// TODO: But then in the end eventually we'll find a way to scope everything together so that they are not accessible
// TODO: from the outside.

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
        getPosition: function(index) {
            return new Phaser.Math.Vector2(obj.positionXs[index], obj.positionYs[index]);
        }
    };

    return obj;
}());

// Robots instance data, doesn't change once created.
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

// Radar data
const RobotsData_Radar = (function() {
    const obj = {
        radarGraphics: [],
        radarFOVAngles_degrees: [],
        radarMaxScanDistance: []
    };

    return obj;
}());
