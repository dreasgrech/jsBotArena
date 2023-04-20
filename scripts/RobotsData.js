"use strict";

var RobotsData = (function() {
    var ids = [];
    var robotAPIs = [];
    var updateFunctions = [];
    var robotBodyImages = [];
    var robotTurretImages = [];
    var robotSpeeds = [];
    var radarGraphics = [];

    var positionXs = [];
    var positionYs = [];
    var radarAngles = [];
    var radarMaxRotation = [];
    var radarMaxScanDistance = [];

    return {
        ids: ids,
        positionXs: positionXs,
        positionYs: positionYs,
        updateFunctions: updateFunctions,
        robotBodyImages: robotBodyImages,
        robotTurretImages: robotTurretImages,
        robotAPIs: robotAPIs,
        robotSpeeds: robotSpeeds,
        radarAngles: radarAngles,
        radarGraphics: radarGraphics,
        radarMaxRotation: radarMaxRotation,
        radarMaxScanDistance: radarMaxScanDistance
    };
}());
