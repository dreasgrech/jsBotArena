"use strict";

const RobotsBoundsHelpers = (function() {

    const obj = {
        getCenter: function(index) {
            const robotBodyImage = RobotsData_PhysicsBodies.robotBodyImages[index];
            return robotBodyImage.getCenter();
        },
        getBounds: function(index) {
            const robotBodyImage = RobotsData_PhysicsBodies.robotBodyImages[index];

            const robotBody_imageMatterBody = robotBodyImage.body;
            const robotBody_imageMatterBody_bounds = robotBody_imageMatterBody.bounds;
            const bounds = [
                robotBody_imageMatterBody_bounds.min,
                robotBody_imageMatterBody_bounds.max,
                //    robotBodyImage.getTopLeft(),
                //    robotBodyImage.getTopRight(),
                //    robotBodyImage.getBottomLeft(),
                //    robotBodyImage.getBottomRight()
            ];

            return bounds;
        }
    };

    return obj;
}());
