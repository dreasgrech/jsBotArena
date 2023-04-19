"use strict";

var RobotsData = (function() {
    var ids = [];
    var positionXs = [];
    var positionYs = [];
    var updateFunctions = [];
    var robotBodyImages = [];
    var robotTurretImages = [];
    var robotAPIs = [];
    var robotSpeeds = [];

    return {
        ids: ids,
        positionXs: positionXs,
        positionYs: positionYs,
        updateFunctions: updateFunctions,
        robotBodyImages: robotBodyImages,
        robotTurretImages: robotTurretImages,
        robotAPIs: robotAPIs,
        robotSpeeds: robotSpeeds
    };
}());
