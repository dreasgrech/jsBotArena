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
    let currentRobotIndex = 0;
    let totalRobots = 0;

    // An array of the indexes of the robots that are currently alive
    const aliveRobotsIndexes = new Set();
    let totalAliveRobots = 0;


    // TODO: This value will probably eventually be set depending on some preset database values
    const STARTING_ROBOT_HEALTH = 100;

    const queuedRobotsForRemoval = {};
    let totalQueuedRobotsForRemovals = 0;

    // We wait some time before hiding the robot after it gets destroyed so that it gets hidden during the explosion animation
     const SECONDS_BETWEEN_ROBOT_MARKED_DESTROYED_AND_ACTUALLY_REMOVED = 0.5;
    //const SECONDS_BETWEEN_ROBOT_MARKED_DESTROYED_AND_ACTUALLY_REMOVED = 0.3;

    const placeRobotInArena = function(robotBody) {
        const maxAttempts = 10;
        let attempts = 0;

        const gameWidth = GameSetup.Width,
            gameHeight = GameSetup.Height;

        while (attempts++ < maxAttempts && PhysicsBodies.isBodyOverlappingWithArenaBodies(robotBody)) {
            // Generate new random position
            //const x = Math.random() * (GAME_WIDTH * 0.7);
            //const y = Math.random() * (GAME_HEIGHT * 0.7);
            const x = Math.random() * gameWidth;
            const y = Math.random() * gameHeight;

            robotBody.setPosition(x, y);
        }

        if (attempts >= maxAttempts) {
            Logger.error("Failed to place the robot without overlapping after", maxAttempts, "attempts.");
        }
    };

    const addRobot = function(newRobot) {
        RobotsData_Instance_ids[currentRobotIndex] = currentRobotIndex + 1;
        RobotsData_Instance_names[currentRobotIndex] = newRobot.name;
        RobotsData_Instance_updateFunctions[currentRobotIndex] = newRobot.update;

        const gameWidth = GameSetup.Width, gameHeight = GameSetup.Height;
        const x = gameWidth * .5, y = gameHeight * .5;

        // Call the robot's create() method
        const robotSetup = RobotSetupFactory.createRobotSetup();
        newRobot.create(robotSetup);

        RobotMatterFactory.createRobot({
            currentRobotIndex: currentRobotIndex,
            scale: ROBOT_SCALE,
            x: x,
            y: y,
            robotSetup: robotSetup
        });

        // Find a spot for the robot to spawn in and place it there
        placeRobotInArena(RobotsData_PhysicsBodies_robotBodyImages[currentRobotIndex]);

        // Set the starting data for the robot
        RobotsData_CurrentData_health[currentRobotIndex] = STARTING_ROBOT_HEALTH;
        RobotsData_CurrentData_alive[currentRobotIndex] = true;

        // Add the entry for the robot in the per-frame collisions arrays
        RobotsData_CurrentData_robotCollisions[currentRobotIndex] = [];
        RobotsData_CurrentData_arenaCollisions[currentRobotIndex] = [];
        RobotsData_CurrentData_projectileCollisions[currentRobotIndex] = [];

        // TODO: Create the tracks
        // const trackA = 

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
        RobotsRadar.createRadar(currentRobotIndex);

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

        currentRobotIndex++;
    };

    const update = function() {
        for (let i = 0; i < totalRobots; i++) {
            const robotAlive = RobotsData_CurrentData_alive[i];
            if (!robotAlive) {
                continue;
            }

            const robotCenterPosition = RobotsBoundsHelpers.getHullCenter(i);
            const robotPositionX = robotCenterPosition.x;
            const robotPositionY = robotCenterPosition.y;
            RobotsData_CurrentData_positionXs[i] = robotPositionX;
            RobotsData_CurrentData_positionYs[i] = robotPositionY;

            const robotBodyImage = RobotsData_PhysicsBodies_robotBodyImages[i];
            const robotBodyImagePhysicsBody = robotBodyImage.body;
            const hullAngle_degrees = robotBodyImage.angle;
            RobotsData_CurrentData_currentRobotAngles_degrees[i] = hullAngle_degrees;
            const hullAngle_radians = Phaser.Math.Angle.Wrap(robotBodyImage.rotation); // It's important to wrap the angle because by default it doesn't seem to be
            RobotsData_CurrentData_currentRobotAngles_radians[i] = hullAngle_radians;
            RobotsData_CurrentData_currentRobotVelocities[i] = robotBodyImagePhysicsBody.velocity;

            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[i];
            const turretPositionX = turretImage.x;
            const turretPositionY = turretImage.y;
            const turretAngle_degrees = turretImage.angle;
            RobotsData_CurrentData_currentTurretAngles[i] = turretAngle_degrees;
            RobotsData_CurrentData_turretPositionXs[i] = turretPositionX;
            RobotsData_CurrentData_turretPositionYs[i] = turretPositionY;

            RobotMatterFactory.updateParts(i);

            RobotsRadar.drawRadarArc(i);

            const api = RobotsData_Instance_robotAPIs[i];

            const data = api.data;
            data.positionX = robotPositionX;
            data.positionY = robotPositionY;
            data.angle_degrees = hullAngle_degrees;

            // Set the radar scanned robots to the api
            const radar = api.radar;
            // const [scannedRobots, scannedAliveRobots] = RobotsRadar.scanForRobots(i);
            const scannedAliveRobots = RobotsRadar.scanForRobots(i);
            // radar.scannedRobots = scannedRobots;
            radar.scannedAliveRobots = scannedAliveRobots;

            // Set the robot collisions to the api
            const api_collisions = api.collisions;
            api_collisions.otherRobots = RobotsData_CurrentData_robotCollisions[i];
            api_collisions.arena = RobotsData_CurrentData_arenaCollisions[i];
            api_collisions.projectiles = RobotsData_CurrentData_projectileCollisions[i];

            const turret = api.turret;
            const turretFollowHull = turret.turretFollowHull;
            if (turretFollowHull) {
                RobotOperations_Turret.setTurretAngle_degrees(i, hullAngle_degrees);
            }
            const radarFollowTurret = radar.radarFollowTurret;
            if (radarFollowTurret) {
                RobotsRadar.setRadarAngle_degrees(i, turretAngle_degrees);
            }

            // Draw the bounds of the hull and turret
            if (GAME_DEBUG_MODE) {
                RobotsBoundsHelpers.drawHullBounds(i);
                RobotsBoundsHelpers.drawTurretBounds(i);
            }

            // Call the robot's update function
            const time = GameContextHolder.gameTime;
            const deltaTime = GameContextHolder.deltaTime;
            const updateFunction = RobotsData_Instance_updateFunctions[i];
            updateFunction(api, time, deltaTime);

            // Clear the per-frame operation flags since this robot has now executed its turn
            RobotsDataAPI_FrameOperations_Hull[i] = 0;
            RobotsDataAPI_FrameOperations_Turret[i] = 0;
            RobotsDataAPI_FrameOperations_Radar[i] = 0;
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
    };

    // TODO: MOST OF THIS METHOD SHOULD GO TO ROBOTMATTERFACTORY.JS
    // TODO: MOST OF THIS METHOD SHOULD GO TO ROBOTMATTERFACTORY.JS
    // TODO: MOST OF THIS METHOD SHOULD GO TO ROBOTMATTERFACTORY.JS
    // TODO: MOST OF THIS METHOD SHOULD GO TO ROBOTMATTERFACTORY.JS
    const removeAndHideRobot = function(robotIndex) {

        // Destroy the robot parts
        RobotMatterFactory.destroyRobot(robotIndex);

        // Remove the radar arc
        RobotsRadar.removeRadarArc(robotIndex);

        // Remove the robot bounds debug-graphics
        RobotsBoundsHelpers.removeRobotBoundsGraphics(robotIndex);

        //Logger.log("finished removing", robotIndex);
    };

    const robotManager = {
        system_create: function() {
        //    GameContextHolder.gameContext.matter.world.on('afterupdate',
        //        function() {
        //            for (let i = 0; i < totalRobots; i++) {
        //                RobotMatterFactory.updateParts(i);
        //            }
        //        });
        },
        getTotalRobots: function() { return totalRobots; },
        addRobot: addRobot,
        update: update,
        // TODO: move the logic for destroyed to delayed
        markRobotAsDestroyed: function(robotIndex) {
            // TODO: needs more work

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

            AnimationManager.playNewAnimation(
                AnimationEffects.TankAnimationEffects.Explosion,
                RobotsData_CurrentData_positionXs[robotIndex],
                RobotsData_CurrentData_positionYs[robotIndex],
                -90,
                GameObjectDepths.ImpactAnimation,
                1);

            //Logger.log("marking bot for removal", robotIndex);
        }
    };

    return robotManager;
}());

