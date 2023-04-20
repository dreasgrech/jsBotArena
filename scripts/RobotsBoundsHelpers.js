"use strict";

var RobotsBoundsHelpers = (function() {

    var obj = {
        getCenter: function(index) {
            var robotBodyImage = RobotsData.robotBodyImages[index];
            return robotBodyImage.getCenter();
        }
    };

    return obj;
}());
