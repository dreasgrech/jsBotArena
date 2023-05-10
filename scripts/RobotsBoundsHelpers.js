"use strict";

const RobotsBoundsHelpers = (function() {
    const boundsVisualizer_radius = 2, boundsVisualizer_color = 0xff0000;
    const turretVisualizer_radius = 2, turretVisualizer_color = 0x0000ff;
    const robotsBounds = [];
    const turretBounds = [];

    const mapToVertices = function(item) {
        return { x: item.x, y: item.y };
    };

    const drawPoint = function(graphics, points, color, radius) {

    };

    const drawPoints = function(graphics, points, color, radius) {
            graphics.clear();
            graphics.lineStyle(1, color, 1);
            graphics.fillStyle(color, 1);

            // Logger.log("total bounds", bounds.length, bounds);
            const pointsLength = points.length;
            for (let i = 0; i < pointsLength; i++) {
                const point = points[i];
                graphics.fillCircle(point.x, point.y, radius);
            }
    }

    const robotsBoundsHelpers = {
        getHullCenter: function(index) {
            const robotBodyImage = RobotsData_PhysicsBodies_robotBodyImages[index];
            return robotBodyImage.getCenter();
        },
        getHullBounds: function(index) {
            const robotBodyImage = RobotsData_PhysicsBodies_robotBodyImages[index];
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
            /*
            const gameContext = GameContextHolder.gameContext;
            const bounds = [
                gameContext.matter.bodyBounds.getTopLeft(robotBody_imageMatterBody),
                gameContext.matter.bodyBounds.getTopRight(robotBody_imageMatterBody),
                gameContext.matter.bodyBounds.getBottomRight(robotBody_imageMatterBody),
                gameContext.matter.bodyBounds.getBottomLeft(robotBody_imageMatterBody),
            ];
            */
            const bounds = robotBody_imageMatterBody.vertices.map(mapToVertices);

            return bounds;
        },
        getTurretTipPosition: function(index) {
            const robotTurretImage = RobotsData_PhysicsBodies_robotTurretImages[index];
            const turretTipPosition = robotTurretImage.getRightCenter(); // images are rotated to the right so we need the right-center point 
            return turretTipPosition;
        },
        drawHullBounds: function(index) {
            let graphics = robotsBounds[index];
            if (graphics == null) {
                const robotBodyImage = RobotsData_PhysicsBodies_robotBodyImages[index];
                graphics = GameContextHolder.gameContext.add.graphics();
                graphics.depth = robotBodyImage.depth;
                robotsBounds[index] = graphics;
            }

            const bounds = robotsBoundsHelpers.getHullBounds(index);
            drawPoints(graphics, bounds, boundsVisualizer_color, boundsVisualizer_radius);
        },
        drawTurretBounds: function(index) {
            const robotTurretImage = RobotsData_PhysicsBodies_robotTurretImages[index];

            let graphics = turretBounds[index];
            if (graphics == null) {
                graphics = GameContextHolder.gameContext.add.graphics();
                graphics.depth = robotTurretImage.depth;
                turretBounds[index] = graphics;
            }

            const originX = robotTurretImage.x;
            const originY = robotTurretImage.y;

            //const bounds = robotTurretImage.getBounds();
            const bounds = [
                    // Corners
                    robotTurretImage.getTopLeft(),
                    robotTurretImage.getTopRight(),
                    robotTurretImage.getBottomLeft(),
                    robotTurretImage.getBottomRight(),

                    // Length
                    robotTurretImage.getTopCenter(),
                    robotTurretImage.getBottomCenter(),

                    // Width
                    robotTurretImage.getLeftCenter(),
                    robotTurretImage.getRightCenter(), // Turret tip since images are rotated to the right

                    {x: originX, y: originY}
            ];

            drawPoints(graphics, bounds, turretVisualizer_color, turretVisualizer_radius);
        },
        removeRobotBoundsGraphics: function(index) {
            const hullBoundsGraphics = robotsBounds[index];
            if (hullBoundsGraphics != null) {
                hullBoundsGraphics.destroy();
            }

            const turretBoundsGraphics = turretBounds[index];
            if (turretBoundsGraphics != null) {
                turretBoundsGraphics.destroy();
            }
        }

    };

    return robotsBoundsHelpers;
}());
