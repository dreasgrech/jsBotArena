"use strict";

var RobotsBoundsHelpers = (function() {

    var obj = {
        getCenter: function(index) {
            var robotBodyImage = RobotsData_PhysicsBodies.robotBodyImages[index];
            return robotBodyImage.getCenter();
        }
    };

    return obj;
}());
