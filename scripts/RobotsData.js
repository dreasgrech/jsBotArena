"use strict";

var RobotsData = (function() {
    var obj = {
        totalRobots: 0,
        ids: [],
        names: [],
        positionXs: [],
        positionYs: [],
        robotAngles: [],
        updateFunctions: [],
        robotBodyImages: [],
        robotTurretImages: [],
        robotAPIs: [],
        robotSpeeds: [],
        radarAngles: [],
        radarGraphics: [],
        radarFOVAngles: [],
        radarMaxScanDistance: [],
        getPosition: function(index) {
            return new Phaser.Math.Vector2(obj.positionXs[index], obj.positionYs[index]);
        }
    };

    return obj;
}());
