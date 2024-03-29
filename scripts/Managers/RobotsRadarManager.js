"use strict";

const RobotsRadarManager = (function() {
    const PI = Math.PI;

    const DEFAULT_RADAR_FOV_ANGLES_DEGREES = 45;
    const DEFAULT_RADAR_FOV_ANGLES_RADIANS = Phaser.Math.DegToRad(DEFAULT_RADAR_FOV_ANGLES_DEGREES);
    const DEFAULT_RADAR_MAX_SCAN_DISTANCE = 1000;
    //const DEFAULT_RADAR_MAX_SCAN_DISTANCE = 200;

    const MIN_ALLOWED_RADAR_FOV_ANGLE = 1;
    const MAX_ALLOWED_RADAR_FOV_ANGLE = 45;

    // const RADAR_ROTATION_INCREMENT = 120;
    const RADAR_ROTATION_INCREMENT_RADIANS  = 120 * Math.PI / 180; // Convert to radians

    /**
     * Holds each robot's arena obstacle scanned info
     * @type {ArenaObstacleScannedInfo[][]}
     */
    const RobotsData_ArenaObstaclesScannedInfos = [];

    const radarArcBoundingBoxes = [];
    // const radarArcBoundingBoxes_flat = [];
    const radarArcBoundingBoxes_graphics = [];

    /**The ray that's used for all the radar work */
    let ray;
    let coneRay;

    const RobotsData_Radar_radarGraphics = [];
    const RobotsData_Radar_radarFOVAngles_degrees = [];
    const RobotsData_Radar_radarFOVAngles_radians = [];
    const RobotsData_Radar_radarMaxScanDistance = [];
    
    const scanForRobotsEmptyResult = [[], []];
    
    const dataForRaycast = {objects: null};

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
    
    const scanForArenaObstacles = function(robotIndex) {
        const radarEnabled = isRadarEnabled(robotIndex);
        if (!radarEnabled) {
            return scanForRobotsEmptyResult;
        }

        const turretPositionX = RobotsData_CurrentData_turretPositions[robotIndex * 2 + 0];
        const turretPositionY = RobotsData_CurrentData_turretPositions[robotIndex * 2 + 1];
        const currentRadarAngle_radians = RobotsData_CurrentData_currentRadarAngles_radians[robotIndex];

        const radarMaxScanDistance = RobotsData_Radar_radarMaxScanDistance[robotIndex];
        const radarFOVAngle_radians = RobotsData_Radar_radarFOVAngles_radians[robotIndex];

        const radarStartAngle_radians = currentRadarAngle_radians - radarFOVAngle_radians * 0.5;
        const radarEndAngle_radians = currentRadarAngle_radians + radarFOVAngle_radians * 0.5;

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
        
        // dataForRaycast.objects = PhysicsBodiesManager.getStaticArenaBodies();
        dataForRaycast.objects = PhysicsBodiesManager.staticArenaBodies;

        /**
         * Holds the 
         * @type {ArenaObstacleScannedInfo[]}
         */
        const arenaObstaclesScannedInfo = RobotsData_ArenaObstaclesScannedInfos[robotIndex];
        arenaObstaclesScannedInfo.length = 0;

        /*
        coneRay.setOrigin(turretPositionX, turretPositionY);
        coneRay.setAngle(currentRadarAngle_radians); // radians
        coneRay.setCone(radarFOVAngle_radians); // radians
        coneRay.detectionRange = radarMaxScanDistance;
        //coneRay.range = radarMaxScanDistance;
        const coneIntersections = coneRay.castCone(dataForRaycast);
        const coneIntersectionsLength = coneIntersections.length;
        for (let i = 0; i < coneIntersectionsLength; i++) {
            const coneIntersection = coneIntersections[i];
            const intersectionObject = coneIntersection.object;
            
        }
        if (coneIntersections.length){
            //Logger.log(coneIntersections);
        }
        */
        
        // Calculate the coordinates of the bounding box endpoints
        const startX = turretPositionX + radarMaxScanDistance * Math.cos(radarStartAngle_radians);
        const startY = turretPositionY + radarMaxScanDistance * Math.sin(radarStartAngle_radians);
        const endX = turretPositionX + radarMaxScanDistance * Math.cos(radarEndAngle_radians);
        const endY = turretPositionY + radarMaxScanDistance * Math.sin(radarEndAngle_radians);

        // Update the bounding box
        const minX = Math.min(turretPositionX, startX, endX);
        const minY = Math.min(turretPositionY, startY, endY);
        const maxX = Math.max(turretPositionX, startX, endX);
        const maxY = Math.max(turretPositionY, startY, endY);
        // TODO: Instead of storing an object, store each number in the flat array 
        // TODO: sequentially and then use the index to access the values.
        // TODO: Problem is, the rbush spatial hash requires a bounding box object when calling search()...so, fuck.
        const radarArcBoundingBox = radarArcBoundingBoxes[robotIndex];
        radarArcBoundingBox.minX = minX;
        radarArcBoundingBox.minY = minY;
        radarArcBoundingBox.maxX = maxX;
        radarArcBoundingBox.maxY = maxY;

        // radarArcBoundingBoxes_flat[robotIndex * 4 + 0] = minX;
        // radarArcBoundingBoxes_flat[robotIndex * 4 + 1] = minY;
        // radarArcBoundingBoxes_flat[robotIndex * 4 + 2] = maxX;
        // radarArcBoundingBoxes_flat[robotIndex * 4 + 3] = maxY;

        // Query the spatial hash for all the arena bodies in the radar's AABB
        const arenaBodiesBoundsFromSpatialHash = PhysicsBodiesManager.queryArenaBodiesSpatialHash(radarArcBoundingBox);
        const arenaBodiesBoundsFromSpatialHashLength = arenaBodiesBoundsFromSpatialHash.length;
        //Logger.log(arenaBodiesBoundsFromSpatialHashLength, "arena bodies found");
        
        // Go through each arena body in the spatial hash
        for (let i = 0; i < arenaBodiesBoundsFromSpatialHashLength; i++) {
            const arenaBodyBoundsFromSpatialHash = arenaBodiesBoundsFromSpatialHash[i];
            const arenaBodyIndex = arenaBodyBoundsFromSpatialHash.arenaBodyIndex;
            const arenaBodyID = arenaStaticObstacleBodiesIDs[arenaBodyIndex];

            let arenaObstacleFoundInRadar = false;
            let distanceBetweenRobotAndObstacle = 0;
            // Check each point in the arena obstacle's bounds to determine whether this arena obstacle is truly in the radar's field-of-view
            const boundsPointIndex = arenaBodyIndex * ARENA_STATIC_OBSTACLES_TOTAL_POINTS_PER_BOUNDS;
            
            // Go through each corner point of the arena obstacle's bounding box
            for (let boundsPointNumber = 0; boundsPointNumber < ARENA_STATIC_OBSTACLES_TOTAL_POINTS_PER_BOUNDS; boundsPointNumber+=2) {
                const arenaObstacleCornerPointX = arenaStaticObstacleBodiesBounds[boundsPointIndex + boundsPointNumber];
                const arenaObstacleCornerPointY = arenaStaticObstacleBodiesBounds[boundsPointIndex + boundsPointNumber + 1];
                
                // Calculate the angle in radians between the robot and the arena obstacle point
                const angleBetweenCornerPointAndTurret_radians = Math.atan2(arenaObstacleCornerPointY - turretPositionY, arenaObstacleCornerPointX - turretPositionX );

                // Adjust the angle to account for Phaser's inverted y-axis
                const adjustedAngleBetweenCornerPointAndTurret_radians = angleBetweenCornerPointAndTurret_radians < 0 ? 2 * PI + angleBetweenCornerPointAndTurret_radians : angleBetweenCornerPointAndTurret_radians;

                // Check if the angle between the robot and the arena obstacle falls within the radar angles.
                // If radar angles do not cross the 0-crossover point, we use the same condition as before.
                // If radar angles cross the 0-crossover point, we modify the condition to check
                // if the adjusted angle between the robot and the arena obstacle is either greater than the start angle
                // or less than the end angle.
                let pointWithinRadarAngles = false;

                // Check if the radar angles cross the 0-crossover point or not
                if (adjustedRadarStartAngle_radians <= adjustedRadarEndAngle_radians) {
                    // If they don't cross the 0-crossover point, check if the angle between robots is within the radar range
                    pointWithinRadarAngles = adjustedAngleBetweenCornerPointAndTurret_radians >= adjustedRadarStartAngle_radians && adjustedAngleBetweenCornerPointAndTurret_radians <= adjustedRadarEndAngle_radians;
                } else {
                    // If they cross the 0-crossover point, check if the angle between robots is within the radar range
                    pointWithinRadarAngles = adjustedAngleBetweenCornerPointAndTurret_radians >= adjustedRadarStartAngle_radians || adjustedAngleBetweenCornerPointAndTurret_radians <= adjustedRadarEndAngle_radians;
                }

                if (pointWithinRadarAngles) {
                    // Cast the ray from the radar origin to the arena obstacle corner point
                    //const rayOriginX = arenaObstacleCornerPointX, rayOriginY = arenaObstacleCornerPointY;
                    const rayOriginX = turretPositionX, rayOriginY = turretPositionY;
                    //const ray = RaycastManager.createRay();
                    ray.setOrigin(rayOriginX, rayOriginY);
                    // Calculate the angle in radians between the radar origin and the obstacle corner point
                    // const angleBetweenPoints_radians = Math.atan2(arenaObstacleCornerPointY - turretPositionY, arenaObstacleCornerPointX - turretPositionX);
                    // ray.setAngle(angleBetweenPoints_radians); // radians
                    ray.setAngle(angleBetweenCornerPointAndTurret_radians); // radians

                    //Logger.log(ray,"Checking for index", arenaBodyIndex, bodiesToIntersectWith);
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

        const robotHullBody = RobotsData_PhysicsBodies_robotHullMatterBodies[robotIndex];
        const robotHullBodyID = RobotsData_PhysicsBodies_robotHullMatterBodyIDs[robotIndex];
        const radarOriginX = RobotsData_CurrentData_turretPositions[robotIndex * 2 + 0];
        const radarOriginY = RobotsData_CurrentData_turretPositions[robotIndex * 2 + 1];
        const currentRadarAngle_radians = RobotsData_CurrentData_currentRadarAngles_radians[robotIndex];

        const radarMaxScanDistance = RobotsData_Radar_radarMaxScanDistance[robotIndex];
        const radarFOVAngle_radians = RobotsData_Radar_radarFOVAngles_radians[robotIndex];

        const radarStartAngle_radians = currentRadarAngle_radians - radarFOVAngle_radians * 0.5;
        const radarEndAngle_radians = currentRadarAngle_radians + radarFOVAngle_radians * 0.5;

        const adjustedRadarStartAngle_radians = radarStartAngle_radians < 0 ? 2 * PI + radarStartAngle_radians : radarStartAngle_radians;
        const adjustedRadarEndAngle_radians = radarEndAngle_radians < 0 ? 2 * PI + radarEndAngle_radians : radarEndAngle_radians;

        const scannedRobotsInfo = [];

        // Construct an array of the bodies for the ray to intersect with
        const bodiesToIntersectWith = [
            robotHullBody,
            // ...PhysicsBodiesManager.staticArenaBodies // the ... operator expands the array into arguments for the function
            ...PhysicsBodiesManager.radarBlockingArenaBodies // the ... operator expands the array into arguments for the function
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

            const otherRobotPositionX = RobotsData_CurrentData_positions[otherRobotIndex * 2 + 0];
            const otherRobotPositionY = RobotsData_CurrentData_positions[otherRobotIndex * 2 + 1];
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
                ray.setOrigin(otherRobotBoundsPointX, otherRobotBoundsPointY);
                
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
                robotScannedEventInfo.turret_angle = RobotsData_CurrentData_currentTurretAngles_degrees[otherRobotIndex]; 
                robotScannedEventInfo.radar_angle = RobotsData_CurrentData_currentRadarAngles_degrees[otherRobotIndex];

                scannedRobotsInfo.push(robotScannedEventInfo);
            }
        }

        scannedRobotsInfo.sort(sortByDistanceFunction);
        return scannedRobotsInfo;
    };

    const robotsRadar = {
        system_afterPreloadOnce: function() {
            ray = RaycastManager.createRay();
            coneRay = RaycastManager.createRay();
            //console.log(ray);
        },
        update: function() { },
        scanForRobots: scanForRobots,
        scanForArenaObstacles: scanForArenaObstacles,
        setRadarAngle_degrees: function(robotIndex, angle_degrees) {
            const normalizedAngle_degrees = AngleOperations.normalizeAngle_degrees(angle_degrees);
            const normalizedAngle_radians = Phaser.Math.DegToRad(normalizedAngle_degrees);
            RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex] = normalizedAngle_degrees;
            RobotsData_CurrentData_currentRadarAngles_radians[robotIndex] = normalizedAngle_radians;
            return normalizedAngle_degrees;
        },
        setRadarAngle_radians: function(robotIndex, angle_radians) {
            const normalizedAngle_radians = AngleOperations.normalizeAngle_radians(angle_radians);
            const normalizedAngle_degrees = Phaser.Math.RadToDeg(normalizedAngle_radians);
            RobotsData_CurrentData_currentRadarAngles_radians[robotIndex] = normalizedAngle_radians;
            RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex] = normalizedAngle_degrees;
            return normalizedAngle_radians;
        },
        // rotateRadar: function(robotIndex, direction) {
        //     const currentRadarAngle_degrees = RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex];
        //     const multiplier = RADAR_ROTATION_INCREMENT * direction * GameContextHolder.deltaTime;
        //     const newRadarAngle_degrees = AngleOperations.incrementAngle_degrees(currentRadarAngle_degrees, multiplier);
        //     //const newRadarAngle_degrees = AngleOperations.lerp_incrementAngle_degrees(currentRadarAngle_degrees, multiplier);
        //     return robotsRadar.setRadarAngle_degrees(robotIndex, newRadarAngle_degrees);
        // },
        rotateRadar: function(robotIndex, direction) {
            const currentRadarAngle_radians = RobotsData_CurrentData_currentRadarAngles_radians[robotIndex];
            const multiplier = RADAR_ROTATION_INCREMENT_RADIANS * direction * GameContextHolder.deltaTime;
            const newRadarAngle_radians = AngleOperations.incrementAngle_radians(currentRadarAngle_radians, multiplier);
            return robotsRadar.setRadarAngle_radians(robotIndex, newRadarAngle_radians);
        },
        setRadarFOVAngle_degrees: function(robotIndex, angle_degrees) {
            const normalizedAngle_degrees = AngleOperations.normalizeAngle_degrees(MathOperations.clampBetween(angle_degrees, MIN_ALLOWED_RADAR_FOV_ANGLE, MAX_ALLOWED_RADAR_FOV_ANGLE));
            const normalizedAngle_radians = Phaser.Math.DegToRad(normalizedAngle_degrees);
            RobotsData_Radar_radarFOVAngles_degrees[robotIndex] = normalizedAngle_degrees;
            RobotsData_Radar_radarFOVAngles_radians[robotIndex] = normalizedAngle_radians;
            return normalizedAngle_degrees;
            // return RobotsData_Radar_radarFOVAngles_degrees[robotIndex] = MathOperations.clampBetween(angle_degrees, MIN_ALLOWED_RADAR_FOV_ANGLE, MAX_ALLOWED_RADAR_FOV_ANGLE);
        },
        createRadar: function(robotIndex) {
            const scene = GameContextHolder.scene;

            const radarGraphics = new Phaser.GameObjects.Graphics(scene);
            radarGraphics.depth = GameObjectDepths.RobotRadarArc;
            scene.add.existing(radarGraphics);

            RobotsData_Radar_radarGraphics[robotIndex] = radarGraphics;
            RobotsData_CurrentData_currentRadarAngles_degrees[robotIndex] = 0;
            RobotsData_CurrentData_currentRadarAngles_radians[robotIndex] = 0;
            RobotsData_Radar_radarFOVAngles_degrees[robotIndex] = DEFAULT_RADAR_FOV_ANGLES_DEGREES;
            RobotsData_Radar_radarFOVAngles_radians[robotIndex] = DEFAULT_RADAR_FOV_ANGLES_RADIANS;
            RobotsData_Radar_radarMaxScanDistance[robotIndex] = DEFAULT_RADAR_MAX_SCAN_DISTANCE;

            // Create a graphics object to visualize the radar arc bounding box
            if (GAME_DEBUG_MODE) {
                const radarArcBoundingBoxGraphics = new Phaser.GameObjects.Graphics(scene);
                radarArcBoundingBoxGraphics.depth = GameObjectDepths.RobotRadarArc + 1;
                radarArcBoundingBoxes_graphics[robotIndex] = radarArcBoundingBoxGraphics;
                scene.add.existing(radarArcBoundingBoxGraphics);
            }

            // Fill the radarArcBoundingBox with initial values
            // Andreas: The bounding boxes are currently stored as objects because the spatial hash requires a 
            //          bounds object to be passed 
            radarArcBoundingBoxes[robotIndex] = { minX: 0, minY: 0, maxX: 0, maxY: 0 };
            // radarArcBoundingBoxes_flat[robotIndex * 4 + 0] = 0;
            // radarArcBoundingBoxes_flat[robotIndex * 4 + 1] = 0;
            // radarArcBoundingBoxes_flat[robotIndex * 4 + 2] = 0;
            // radarArcBoundingBoxes_flat[robotIndex * 4 + 3] = 0;
            
            RobotsData_ArenaObstaclesScannedInfos[robotIndex] = [];
        },
        removeRobotData: function(robotIndex) {
            // Destroy the radar arc graphics
            const radarGraphics = RobotsData_Radar_radarGraphics[robotIndex];
            radarGraphics.destroy();

            // Remove the radar bounding box
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
            const turretPositionX = RobotsData_CurrentData_turretPositions[robotIndex * 2 + 0];
            const turretPositionY = RobotsData_CurrentData_turretPositions[robotIndex * 2 + 1];

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
                const minX = radarArcBoundingBox.minX;
                const minY = radarArcBoundingBox.minY;
                const maxX = radarArcBoundingBox.maxX;
                const maxY = radarArcBoundingBox.maxY;
                
                // const minX = radarArcBoundingBoxes_flat[robotIndex * 4 + 0];
                // const minY = radarArcBoundingBoxes_flat[robotIndex * 4 + 1];
                // const maxX = radarArcBoundingBoxes_flat[robotIndex * 4 + 2];
                // const maxY = radarArcBoundingBoxes_flat[robotIndex * 4 + 3];
                
                const radarArcBoundingBoxGraphics = radarArcBoundingBoxes_graphics[robotIndex];
                radarArcBoundingBoxGraphics.clear();
                radarArcBoundingBoxGraphics.lineStyle(1, 0xff0000, 1); // Line style: 1 pixel wide, red, full opacity
                radarArcBoundingBoxGraphics.strokeRect(
                    minX,
                    minY,
                    maxX - minX,
                    maxY - minY);
            }
        },
        system_unloadLevel: function() {
            //RaycastManager.destroyRay(ray);

            // Destroy all the radar arc graphics
            const totalRobots = RobotsData_Radar_radarGraphics.length;
            for (let robotIndex = 0; robotIndex < totalRobots; robotIndex++) {
                robotsRadar.removeRobotData(robotIndex);
            }
            
            // TODO: Add asserts here to make sure everything is cleaned up

            RobotsData_Radar_radarGraphics.length = 0;
            RobotsData_Radar_radarFOVAngles_degrees.length = 0;
            RobotsData_Radar_radarFOVAngles_radians.length = 0;
            RobotsData_Radar_radarMaxScanDistance.length = 0;
        }
    };

    return robotsRadar;
}());

