"use strict";

var RobotsData_PhysicsBodies = (function() {
    const obj = {
        robotBodyImages: [],
        robotTurretImages: []
    };

    return obj;
}());

// Data that is updated per frame
var RobotsData_CurrentData = (function() {
    const obj = {
        positionXs: [],
        positionYs: [],
        currentRobotAngles: [],
        currentTurretAngles: [],
        currentRadarAngles: [],
        robotCollisions: [], // [[{,,}], [{,,}], [{,,}]]
        totalCollisions: 0,
        getPosition: function(index) {
            return new Phaser.Math.Vector2(obj.positionXs[index], obj.positionYs[index]);
        }
    };

    return obj;
}());

var RobotsData_Instance = (function() {
    const obj = {
        ids: [],
        names: [],
        updateFunctions: [],
        robotAPIs: [],
        robotSpeeds: []
    };

    return obj;
}());

var RobotsData_Radar = (function() {
    const obj = {
        radarGraphics: [],
        radarFOVAngles: [],
        radarMaxScanDistance: []
    };

    return obj;
}());
