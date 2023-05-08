"use strict";

const RobotsRadar = (function() {
    const pi = Math.PI;

    const MIN_ALLOWED_RADAR_FOV_ANGLE = 1;
    const MAX_ALLOWED_RADAR_FOV_ANGLE = 45;

    const radarRotationIncrement = 60;

    let ray;

    const sortByDistanceFunction = function(a, b) {
        return a.distanceBetweenRobots - b.distanceBetweenRobots;
    };

    const isRadarEnabled = function(robotIndex) {
        const api = RobotsData_Instance_robotAPIs[robotIndex];
        const radar = api.radar;
        return radar.radarEnabled;
    };

    const scanForRobotsEmptyResult = [[], []];

    const scanForRobots = function(robotIndex) {
        const radarEnabled = isRadarEnabled(robotIndex);
        if (!radarEnabled) {
            return scanForRobotsEmptyResult;
        }
        const robotHullImage = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];
        const robotHullBody = robotHullImage.body;
        const robotHullBodyID = robotHullBody.id;
        const robotPositionX = RobotsData_CurrentData_positionXs[robotIndex];
        const robotPositionY = RobotsData_CurrentData_positionYs[robotIndex];
        const currentRadarAngle_degrees = RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex];

        const radarMaxScanDistance = RobotsData_Radar_radarMaxScanDistance[robotIndex];
        const radarFOVAngle_degrees = RobotsData_Radar_radarFOVAngles_degrees[robotIndex];

        const radarStartAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees - radarFOVAngle_degrees * 0.5);
        const radarEndAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees + radarFOVAngle_degrees * 0.5);

        const adjustedRadarStartAngle_radians = radarStartAngle_radians < 0 ? 2 * pi + radarStartAngle_radians : radarStartAngle_radians;
        const adjustedRadarEndAngle_radians = radarEndAngle_radians < 0 ? 2 * pi + radarEndAngle_radians : radarEndAngle_radians;

        const scannedRobots = [];
        const scannedAliveRobots = [];

        // Construct an array of the bodies for the ray to intersect with
        const bodiesToIntersectWith = [
            robotHullBody,
            ...PhysicsBodies.getArenaBodies() // the ... operator expands the array into arguments for the function
        ];

        // todo: try a spatial hash
        // Check all the robots
        const totalRobots = RobotManager.getTotalRobots();
        for (let i = 0; i < totalRobots; i++) {
            if (i === robotIndex) {
                continue;
            }

            const otherRobotPositionX = RobotsData_CurrentData_positionXs[i];
            const otherRobotPositionY = RobotsData_CurrentData_positionYs[i];
            const distanceBetweenRobots = Phaser.Math.Distance.Between(robotPositionX, robotPositionY, otherRobotPositionX, otherRobotPositionY);

            if (distanceBetweenRobots > radarMaxScanDistance) {
                continue;
            }

            let robotFoundInRadar = false;

            // Check each of this other robot's bounds points to see if they're in the radar
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
                    const rayOriginX = otherRobotBoundsPoint.x, rayOriginY = otherRobotBoundsPoint.y;
                    ray.setOrigin(rayOriginX, rayOriginY);
                    const angleBetweenPoints_radians = Phaser.Math.Angle.BetweenPoints(otherRobotBoundsPoint, { x: robotPositionX, y: robotPositionY });
                    ray.setAngle(angleBetweenPoints_radians); // radians

                    // Cast the ray from the scanned robot's bounds point to the scanning robot
                    const intersection = ray.cast({ objects: bodiesToIntersectWith });
                    if (intersection) {
                        const rayHitBody = intersection.object;
                        const rayHitBodyID = rayHitBody.id;
                        const isHitBodyTheScanningRobot = robotHullBodyID === rayHitBodyID;
                        //Logger.log("hit body id", rayHitBody.id, "is a robot?", isHitBodyTheScanningRobot);
                        robotFoundInRadar = isHitBodyTheScanningRobot;
                        if (robotFoundInRadar) {
                            break;
                        }
                    }

                    //robotFoundInRadar = true;
                    //break;
                }
            }

            // Add the information that will be provided to the scanning robot about the other robot that has been detected
            if (robotFoundInRadar) {

                const bearingRadians = Phaser.Math.Angle.Between(robotPositionX, robotPositionY, otherRobotPositionX, otherRobotPositionY);
                const bearingDegrees = Phaser.Math.RadToDeg(bearingRadians);
                const bearing_degrees = AngleOperations.normalizeAngleDegrees(bearingDegrees);

                const robotScannedEventInfo = RobotScannedInfo();
                robotScannedEventInfo.index = i;
                robotScannedEventInfo.distanceBetweenRobots = distanceBetweenRobots;
                robotScannedEventInfo.positionX = otherRobotPositionX;
                robotScannedEventInfo.positionY = otherRobotPositionY;
                robotScannedEventInfo.angle_degrees = RobotsData_CurrentData_currentRobotAngles_degrees[i]; // the angle in degrees of the scanned robo;
                robotScannedEventInfo.bearing_degrees = bearing_degrees; // the angle in degrees that the scanning robot needs to rotate to to face the scanned robo;
                robotScannedEventInfo.alive = RobotsData_CurrentData_alive[i];

                //const robotScannedEventInfo = {
                //    index: i,
                //    distanceBetweenRobots: distanceBetweenRobots,
                //    positionX: otherRobotPositionX,
                //    positionY: otherRobotPositionY,
                //    angle_degrees: RobotsData_CurrentData_currentRobotAngles_degrees[i], // the angle in degrees of the scanned robot
                //    bearing_degrees:bearing_degrees, // the angle in degrees that the scanning robot needs to rotate to to face the scanned robot
                //    alive: RobotsData_CurrentData_alive[i]
                //};

                scannedRobots.push(robotScannedEventInfo);
                const scannedRobotAlive = RobotsData_CurrentData_alive[i];
                if (scannedRobotAlive) {
                    scannedAliveRobots.push(robotScannedEventInfo);
                }
            }
        }

        scannedRobots.sort(sortByDistanceFunction);
        scannedAliveRobots.sort(sortByDistanceFunction);

        // return scannedRobots;
        return [scannedRobots, scannedAliveRobots];
    };

    const robotsRadar = {
        MIN_ALLOWED_RADAR_FOV_ANGLE: MIN_ALLOWED_RADAR_FOV_ANGLE,
        MAX_ALLOWED_RADAR_FOV_ANGLE: MAX_ALLOWED_RADAR_FOV_ANGLE,
        system_create: function() {
            ray = RaycastManager.createRay();
            console.log(ray);
        },
        scanForRobots: scanForRobots,
        setRadarAngle_degrees: function(robotIndex, angle_degrees) {
            return RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex] = AngleOperations.normalizeAngleDegrees(angle_degrees);
        },
        rotateRadar: function(robotIndex, direction) {
            const currentRadarAngle_degrees = RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex];
            const multiplier = radarRotationIncrement * direction * GameContextHolder.deltaTime;
            const newRadarAngle_degrees = AngleOperations.incrementAngle_degrees(currentRadarAngle_degrees, multiplier);
            //const newRadarAngle_degrees = AngleOperations.lerp_incrementAngle_degrees(currentRadarAngle_degrees, multiplier);
            return robotsRadar.setRadarAngle_degrees(robotIndex, newRadarAngle_degrees);
        },
        setRadarFOVAngle_degrees: function(robotIndex, angle_degrees) {
            return RobotsData_Radar_radarFOVAngles_degrees[robotIndex] = MathOperations.clampBetween(angle_degrees, MIN_ALLOWED_RADAR_FOV_ANGLE, MAX_ALLOWED_RADAR_FOV_ANGLE);
        },
        createRadar: function(robotIndex) {
            const game = GameContextHolder.game;

            const radarGraphics = new Phaser.GameObjects.Graphics(game.scene.scenes[0]);
            radarGraphics.depth = GameObjectDepths.RobotRadarArc;
            game.scene.scenes[0].add.existing(radarGraphics);

            RobotsData_Radar_radarGraphics[robotIndex] = radarGraphics;
            RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex] = 0;
            //RobotsData_Radar.radarFOVAngles_degrees[robotIndex] = 5;
            RobotsData_Radar_radarFOVAngles_degrees[robotIndex] = 45;
            // RobotsData_Radar.radarMaxScanDistance[index] = 200;
            RobotsData_Radar_radarMaxScanDistance[robotIndex] = 1000;
        },
        drawRadarArc: function(robotIndex) {
            const radarGraphics = RobotsData_Radar_radarGraphics[robotIndex];
            radarGraphics.clear();

            // Don't draw the radar arc is the radar is not enabled
            const radarEnabled = isRadarEnabled(robotIndex);
            if (!radarEnabled) {
                return;
            }

            // Make sure the robot's still alive before drawing the radar
            const robotAlive = RobotsData_CurrentData_alive[robotIndex];
            if (!robotAlive) {
                return;
            }

            const radarFOVAngle_degrees = RobotsData_Radar_radarFOVAngles_degrees[robotIndex];
            const radarMaxScanDistance = RobotsData_Radar_radarMaxScanDistance[robotIndex];
            const radarAngle_degrees = RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex];

            const robotPositionX = RobotsData_CurrentData_positionXs[robotIndex];
            const robotPositionY = RobotsData_CurrentData_positionYs[robotIndex];

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

