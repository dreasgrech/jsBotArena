"use strict";

const RobotsRadar = (function() {
    const PI = Math.PI;

    const DEFAULT_RADAR_FOV_ANGLES = 45;
    const DEFAULT_RADAR_MAX_SCAN_DISTANCE = 1000;
    //const DEFAULT_RADAR_MAX_SCAN_DISTANCE = 200;

    const MIN_ALLOWED_RADAR_FOV_ANGLE = 1;
    const MAX_ALLOWED_RADAR_FOV_ANGLE = 45;

    const RADAR_ROTATION_INCREMENT = 120;

    const radarArcBoundingBoxes = [];
    const radarArcBoundingBoxes_graphics = [];

    /**The ray that's used for all the radar work */
    let ray;

    const RobotsData_Radar_radarGraphics = [];
    const RobotsData_Radar_radarFOVAngles_degrees = [];
    const RobotsData_Radar_radarMaxScanDistance = [];
    
    const scanForRobotsEmptyResult = [[], []];

    const sortByDistanceFunction = function(a, b) {
        return a.distance - b.distance;
    };

    // TODO: Optimize this function to resolve the radarEnabled value directly instead of resolving the
    // TODO: entire API object just to read the radar.
    const isRadarEnabled = function(robotIndex) {
        const api = RobotsData_Instance_robotAPIs[robotIndex];
        const radar = api.radar;
        return radar.radarEnabled;
    };
    
    const dataForRaycast = {objects: null};

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

        const adjustedRadarStartAngle_radians = radarStartAngle_radians < 0 ? 2 * PI + radarStartAngle_radians : radarStartAngle_radians;
        const adjustedRadarEndAngle_radians = radarEndAngle_radians < 0 ? 2 * PI + radarEndAngle_radians : radarEndAngle_radians;


        // Construct an array of the bodies for the ray to intersect with
        /*
        const bodiesToIntersectWith = [
            //robotHullBody,
            // ...PhysicsBodies.getEveryOtherArenaBodyExceptThis(arenaBodyIndex) // the ... operator expands the array into arguments for the function
            ...PhysicsBodies.getArenaBodies() // the ... operator expands the array into arguments for the function
        ];
        */
        // const bodiesToIntersectWith = PhysicsBodies.getStaticArenaBodies();
        const bodiesToIntersectWith = PhysicsBodiesManager.staticArenaBodies;

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

        /**
         * Holds the 
         * @type {ArenaObstacleScannedInfo[]}
         */
        const arenaObstaclesScannedInfo = [];

        // Query the spatial hash for all the arena bodies in the radar's AABB
        const arenaBodiesBoundsFromSpatialHash = PhysicsBodiesManager.queryArenaBodiesSpatialHash(radarArcBoundingBox);
        const arenaBodiesBoundsFromSpatialHashLength = arenaBodiesBoundsFromSpatialHash.length;
        //Logger.log(arenaBodiesBoundsFromSpatialHashLength, "arena bodies found");
        for (let i = 0; i < arenaBodiesBoundsFromSpatialHashLength; i++) {
            const arenaBodyBoundsFromSpatialHash = arenaBodiesBoundsFromSpatialHash[i];
            const arenaBodyIndex = arenaBodyBoundsFromSpatialHash.arenaBodyIndex;
            const arenaBodyID = arenaStaticObstacleBodiesIDs[arenaBodyIndex];

            let arenaObstacleFoundInRadar = false;
            let distanceBetweenRobotAndObstacle = false;
            // Check each point in the arena obstacle's bounds to determine whether this arena obstacle is truly in the radar's field-of-view
            const boundsPointIndex = arenaBodyIndex * ARENA_STATIC_OBSTACLES_TOTAL_POINTS_PER_BOUNDS;
            for (let boundsPointNumber = 0; boundsPointNumber < ARENA_STATIC_OBSTACLES_TOTAL_POINTS_PER_BOUNDS; boundsPointNumber+=2) {
                const arenaObstacleCornerPointX = arenaStaticObstacleBodiesBounds[boundsPointIndex + boundsPointNumber];
                const arenaObstacleCornerPointY = arenaStaticObstacleBodiesBounds[boundsPointIndex + boundsPointNumber + 1];
                
                // Calculate the angle in radians between the robot and the arena obstacle point
                const angleBetween_radians = Math.atan2(arenaObstacleCornerPointY - turretPositionY, arenaObstacleCornerPointX - turretPositionX );

                // Adjust the angle to account for Phaser's inverted y-axis
                const adjustedAngleBetween_radians = angleBetween_radians < 0 ? 2 * PI + angleBetween_radians : angleBetween_radians;

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
                    // Calculate the angle in radians between the radar origin and the obstacle corner point
                    const angleBetweenPoints_radians = Math.atan2(arenaObstacleCornerPointY - turretPositionY, arenaObstacleCornerPointX - turretPositionX);
                    ray.setAngle(angleBetweenPoints_radians); // radians

                    //Logger.log(ray,"Checking for index", arenaBodyIndex, bodiesToIntersectWith);
                    dataForRaycast.objects = bodiesToIntersectWith;
                    const intersection = ray.cast(dataForRaycast);
                    //ray.destroy();
                    if (intersection) {
                        const rayHitBody = intersection.object;

                        // Make sure this point is within the radar's distance range
                        const distanceBetweenRayOriginAndIntersectionPoint = Phaser.Math.Distance.Between(rayOriginX, rayOriginY, intersection.x, intersection.y);
                        if (distanceBetweenRayOriginAndIntersectionPoint > radarMaxScanDistance) {
                            continue;
                        }

                        const isHitBodyTheArenaObstacle = rayHitBody.id === arenaBodyID;
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
                const positionIndex = arenaBodyIndex * 2;
                const arenaBodyPositionX = arenaStaticObstacleBodiesPositions[positionIndex];
                const arenaBodyPositionY = arenaStaticObstacleBodiesPositions[positionIndex + 1];
                
                const arenaObstacleScannedEventInfo = ArenaObstacleScannedInfo();
                arenaObstacleScannedEventInfo.index = arenaBodyIndex;
                // arenaObstacleScannedEventInfo.distance = distanceBetweenRobotAndArenaBody;
                arenaObstacleScannedEventInfo.distance = distanceBetweenRobotAndObstacle;
                arenaObstacleScannedEventInfo.positionX = arenaBodyPositionX;
                arenaObstacleScannedEventInfo.positionY = arenaBodyPositionY;
                arenaObstacleScannedEventInfo.bearing_degrees = AngleOperations.getBearing_degrees(turretPositionX, turretPositionY, arenaBodyPositionX, arenaBodyPositionY);

                arenaObstaclesScannedInfo.push(arenaObstacleScannedEventInfo);
            }
        }

        // Sort the event info array by the distance to the robot
        arenaObstaclesScannedInfo.sort(sortByDistanceFunction);
        
        return arenaObstaclesScannedInfo;
    };

    /**
     * Scans for any alive robots
     * @param robotIndex The robot's index
     * @returns {[]}
     */
    const scanForRobots = function(robotIndex) {
        const radarEnabled = isRadarEnabled(robotIndex);
        
        // TODO: We need to remove this if-branch because this is a hotpath
        if (!radarEnabled) {
            return scanForRobotsEmptyResult;
        }

        // TODO: Resolve robotHullBody and robotHullBody.id from an array directly instead of resolve the entire robotHullImage
        const robotHullImage = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];
        const robotHullBody = robotHullImage.body;
        const robotHullBodyID = robotHullBody.id;
        const radarOriginX = RobotsData_CurrentData_turretPositionXs[robotIndex];
        const radarOriginY = RobotsData_CurrentData_turretPositionYs[robotIndex];
        const currentRadarAngle_degrees = RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex];

        const radarMaxScanDistance = RobotsData_Radar_radarMaxScanDistance[robotIndex];
        const radarFOVAngle_degrees = RobotsData_Radar_radarFOVAngles_degrees[robotIndex];

        // TODO: Find a way to use radians directly instead of calling Phaser.Math.DegToRad() here.
        const radarStartAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees - radarFOVAngle_degrees * 0.5);
        const radarEndAngle_radians = Phaser.Math.DegToRad(currentRadarAngle_degrees + radarFOVAngle_degrees * 0.5);

        const adjustedRadarStartAngle_radians = radarStartAngle_radians < 0 ? 2 * PI + radarStartAngle_radians : radarStartAngle_radians;
        const adjustedRadarEndAngle_radians = radarEndAngle_radians < 0 ? 2 * PI + radarEndAngle_radians : radarEndAngle_radians;

        const scannedRobotsInfo = [];

        // Construct an array of the bodies for the ray to intersect with
        const bodiesToIntersectWith = [
            robotHullBody,
            ...PhysicsBodiesManager.staticArenaBodies // the ... operator expands the array into arguments for the function
        ];

        //Logger.log("Scanning for robots", robotIndex, bodiesToIntersectWith);

        // todo: try a spatial hash
        // Check all the alive robots
        const aliveRobotsIndexes = RobotManager.aliveRobotsIndexes;
        for (const otherRobotIndex of aliveRobotsIndexes) {
            if (otherRobotIndex === robotIndex) {
                continue;
            }

            // // Skip destroyed robots
            // const otherRobotAlive = RobotsData_CurrentData_alive[otherRobotIndex];
            // if (!otherRobotAlive) {
            //     continue;
            // }

            const otherRobotPositionX = RobotsData_CurrentData_positionXs[otherRobotIndex];
            const otherRobotPositionY = RobotsData_CurrentData_positionYs[otherRobotIndex];
            // TODO: Change to check against distanceSqr instead of distance to avoid the sqrt.
            // TODO: But then this distance is needed for the event info for the API.  Maybe you can sqrt down there when it's needed.
            const distanceBetweenRadarAndOtherRobot = Phaser.Math.Distance.Between(radarOriginX, radarOriginY, otherRobotPositionX, otherRobotPositionY);
            if (distanceBetweenRadarAndOtherRobot > radarMaxScanDistance) {
                continue;
            }

            let robotFoundInRadar = false;

            // Check each of this other robot's bounds points to see if they're in the radar
            const otherRobotBounds = RobotsBoundsHelpers.getHullBounds(otherRobotIndex);
            const otherRobotBoundsLength = otherRobotBounds.length;
            for (let j = 0; j < otherRobotBoundsLength; j++) {

                const otherRobotBoundsPoint = otherRobotBounds[j];
                const otherRobotBoundsPointX = otherRobotBoundsPoint.x;
                const otherRobotBoundsPointY = otherRobotBoundsPoint.y;

                // Calculate the angle between the robots
                const angleBetweenRadarAndOtherRobot_radians = Phaser.Math.Angle.Between(
                    radarOriginX, 
                    radarOriginY, 
                    otherRobotBoundsPointX, 
                    otherRobotBoundsPointY);

                // Adjust the angle to account for Phaser's inverted y-axis
                const adjustedAngleBetweenRadarAndOtherRobot_radians = angleBetweenRadarAndOtherRobot_radians < 0 ? 2 * PI + angleBetweenRadarAndOtherRobot_radians : angleBetweenRadarAndOtherRobot_radians;

                //if (robotIndex === 0) {
                //    console.log(`Robot ${robotIndex} -> Robot ${otherRobotIndex}: angleBetween=${Phaser.Math.RadToDeg(adjustedAngleBetween_radians)}�,
                //radarStart=${Phaser.Math.RadToDeg(adjustedRadarStartAngle_radians)}�,
                //radarEnd=${Phaser.Math.RadToDeg(adjustedRadarEndAngle_radians)}�`);
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
                    pointWithinRadarAngles = adjustedAngleBetweenRadarAndOtherRobot_radians >= adjustedRadarStartAngle_radians && adjustedAngleBetweenRadarAndOtherRobot_radians <= adjustedRadarEndAngle_radians;
                } else {
                    // If they cross the 0-crossover point, check if the angle between robots is within the radar range
                    pointWithinRadarAngles = adjustedAngleBetweenRadarAndOtherRobot_radians >= adjustedRadarStartAngle_radians || adjustedAngleBetweenRadarAndOtherRobot_radians <= adjustedRadarEndAngle_radians;
                }

                // Skip this point if it's not within the radar angle
                if (!pointWithinRadarAngles) {
                    continue
                }

                // The ray will be cast from the other robot's current bounds point towards our radar
                const rayOriginX = otherRobotBoundsPointX;
                const rayOriginY = otherRobotBoundsPointY;
                ray.setOrigin(rayOriginX, rayOriginY);
                
                // Calculate the angle between the other robot and the radar for casting the ray in that direction
                const rayAngle_radians = Phaser.Math.Angle.Between(
                    otherRobotBoundsPoint.x,
                    otherRobotBoundsPoint.y,
                    radarOriginX,
                    radarOriginY,
                    );
                ray.setAngle(rayAngle_radians); // radians

                // Cast the ray from the scanned robot's bounds point to the scanning robot
                dataForRaycast.objects = bodiesToIntersectWith;
                const intersection = ray.cast(dataForRaycast);
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
            }

            // Add the information that will be provided to the scanning robot about the other robot that has been detected
            if (robotFoundInRadar) {
                // TODO: Pool this
                // TODO: Or find a way to not use the object at all
                const robotScannedEventInfo = RobotScannedInfo();
                robotScannedEventInfo.index = otherRobotIndex;
                robotScannedEventInfo.distance = distanceBetweenRadarAndOtherRobot;
                robotScannedEventInfo.positionX = otherRobotPositionX;
                robotScannedEventInfo.positionY = otherRobotPositionY;
                robotScannedEventInfo.angle_degrees = RobotsData_CurrentData_currentRobotAngles_degrees[otherRobotIndex]; 
                robotScannedEventInfo.bearing_degrees = AngleOperations.getBearing_degrees(radarOriginX, radarOriginY, otherRobotPositionX, otherRobotPositionY); 
                robotScannedEventInfo.turret_angle = RobotsData_CurrentData_currentTurretAngles[otherRobotIndex]; 
                robotScannedEventInfo.radar_angle = RobotsData_CurrentData_currentRadarAngles_degrees[otherRobotIndex];

                scannedRobotsInfo.push(robotScannedEventInfo);
            }
        }

        scannedRobotsInfo.sort(sortByDistanceFunction);
        return scannedRobotsInfo;
    };

    const robotsRadar = {
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
            const multiplier = RADAR_ROTATION_INCREMENT * direction * GameContextHolder.deltaTime;
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
            RobotsData_Radar_radarFOVAngles_degrees[robotIndex] = DEFAULT_RADAR_FOV_ANGLES;
            RobotsData_Radar_radarMaxScanDistance[robotIndex] = DEFAULT_RADAR_MAX_SCAN_DISTANCE;

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
        },
        system_newRoundReset: function() {
            //RaycastManager.destroyRay(ray);

            // Destroy all the radar arc graphics
            const totalRobots = RobotsData_Radar_radarGraphics.length;
            for (let robotIndex = 0; robotIndex < totalRobots; robotIndex++) {
                const radarGraphics = RobotsData_Radar_radarGraphics[robotIndex];
                radarGraphics.destroy();

                // Remove the radar bounding box
                if (GAME_DEBUG_MODE) {
                    const radarArcBoundingBoxGraphics = radarArcBoundingBoxes_graphics[robotIndex];
                    radarArcBoundingBoxGraphics.destroy();
                }
            }

            RobotsData_Radar_radarGraphics.length = 0;
            RobotsData_Radar_radarFOVAngles_degrees.length = 0;
            RobotsData_Radar_radarMaxScanDistance.length = 0;
        }
    };

    return robotsRadar;
}());

