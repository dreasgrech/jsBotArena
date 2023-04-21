"use strict";

var RobotsData_PhysicsBodies = (function() {
    var obj = {
        robotBodyImages: [],
        robotTurretImages: []
    };

    return obj;
}());

var RobotsData_CurrentData = (function() {
    var obj = {
        positionXs: [],
        positionYs: [],
        currentRobotAngles: [],
        currentTurretAngles: [],
        currentRadarAngles: [],
        getPosition: function(index) {
            return new Phaser.Math.Vector2(obj.positionXs[index], obj.positionYs[index]);
        }
    };

    return obj;
}());

var RobotsData_Instance = (function() {
    var obj = {
        ids: [],
        names: [],
        updateFunctions: [],
        robotAPIs: [],
        robotSpeeds: []
    };

    return obj;
}());

var RobotsData_Radar = (function() {
    var obj = {
        radarGraphics: [],
        radarFOVAngles: [],
        radarMaxScanDistance: []
    };

    return obj;
}());
