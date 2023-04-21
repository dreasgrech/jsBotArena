"use strict";

var RobotsData = (function() {
    var ids = [];
    var robotAPIs = [];
    var updateFunctions = [];
    var robotBodyImages = [];
    var robotTurretImages = [];
    var robotSpeeds = [];
    var radarGraphics = [];
    var radarFOVAngles = []; // The arc angle of the radar

    var positionXs = [];
    var positionYs = [];
    var robotAngles = [];
    var radarAngles = [];
    var radarMaxScanDistance = [];

    return {
        totalRobots: 0,
        ids: ids,
        positionXs: positionXs,
        positionYs: positionYs,
        robotAngles: robotAngles,
        updateFunctions: updateFunctions,
        robotBodyImages: robotBodyImages,
        robotTurretImages: robotTurretImages,
        robotAPIs: robotAPIs,
        robotSpeeds: robotSpeeds,
        radarAngles: radarAngles,
        radarGraphics: radarGraphics,
        radarFOVAngles: radarFOVAngles,
        radarMaxScanDistance: radarMaxScanDistance,
        getPosition: function(index) {
            return new Phaser.Math.Vector2(positionXs[index], positionYs[index]);
        }
    };
}());
