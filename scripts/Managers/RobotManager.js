"use strict";

const QueuedRobotForRemoval = function() {
    return {
        //robotIndex: 0,
        destroyedTime_seconds: 0
    };
};

//const ROBOT_SCALE = 0.2;
const ROBOT_SCALE = 0.4;
//const ROBOT_SCALE = 1;

const RobotManager = (function() {
    // TODO: This value will probably eventually be set depending on some preset database values
    const STARTING_ROBOT_HEALTH = 100;
    // We wait some time before hiding the robot after it gets destroyed so that it gets hidden during the explosion animation
    const SECONDS_BETWEEN_ROBOT_MARKED_DESTROYED_AND_ACTUALLY_REMOVED = 0.5;
    const MAX_TRIES_FOR_PLACING_ROBOT_IN_ARENA = 20;

    let currentRobotIndex = -1;
    let totalRobots = 0;

    // An array of the indexes of the robots that are currently alive
    const aliveRobotsIndexes = new Set();
    let totalAliveRobots = 0;

    const queuedRobotsForRemoval = {};
    let totalQueuedRobotsForRemovals = 0;

    const placeRobotInArena = function(robotBody) {
        let attempts = 0;

        const gameWidth = GameSetup.width, gameHeight = GameSetup.height;

        do {
            // Generate new random position
            const x = Math.random() * gameWidth;
            const y = Math.random() * gameHeight;

            robotBody.setPosition(x, y);

            attempts++;
        } while (attempts < MAX_TRIES_FOR_PLACING_ROBOT_IN_ARENA && PhysicsBodiesManager.isBodyOverlappingWithOtherBodies(robotBody));

        if (attempts >= MAX_TRIES_FOR_PLACING_ROBOT_IN_ARENA) {
            Logger.error("Failed to place the robot without overlapping after", MAX_TRIES_FOR_PLACING_ROBOT_IN_ARENA, "attempts.");
        }
    };
    
    const removeAndHideRobot = function(robotIndex) {
        // Destroy the robot parts
        RobotMatterFactory.destroyRobot(robotIndex);

        // Remove the radar arc
        RobotsRadarManager.removeRadarArc(robotIndex);

        // Remove the robot bounds debug-graphics
        RobotsBoundsHelpers.removeRobotBoundsGraphics(robotIndex);

        //Logger.log("finished removing", robotIndex);
    };

    // /**
    //  * Game Options for robots
    //  * @type {{width: number, height: number}}
    //  */
    // let gameOptionsForRobots = {
    //     width: 0,
    //     height: 0,
    //     //tile
    // };
    
    const robotManager = {
        get totalRobots() { return totalRobots; },
        get aliveRobotsIndexes() { return aliveRobotsIndexes; },
        system_preloadOnce: function() {
            // Create the Tweak pane data
            const dataForTweakPane = {
                get totalRobots() {
                    return totalRobots;
                },
                get totalAliveRobots() {
                    return totalAliveRobots;
                },
                get totalQueuedRobotsForRemovals() {
                    return totalQueuedRobotsForRemovals;
                }
            };
            const tweakPaneFolderID = TweakPaneManager.createFolder("Robot Manager");
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'totalRobots');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'totalAliveRobots');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'totalQueuedRobotsForRemovals');
        },
        addRobot: function(newRobot) {
            currentRobotIndex++;
            //RobotsData_Instance_ids[currentRobotIndex] = currentRobotIndex + 1;
            RobotsData_Instance_ids[currentRobotIndex] = currentRobotIndex;
            RobotsData_Instance_names[currentRobotIndex] = newRobot.name;
            RobotsData_Instance_updateFunctions[currentRobotIndex] = newRobot.update;
            RobotsData_Instance_hullMatterGroup[currentRobotIndex] = currentRobotIndex + 1; // Important: This can never be 0 because these values are needed to be signed and 0 can't be +0 or -0

            const gameWidth = GameSetup.width, gameHeight = GameSetup.height;
            const x = gameWidth * .5, y = gameHeight * .5;

            // Call the robot's create() method
            const robotSetup = RobotSetupFactory.createRobotSetup();
            newRobot.create(robotSetup, GameSetup);

            RobotMatterFactory.createRobot({
                currentRobotIndex: currentRobotIndex,
                scale: ROBOT_SCALE,
                x: x,
                y: y,
                robotSetup: robotSetup
            });

            // Find a spot for the robot to spawn in and place it there
            placeRobotInArena(RobotsData_PhysicsBodies_robotHullGameObjects[currentRobotIndex]);

            // Set the starting data for the robot
            RobotsData_CurrentData_health[currentRobotIndex] = STARTING_ROBOT_HEALTH;
            RobotsData_CurrentData_alive[currentRobotIndex] = true;

            // Add the entry for the robot in the per-frame collisions arrays
            RobotsData_CollisionsThisFrame_robot[currentRobotIndex] = [];
            RobotsData_CollisionsThisFrame_arena[currentRobotIndex] = [];
            RobotsData_CollisionsThisFrame_projectile[currentRobotIndex] = [];

            // Create the API for the robot
            const api = RobotAPIFactory.createAPI(currentRobotIndex);
            RobotsData_Instance_robotAPIs[currentRobotIndex] = api;

            RobotsDataAPI_FrameOperations_Hull[currentRobotIndex] = 0;

            // Set the speed
            // TODO: This value will eventually be set depending on some preset database values
            // RobotsData_Instance_robotSpeeds[currentRobotIndex] = 5;
            // RobotsData_Instance_robotSpeeds[currentRobotIndex] = 15;
            RobotsData_Instance_robotSpeeds[currentRobotIndex] = 600;

            // Create the radar
            RobotsRadarManager.createRadar(currentRobotIndex);

            // Inform the UI information panel about the new robot
            UIRobotInfoPanel.add(currentRobotIndex);

            // Inform  the other objects that a new robot has been added
            ProjectileManager.onRobotAdded(currentRobotIndex);

            // Add the robot index to the collection of alive robot indexes
            aliveRobotsIndexes.add(currentRobotIndex);
            totalAliveRobots++;

            totalRobots++;

            // Execute the robot's onSpawned callback
            const onSpawned = newRobot.onSpawned;
            if (onSpawned) {
                newRobot.onSpawned(api, GameContextHolder.gameTime);
            } else {
                Logger.warn(newRobot, "doesn't have onCreate()");
            }

            //currentRobotIndex++;
        },
        update: function() {
            const time = GameContextHolder.gameTime;
            const deltaTime = GameContextHolder.deltaTime;
            
            for (let robotIndex = 0; robotIndex < totalRobots; robotIndex++) {
                const robotAlive = RobotsData_CurrentData_alive[robotIndex];
                // TODO: We can avoid this check here if we iterate over alive robots instead of all of them
                if (!robotAlive) {
                    continue;
                }
                
                const robotHullGameObject = RobotsData_PhysicsBodies_robotHullGameObjects[robotIndex];
                const robotPositionX = robotHullGameObject.x;
                const robotPositionY = robotHullGameObject.y;
                RobotsData_CurrentData_positions[robotIndex * 2 + 0] = robotPositionX;
                RobotsData_CurrentData_positions[robotIndex * 2 + 1] = robotPositionY;

                const hullAngle_degrees = robotHullGameObject.angle;
                RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex] = hullAngle_degrees;
                const hullAngle_radians = Phaser.Math.Angle.Wrap(robotHullGameObject.rotation); // It's important to wrap the angle because by default it doesn't seem to be
                RobotsData_CurrentData_currentRobotAngles_radians[robotIndex] = hullAngle_radians;
                const robotHullMatterBody = RobotsData_PhysicsBodies_robotHullMatterBodies[robotIndex];
                const robotVelocity = robotHullMatterBody.velocity;
                const robotVelocityX = robotVelocity.x;
                const robotVelocityY = robotVelocity.y;
                RobotsData_CurrentData_currentRobotVelocities[robotIndex * 2 + 0] = robotVelocityX;
                RobotsData_CurrentData_currentRobotVelocities[robotIndex * 2 + 1] = robotVelocityY;
                RobotsData_CurrentData_currentRobotSpeedSqr[robotIndex] = MathOperations.sqrMagnitude(robotVelocityX, robotVelocityY);

                const turretImage = RobotsData_PhysicsBodies_robotTurretGameObjects[robotIndex];
                const turretPositionX = turretImage.x;
                const turretPositionY = turretImage.y;
                const turretAngle_degrees = turretImage.angle;
                RobotsData_CurrentData_currentTurretAngles_degrees[robotIndex] = turretAngle_degrees;
                RobotsData_CurrentData_turretPositions[robotIndex * 2 + 0] = turretPositionX;
                RobotsData_CurrentData_turretPositions[robotIndex * 2 + 1] = turretPositionY;

                RobotMatterFactory.updateParts(robotIndex);

                RobotsRadarManager.drawRadarArc(robotIndex);

                const api = RobotsData_Instance_robotAPIs[robotIndex];

                // Set the radar scanned robots to the api
                const radar = api.radar;
                radar.scannedAliveRobots = RobotsRadarManager.scanForRobots(robotIndex);
                radar.scannedArenaElements = RobotsRadarManager.scanForArenaObstacles(robotIndex);

                // Set the robot collisions to the api
                const api_collisions = api.collisions;
                api_collisions.otherRobots = RobotsData_CollisionsThisFrame_robot[robotIndex];
                api_collisions.arena = RobotsData_CollisionsThisFrame_arena[robotIndex];
                api_collisions.projectiles = RobotsData_CollisionsThisFrame_projectile[robotIndex];

                const turret = api.turret;
                const turretFollowHull = turret.turretFollowHull;
                if (turretFollowHull) {
                    RobotOperations_Turret.setTurretAngle_degrees(robotIndex, hullAngle_degrees);
                }
                const radarFollowTurret = radar.radarFollowTurret;
                if (radarFollowTurret) {
                    RobotsRadarManager.setRadarAngle_degrees(robotIndex, turretAngle_degrees);
                }

                // Draw the bounds of the hull and turret
                if (GAME_DEBUG_MODE) {
                    RobotsBoundsHelpers.drawHullBounds(robotIndex);
                    RobotsBoundsHelpers.drawTurretBounds(robotIndex);
                }

                // Call the robot's update function
                const updateFunction = RobotsData_Instance_updateFunctions[robotIndex];
                updateFunction(api, time, deltaTime);

                // Clear the per-frame operation flags since this robot has now executed its turn
                RobotsDataAPI_FrameOperations_Hull[robotIndex] = 0;
                RobotsDataAPI_FrameOperations_Turret[robotIndex] = 0;
                RobotsDataAPI_FrameOperations_Radar[robotIndex] = 0;
            }

            // Check if there are any robots queued for removal
            if (totalQueuedRobotsForRemovals > 0) {
                // console.log("checking if there are removals", totalQueuedRobotsForRemovals, queuedRobotsForRemoval);
                for (let queuedForRemovalRobotIndex in queuedRobotsForRemoval) {
                    if (!queuedRobotsForRemoval.hasOwnProperty(queuedForRemovalRobotIndex)) {
                        continue;
                    }

                    const queuedRobotForRemoval = queuedRobotsForRemoval[queuedForRemovalRobotIndex];
                    const destroyedTime_seconds = queuedRobotForRemoval.destroyedTime_seconds;
                    const timeSinceDestroyed_seconds = GameContextHolder.gameTime - destroyedTime_seconds;
                    // Logger.log("checking if we should remove now", queuedForRemovalRobotIndex, "destroyed time:", destroyedTime_seconds, "time since destroyed ", timeSinceDestroyed_seconds);
                    if (timeSinceDestroyed_seconds > SECONDS_BETWEEN_ROBOT_MARKED_DESTROYED_AND_ACTUALLY_REMOVED) {
                        //Logger.log("removing robot", queuedForRemovalRobotIndex);
                        removeAndHideRobot(queuedForRemovalRobotIndex);
                        delete queuedRobotsForRemoval[queuedForRemovalRobotIndex];
                        totalQueuedRobotsForRemovals--;
                        continue;
                    }
                }
            }
        },
        markRobotAsDestroyed: function(robotIndex) {
            // TODO: pool this
            const queuedRobotForRemoval = QueuedRobotForRemoval();
            // queuedRobotForRemoval.robotIndex = robotIndex;
            queuedRobotForRemoval.destroyedTime_seconds = GameContextHolder.gameTime;
            // queuedRobotsForRemoval.push(queuedRobotForRemoval);
            queuedRobotsForRemoval[robotIndex] = queuedRobotForRemoval;
            totalQueuedRobotsForRemovals++;

            // Make the robot as destroyed
            RobotsData_CurrentData_alive[robotIndex] = false;

            // Remove the robot's index from the collection of aliveRobots
            aliveRobotsIndexes.delete(robotIndex);

            totalAliveRobots--;

            // Play the explosion animation
            AnimationManager.playNewAnimation(
                AnimationEffects.TankAnimationEffects.Explosion,
                RobotsData_CurrentData_positions[robotIndex * 2 + 0],
                RobotsData_CurrentData_positions[robotIndex * 2 + 1],
                -90,
                GameObjectDepths.ImpactAnimation,
                1);

            //Logger.log("marking bot for removal", robotIndex);
        },
        system_unloadLevel: function() {
            if (totalQueuedRobotsForRemovals > 0) {
                Logger.warn("totalQueuedRobotsForRemovals > 0", queuedRobotsForRemoval);
            }
            
            // Remove all the robots
            for (const robotIndex of aliveRobotsIndexes) {
                removeAndHideRobot(robotIndex);
            }

            currentRobotIndex = -1;
            totalRobots = 0;
            aliveRobotsIndexes.clear();
            totalAliveRobots = 0;
            totalQueuedRobotsForRemovals = 0;
            
            for (const prop of Object.getOwnPropertyNames(queuedRobotsForRemoval)) {
                delete queuedRobotsForRemoval[prop];
            }
        }
    };

    return robotManager;
}());

