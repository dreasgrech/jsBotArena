"use strict";

const RobotsBoundsHelpers = (function() {
    const boundsVisualizer_radius = 2, boundsVisualizer_color = 0xff0000;
    const robotsBounds = [];

    const mapToVertices = function(item) {
        return { x: item.x, y: item.y };
    };

    const robotsBoundsHelpers = {
        getCenter: function(index) {
            const robotBodyImage = RobotsData_PhysicsBodies.robotBodyImages[index];
            return robotBodyImage.getCenter();
        },
        getBounds: function(index) {
            const robotBodyImage = RobotsData_PhysicsBodies.robotBodyImages[index];

            const robotBody_imageMatterBody = robotBodyImage.body;
            /*
            const robotBody_imageMatterBody_bounds = robotBody_imageMatterBody.bounds;
            const bounds = [
                robotBody_imageMatterBody_bounds.min,
                robotBody_imageMatterBody_bounds.max,
            //        robotBodyImage.getTopLeft(),
            //        robotBodyImage.getTopRight(),
            //        robotBodyImage.getBottomLeft(),
            //        robotBodyImage.getBottomRight()
            ];
            */
            const bounds = robotBody_imageMatterBody.vertices.map(mapToVertices);

            return bounds;
        },
        drawBounds: function(index) {
            let graphics = robotsBounds[index];
            if (graphics == null) {
                graphics = GameContextHolder.gameContext.add.graphics();
                robotsBounds[index] = graphics;
            }

            graphics.clear();
            graphics.lineStyle(1, boundsVisualizer_color, 1);
            graphics.fillStyle(boundsVisualizer_color, 1);

            const bounds = robotsBoundsHelpers.getBounds(index);
            // Logger.log("total bounds", bounds.length, bounds);
            for (let i = 0; i < bounds.length; i++) {
                const point = bounds[i];
                graphics.fillCircle(point.x, point.y, boundsVisualizer_radius);
            }
        }
    };

    return robotsBoundsHelpers;
}());
