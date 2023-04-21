"use strict";

var RobotsData = (function() {
    //var hull = { };
    var obj = {
        totalRobots: 0,
        ids: [],
        names: [],
        positionXs: [],
        positionYs: [],
        currentRobotAngles: [],
        updateFunctions: [],
        robotBodyImages: [],
        robotTurretImages: [],
        currentTurretAngles: [],
        robotAPIs: [],
        robotSpeeds: [],
        currentRadarAngles: [],
        radarGraphics: [],
        radarFOVAngles: [],
        radarMaxScanDistance: [],
        getPosition: function(index) {
            return new Phaser.Math.Vector2(obj.positionXs[index], obj.positionYs[index]);
        }
    };

    return obj;
}());
