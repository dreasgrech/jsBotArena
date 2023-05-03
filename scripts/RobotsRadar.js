"use strict";

const RobotsRadar = (function() {
    const pi = Math.PI;

    const MIN_ALLOWED_RADAR_FOV_ANGLE = 5;
    const MAX_ALLOWED_RADAR_FOV_ANGLE = 45;

    const radarRotationIncrement = 60;

    const isRadarEnabled = function(robotIndex) {
        const api = RobotsData_Instance.robotAPIs[robotIndex];
        const radar = api.radar;
        return radar.radarEnabled;
    };

    const scanForRobots = function(robotIndex) {
        const radarEnabled = isRadarEnabled(robotIndex);
        if (!radarEnabled) {
            return [];
        }

        const robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
        const robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];
        const currentRadarAngle_degrees = RobotsData_CurrentData.currentRadarAngles_degrees[robotIndex];

        const radarMaxScanDistance = RobotsData_Radar.radarMaxScanDistance[robotIndex];
        const radarFOVAngle_degrees = RobotsData_Radar.radarFOVAngles_degrees[robotIndex];

        const radarStartAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees - radarFOVAngle_degrees * 0.5);
        const radarEndAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees + radarFOVAngle_degrees * 0.5);

        const adjustedRadarStartAngle_radians = radarStartAngle_radians < 0 ? 2 * pi + radarStartAngle_radians : radarStartAngle_radians;
        const adjustedRadarEndAngle_radians = radarEndAngle_radians < 0 ? 2 * pi + radarEndAngle_radians : radarEndAngle_radians;

        const scannedRobots = [];

        // todo: try a spatial hash
        const totalRobots = RobotManager.getTotalRobots();
        for (let i = 0; i < totalRobots; i++) {
            if (i === robotIndex) {
                continue;
            }

            const otherRobotPositionX = RobotsData_CurrentData.positionXs[i];
            const otherRobotPositionY = RobotsData_CurrentData.positionYs[i];
            const distanceBetweenRobots = Phaser.Math.Distance.Between(robotPositionX, robotPositionY, otherRobotPositionX, otherRobotPositionY);

            if (distanceBetweenRobots > radarMaxScanDistance) {
                continue;
            }

            let robotFoundInRadar = false;

            const otherRobotBounds = RobotsBoundsHelpers.getHullBounds(i);
            const otherRobotBoundsLength = otherRobotBounds.length;
            for (let j = 0; j < otherRobotBoundsLength; j++) {
                const otherRobotBoundsPoint = otherRobotBounds[j];

                // Calculate the angle between the robots
                const angleBetween_radians = Phaser.Math.Angle.Between(robotPositionX, robotPositionY, otherRobotBoundsPoint.x, otherRobotBoundsPoint.y);

                // Adjust the angle to account for Phaser's inverted y-axis
                const adjustedAngleBetween_radians = angleBetween_radians < 0 ? 2 * pi + angleBetween_radians : angleBetween_radians;

                //if (robotIndex === 0) {
                //    console.log(`Robot ${robotIndex} -> Robot ${i}: angleBetween=${Phaser.Math.RadToDeg(adjustedAngleBetween_radians)}°,
                //radarStart=${Phaser.Math.RadToDeg(adjustedRadarStartAngle_radians)}°,
                //radarEnd=${Phaser.Math.RadToDeg(adjustedRadarEndAngle_radians)}°`);
                //}

                // Check if the angle between the robots falls within the radar angles.
                // If radar angles do not cross the 0-crossover point, we use the same condition as before.
                // If radar angles cross the 0-crossover point, we modify the condition to check
                // if the adjusted angle between the robots is either greater than the start angle
                // or less than the end angle.
                let pointWithinRadarAngles = false;

                // Check if the radar angles cross the 0-crossover point or not
                if (adjustedRadarStartAngle_radians <= adjustedRadarEndAngle_radians) {
                    // If they don't cross the 0-crossover point, check if the angle between robots is within the radar range
                    pointWithinRadarAngles = adjustedAngleBetween_radians >= adjustedRadarStartAngle_radians && adjustedAngleBetween_radians <= adjustedRadarEndAngle_radians;
                } else {
                    // If they cross the 0-crossover point, check if the angle between robots is within the radar range
                    pointWithinRadarAngles = adjustedAngleBetween_radians >= adjustedRadarStartAngle_radians || adjustedAngleBetween_radians <= adjustedRadarEndAngle_radians;
                }

                if (pointWithinRadarAngles) {
                    robotFoundInRadar = true;
                    break;
                }
            }

            // TODO: add more scanned info like the position of scanned point

            if (robotFoundInRadar) {
                scannedRobots.push({
                    index: i,
                    distanceBetweenRobots: distanceBetweenRobots
                });
            }
        }

        scannedRobots.sort(function(a, b) {
            return a.distanceBetweenRobots - b.distanceBetweenRobots;
        });

        if (scannedRobots > 0) {
            Logger.log(`Scanned robots:`, scannedRobots);
        }

        return scannedRobots;
    };

    const robotsRadar = {
        MIN_ALLOWED_RADAR_FOV_ANGLE: MIN_ALLOWED_RADAR_FOV_ANGLE,
        MAX_ALLOWED_RADAR_FOV_ANGLE: MAX_ALLOWED_RADAR_FOV_ANGLE,
        scanForRobots: scanForRobots,
        setRadarAngle_degrees: function(robotIndex, angle_degrees) {
            return RobotsData_CurrentData.currentRadarAngles_degrees[robotIndex] = AngleOperations.normalizeAngleDegrees(angle_degrees);
        },
        rotateRadar: function(robotIndex, direction) {
            const currentRadarAngle_degrees = RobotsData_CurrentData.currentRadarAngles_degrees[robotIndex];
            const multiplier = radarRotationIncrement * direction * GameContextHolder.deltaTime;
            return robotsRadar.setRadarAngle_degrees(robotIndex, AngleOperations.incrementAngle_degrees(currentRadarAngle_degrees, multiplier));
        },
        setRadarFOVAngle_degrees: function(robotIndex, angle_degrees) {
            return RobotsData_Radar.radarFOVAngles_degrees[robotIndex] = MathOperations.clampBetween(angle_degrees, MIN_ALLOWED_RADAR_FOV_ANGLE, MAX_ALLOWED_RADAR_FOV_ANGLE);
        },
        createRadar: function(robotIndex) {
            const game = GameContextHolder.game;

            const radarGraphics = new Phaser.GameObjects.Graphics(game.scene.scenes[0]);
            radarGraphics.depth = GameObjectDepths.RobotRadarArc;
            game.scene.scenes[0].add.existing(radarGraphics);

            RobotsData_Radar.radarGraphics[robotIndex] = radarGraphics;
            RobotsData_CurrentData.currentRadarAngles_degrees[robotIndex] = 0;
            // RobotsData_Radar.radarFOVAngles_degrees[robotIndex] = 45;
            //RobotsData_Radar.radarFOVAngles_degrees[robotIndex] = 5;
            RobotsData_Radar.radarFOVAngles_degrees[robotIndex] = 45;
            // RobotsData_Radar.radarMaxScanDistance[index] = 200;
            RobotsData_Radar.radarMaxScanDistance[robotIndex] = 1000;
        },
        drawRadarArc: function(robotIndex) {
            const radarGraphics = RobotsData_Radar.radarGraphics[robotIndex];
            radarGraphics.clear();

            // Don't draw the radar arc is the radar is not enabled
            const radarEnabled = isRadarEnabled(robotIndex);
            if (!radarEnabled) {
                return;
            }

            const radarFOVAngle_degrees = RobotsData_Radar.radarFOVAngles_degrees[robotIndex];
            const radarMaxScanDistance = RobotsData_Radar.radarMaxScanDistance[robotIndex];
            const radarAngle_degrees = RobotsData_CurrentData.currentRadarAngles_degrees[robotIndex];

            const robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            const robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];

            radarGraphics.lineStyle(1, 0x00ff00, 0.5);
            radarGraphics.fillStyle(0x00ff00, 0.2);

            radarGraphics.beginPath();
            radarGraphics.moveTo(robotPositionX, robotPositionY);
            radarGraphics.arc(robotPositionX,
                robotPositionY,
                radarMaxScanDistance,
                Phaser.Math.DegToRad(radarAngle_degrees - radarFOVAngle_degrees * 0.5),
                Phaser.Math.DegToRad(radarAngle_degrees + radarFOVAngle_degrees * 0.5));
            radarGraphics.closePath();
            radarGraphics.fillPath();
            radarGraphics.strokePath();
        }
    };

    return robotsRadar;
}());

