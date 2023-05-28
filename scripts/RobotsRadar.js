"use strict";

const RobotsRadar = (function() {
    const pi = Math.PI;

    const MIN_ALLOWED_RADAR_FOV_ANGLE = 1;
    const MAX_ALLOWED_RADAR_FOV_ANGLE = 45;

    const radarRotationIncrement = 120;

    const radarArcBoundingBoxes = [];
    const radarArcBoundingBoxes_graphics = [];

    let ray;

    const sortByDistanceFunction = function(a, b) {
        return a.distance - b.distance;
    };

    const isRadarEnabled = function(robotIndex) {
        const api = RobotsData_Instance_robotAPIs[robotIndex];
        const radar = api.radar;
        return radar.radarEnabled;
    };

    const scanForRobotsEmptyResult = [[], []];

    const scanForArenaObstacles = function(robotIndex) {
        const radarEnabled = isRadarEnabled(robotIndex);
        if (!radarEnabled) {
            return scanForRobotsEmptyResult;
        }

        const robotHullImage = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];
        const robotHullBody = robotHullImage.body;
        const robotHullBodyID = robotHullBody.id;
        const turretPositionX = RobotsData_CurrentData_turretPositionXs[robotIndex];
        const turretPositionY = RobotsData_CurrentData_turretPositionYs[robotIndex];
        const currentRadarAngle_degrees = RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex];

        const radarMaxScanDistance = RobotsData_Radar_radarMaxScanDistance[robotIndex];
        const radarFOVAngle_degrees = RobotsData_Radar_radarFOVAngles_degrees[robotIndex];

        const radarStartAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees - radarFOVAngle_degrees * 0.5);
        const radarEndAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees + radarFOVAngle_degrees * 0.5);

        const adjustedRadarStartAngle_radians = radarStartAngle_radians < 0 ? 2 * pi + radarStartAngle_radians : radarStartAngle_radians;
        const adjustedRadarEndAngle_radians = radarEndAngle_radians < 0 ? 2 * pi + radarEndAngle_radians : radarEndAngle_radians;

        const scannedArenaBodies = [];

        // Construct an array of the bodies for the ray to intersect with
        /*
        const bodiesToIntersectWith = [
            //robotHullBody,
            // ...PhysicsBodies.getEveryOtherArenaBodyExceptThis(arenaBodyIndex) // the ... operator expands the array into arguments for the function
            ...PhysicsBodies.getArenaBodies() // the ... operator expands the array into arguments for the function
        ];
        */
        const bodiesToIntersectWith = PhysicsBodies.getArenaBodies();

        // Calculate the coordinates of the bounding box endpoints
        const startX = turretPositionX + radarMaxScanDistance * Math.cos(radarStartAngle_radians);
        const startY = turretPositionY + radarMaxScanDistance * Math.sin(radarStartAngle_radians);
        const endX = turretPositionX + radarMaxScanDistance * Math.cos(radarEndAngle_radians);
        const endY = turretPositionY + radarMaxScanDistance * Math.sin(radarEndAngle_radians);

        // Update the bounding box
        const radarArcBoundingBox = {
            minX: Math.min(turretPositionX, startX, endX),
            minY: Math.min(turretPositionY, startY, endY),
            maxX: Math.max(turretPositionX, startX, endX),
            maxY: Math.max(turretPositionY, startY, endY)
        };
        radarArcBoundingBoxes[robotIndex] = radarArcBoundingBox;
        const arenaBodiesBoundsFromSpatialHash = PhysicsBodies.queryArenaBodiesSpatialHash(radarArcBoundingBox);
        const arenaBodiesBoundsFromSpatialHashLength = arenaBodiesBoundsFromSpatialHash.length;
        //Logger.log(arenaBodiesBoundsFromSpatialHashLength, "arena bodies found");
        for (let i = 0; i < arenaBodiesBoundsFromSpatialHashLength; i++) {
            const arenaBodyBoundsFromSpatialHash = arenaBodiesBoundsFromSpatialHash[i];
            const arenaBodyIndex = arenaBodyBoundsFromSpatialHash.arenaBodyIndex;
            // TODO: arenaBodyPositionX and arenaBodyPositionY can be preset and cached in arrays because they do not change
            const arenaBody = PhysicsBodies.getArenaBody(arenaBodyIndex);
            const arenaBodyPositionX = arenaBody.x;
            const arenaBodyPositionY = arenaBody.y;

            /*
            const distanceBetweenRobotAndArenaBody = Phaser.Math.Distance.Between(
                turretPositionX,
                turretPositionY,
                arenaBodyPositionX,
                arenaBodyPositionY);

            if (distanceBetweenRobotAndArenaBody > radarMaxScanDistance) {
                continue;
            }
            */

            let arenaObstacleFoundInRadar = false;
            let distanceBetweenRobotAndObstacle = false;
            for (const arenaObstacleCornerPoint of yieldArenaBodyBounds(arenaBodyIndex)) {
                const arenaObstacleCornerPointX = arenaObstacleCornerPoint.x;
                const arenaObstacleCornerPointY = arenaObstacleCornerPoint.y;
                // Calculate the angle between the robot and the arena obstacle point
                //console.log(arenaObstacleCornerPoint);
                const angleBetween_radians = Phaser.Math.Angle.Between(
                    turretPositionX,
                    turretPositionY,
                    arenaObstacleCornerPointX,
                    arenaObstacleCornerPointY);

                // Adjust the angle to account for Phaser's inverted y-axis
                const adjustedAngleBetween_radians = angleBetween_radians < 0 ? 2 * pi + angleBetween_radians : angleBetween_radians;

                // Check if the angle between the robot and the arena obstacle falls within the radar angles.
                // If radar angles do not cross the 0-crossover point, we use the same condition as before.
                // If radar angles cross the 0-crossover point, we modify the condition to check
                // if the adjusted angle between the robot and the arena obstacle is either greater than the start angle
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
                    // Cast the ray from the radar origin to the arena obstacle corner point
                    //const rayOriginX = arenaObstacleCornerPointX, rayOriginY = arenaObstacleCornerPointY;
                    const rayOriginX = turretPositionX, rayOriginY = turretPositionY;
                    //const ray = RaycastManager.createRay();
                    ray.setOrigin(rayOriginX, rayOriginY);
                    // const angleBetweenPoints_radians = Phaser.Math.Angle.BetweenPoints(arenaObstacleCornerPoint, { x: turretPositionX, y: turretPositionY });
                    const angleBetweenPoints_radians = Phaser.Math.Angle.BetweenPoints({ x: turretPositionX, y: turretPositionY }, arenaObstacleCornerPoint);
                    ray.setAngle(angleBetweenPoints_radians); // radians

                    //Logger.log(ray,"Checking for index", arenaBodyIndex, bodiesToIntersectWith);
                    const intersection = ray.cast({ objects: bodiesToIntersectWith });
                    //ray.destroy();
                    if (intersection) {
                        const rayHitBody = intersection.object;
                        //const rayHitBodyID = rayHitBody.id;
                        const distanceBetweenRayOriginAndIntersectionPoint = Phaser.Math.Distance.Between(
                            rayOriginX,
                            rayOriginY,
                            intersection.x,
                            intersection.y);
                        if (distanceBetweenRayOriginAndIntersectionPoint > radarMaxScanDistance) {
                            continue;
                        }

                        //console.log("distance", distanceBetweenRayOriginAndIntersectionPoint);
                        // const isHitBodyTheScanningRobot = robotHullBodyID === rayHitBodyID;
                        const isHitBodyTheArenaObstacle = rayHitBody.id === arenaBody.id;
                        //console.log(rayHitBody, arenaBody);
                        //Logger.log("hit body id", rayHitBody.id, "is a robot?", isHitBodyTheScanningRobot);
                        arenaObstacleFoundInRadar = isHitBodyTheArenaObstacle;
                        if (arenaObstacleFoundInRadar) {
                            distanceBetweenRobotAndObstacle = distanceBetweenRayOriginAndIntersectionPoint;
                            break;
                        }
                    }
                }
            }

            // Add the information that will be provided to the scanning robot about the other robot that has been detected
            if (arenaObstacleFoundInRadar) {

                const arenaObstacleScannedEventInfo = ArenaObstacleScannedInfo();
                arenaObstacleScannedEventInfo.index = arenaBodyIndex;
                // arenaObstacleScannedEventInfo.distance = distanceBetweenRobotAndArenaBody;
                arenaObstacleScannedEventInfo.distance = distanceBetweenRobotAndObstacle;
                arenaObstacleScannedEventInfo.positionX = arenaBodyPositionX;
                arenaObstacleScannedEventInfo.positionY = arenaBodyPositionY;
                arenaObstacleScannedEventInfo.bearing_degrees = AngleOperations.getBearing_degrees(turretPositionX, turretPositionY, arenaBodyPositionX, arenaBodyPositionY);

                scannedArenaBodies.push(arenaObstacleScannedEventInfo);
            }
        }

        scannedArenaBodies.sort(sortByDistanceFunction);
        return scannedArenaBodies;
    };

    const yieldArenaBodyBounds = function* (arenaBodyIndex) {
        const arenaBody = PhysicsBodies.getArenaBody(arenaBodyIndex);
        const arenaBodyBounds = arenaBody.bounds;
        const arenaBodyPosition = arenaBody.position;
        const arenaBodyPositionX = arenaBodyPosition.x;
        const arenaBodyPositionY = arenaBodyPosition.y;
        const halfWidth = (arenaBodyBounds.max.x - arenaBodyBounds.min.x) * 0.5;
        const halfHeight = (arenaBodyBounds.max.y - arenaBodyBounds.min.y) * 0.5;

        //yield { x: arenaBodyPositionX , y: arenaBodyPositionY };
        yield { x: arenaBodyPositionX - halfWidth, y: arenaBodyPositionY - halfHeight }; // top left
        yield { x: arenaBodyPositionX + halfWidth, y: arenaBodyPositionY - halfHeight }; // top right
        yield { x: arenaBodyPositionX - halfWidth, y: arenaBodyPositionY + halfHeight }; // bottom left
        yield { x: arenaBodyPositionX + halfWidth, y: arenaBodyPositionY + halfHeight }; // bottom right
    }

    const scanForRobots = function(robotIndex) {
        const radarEnabled = isRadarEnabled(robotIndex);
        if (!radarEnabled) {
            return scanForRobotsEmptyResult;
        }

        const robotHullImage = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];
        const robotHullBody = robotHullImage.body;
        const robotHullBodyID = robotHullBody.id;
        const turretPositionX = RobotsData_CurrentData_turretPositionXs[robotIndex];
        const turretPositionY = RobotsData_CurrentData_turretPositionYs[robotIndex];
        const currentRadarAngle_degrees = RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex];

        const radarMaxScanDistance = RobotsData_Radar_radarMaxScanDistance[robotIndex];
        const radarFOVAngle_degrees = RobotsData_Radar_radarFOVAngles_degrees[robotIndex];

        const radarStartAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees - radarFOVAngle_degrees * 0.5);
        const radarEndAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees + radarFOVAngle_degrees * 0.5);

        const adjustedRadarStartAngle_radians = radarStartAngle_radians < 0 ? 2 * pi + radarStartAngle_radians : radarStartAngle_radians;
        const adjustedRadarEndAngle_radians = radarEndAngle_radians < 0 ? 2 * pi + radarEndAngle_radians : radarEndAngle_radians;

         const scannedRobots = [];

        // Construct an array of the bodies for the ray to intersect with
        const bodiesToIntersectWith = [
            robotHullBody,
            ...PhysicsBodies.getArenaBodies() // the ... operator expands the array into arguments for the function
        ];

        //Logger.log("Scanning for robots", robotIndex, bodiesToIntersectWith);

        // TODO: Continue here
        // TODO: Continue here
        // TODO: Continue here
        //Logger.log(arenaBodiesFromSpatialHash);

        // todo: try a spatial hash
        // Check all the alive robots
        const aliveRobotsIndexes = RobotManager.aliveRobotsIndexes;
        for (const i of aliveRobotsIndexes) {
            if (i === robotIndex) {
                continue;
            }

            // Skip destroyed robots
            const otherRobotAlive = RobotsData_CurrentData_alive[i];
            if (!otherRobotAlive) {
                continue;
            }

            const otherRobotPositionX = RobotsData_CurrentData_positionXs[i];
            const otherRobotPositionY = RobotsData_CurrentData_positionYs[i];
            const distanceBetweenRobots = Phaser.Math.Distance.Between(turretPositionX, turretPositionY, otherRobotPositionX, otherRobotPositionY);

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
                const angleBetween_radians = Phaser.Math.Angle.Between(turretPositionX, turretPositionY, otherRobotBoundsPoint.x, otherRobotBoundsPoint.y);

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
                    const angleBetweenPoints_radians = Phaser.Math.Angle.BetweenPoints(otherRobotBoundsPoint, { x: turretPositionX, y: turretPositionY });
                    ray.setAngle(angleBetweenPoints_radians); // radians

                    // Cast the ray from the scanned robot's bounds point to the scanning robot
                    const intersection = ray.cast({ objects: bodiesToIntersectWith });
                    if (intersection) {
                        const rayHitBody = intersection.object;
                        const rayHitBodyID = rayHitBody.id;
                        console.log(rayHitBodyID);
                        const isHitBodyTheScanningRobot = robotHullBodyID === rayHitBodyID;
                        //Logger.log("hit body id", rayHitBody.id, "is a robot?", isHitBodyTheScanningRobot);
                        robotFoundInRadar = isHitBodyTheScanningRobot;
                        if (robotFoundInRadar) {
                            break;
                        }
                    }
                }
            }

            // Add the information that will be provided to the scanning robot about the other robot that has been detected
            if (robotFoundInRadar) {

                const bearing_degrees = AngleOperations.getBearing_degrees(turretPositionX, turretPositionY, otherRobotPositionX, otherRobotPositionY);

                const robotScannedEventInfo = RobotScannedInfo();
                robotScannedEventInfo.index = i;
                robotScannedEventInfo.distance = distanceBetweenRobots;
                robotScannedEventInfo.positionX = otherRobotPositionX;
                robotScannedEventInfo.positionY = otherRobotPositionY;
                robotScannedEventInfo.angle_degrees = RobotsData_CurrentData_currentRobotAngles_degrees[i]; 
                robotScannedEventInfo.bearing_degrees = bearing_degrees; 
                robotScannedEventInfo.turret_angle = RobotsData_CurrentData_currentTurretAngles[i]; 
                robotScannedEventInfo.radar_angle = RobotsData_CurrentData_currentRadarAngles_degrees[i];

                scannedRobots.push(robotScannedEventInfo);
            }
        }

        scannedRobots.sort(sortByDistanceFunction);
        return scannedRobots;
    };

    const robotsRadar = {
        MIN_ALLOWED_RADAR_FOV_ANGLE: MIN_ALLOWED_RADAR_FOV_ANGLE,
        MAX_ALLOWED_RADAR_FOV_ANGLE: MAX_ALLOWED_RADAR_FOV_ANGLE,
        system_create: function() {
            ray = RaycastManager.createRay();
            //console.log(ray);
        },
        update: function() {

        },
        scanForRobots: scanForRobots,
        scanForArenaObstacles: scanForArenaObstacles,
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
            RobotsData_Radar_radarMaxScanDistance[robotIndex] = 1000;
            //RobotsData_Radar_radarMaxScanDistance[robotIndex] = 200;

            // Create a graphics object to visualize the radar arc bounding box
            if (GAME_DEBUG_MODE) {
                const radarArcBoundingBoxGraphics = new Phaser.GameObjects.Graphics(game.scene.scenes[0]);
                radarArcBoundingBoxGraphics.depth = GameObjectDepths.RobotRadarArc + 1;
                radarArcBoundingBoxes_graphics[robotIndex] = radarArcBoundingBoxGraphics;
                game.scene.scenes[0].add.existing(radarArcBoundingBoxGraphics);
            }

            // Fill the radarArcBoundingBox with initial values
            radarArcBoundingBoxes[robotIndex] = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        },
        removeRadarArc: function(robotIndex) {
            const radarGraphics = RobotsData_Radar_radarGraphics[robotIndex];
            radarGraphics.destroy();

            if (GAME_DEBUG_MODE) {
                const radarArcBoundingBoxGraphics = radarArcBoundingBoxes_graphics[robotIndex];
                radarArcBoundingBoxGraphics.destroy();
            }
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

            //const robotPositionX = RobotsData_CurrentData_positionXs[robotIndex];
            //const robotPositionY = RobotsData_CurrentData_positionYs[robotIndex];
            const turretPositionX = RobotsData_CurrentData_turretPositionXs[robotIndex];
            const turretPositionY = RobotsData_CurrentData_turretPositionYs[robotIndex];

            radarGraphics.lineStyle(1, 0x00ff00, 0.5);
            radarGraphics.fillStyle(0x00ff00, 0.2);

            radarGraphics.beginPath();
            radarGraphics.moveTo(turretPositionX, turretPositionY);
            radarGraphics.arc(turretPositionX,
                turretPositionY,
                radarMaxScanDistance,
                Phaser.Math.DegToRad(radarAngle_degrees - radarFOVAngle_degrees * 0.5),
                Phaser.Math.DegToRad(radarAngle_degrees + radarFOVAngle_degrees * 0.5));
            radarGraphics.closePath();
            radarGraphics.fillPath();
            radarGraphics.strokePath();

            /*************************/
            // Draw the bounding box around the radar arc
            if (GAME_DEBUG_MODE) {
                const radarArcBoundingBox = radarArcBoundingBoxes[robotIndex];
                const radarArcBoundingBoxGraphics = radarArcBoundingBoxes_graphics[robotIndex];
                radarArcBoundingBoxGraphics.clear();
                radarArcBoundingBoxGraphics.lineStyle(1, 0xff0000, 1); // Line style: 1 pixel wide, red, full opacity
                radarArcBoundingBoxGraphics.strokeRect(
                    radarArcBoundingBox.minX,
                    radarArcBoundingBox.minY,
                    radarArcBoundingBox.maxX - radarArcBoundingBox.minX,
                    radarArcBoundingBox.maxY - radarArcBoundingBox.minY);
            }
        }
    };

    return robotsRadar;
}());

