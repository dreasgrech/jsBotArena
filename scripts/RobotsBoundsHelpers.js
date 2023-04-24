"use strict";

const RobotsBoundsHelpers = (function() {

    const obj = {
        getCenter: function(index) {
            const robotBodyImage = RobotsData_PhysicsBodies.robotBodyImages[index];
            return robotBodyImage.getCenter();
        }
    };

    return obj;
}());
