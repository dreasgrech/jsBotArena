"use strict";

const RobotManager = (function() {
    let currentRobotIndex = 0;
    let totalRobots = 0;

    // An array of the indexes of the robots that are currently alive
    const aliveRobotsIndexes = new Set();
    let totalAliveRobots = 0;

    const ROBOT_SCALE = 0.4;

    const constantAngularVelocityForHullRotation = 1;
    // const turretRotationPerFrameSpeed = 50;
    const turretRotationPerFrameSpeed = 130;

    // TODO: This value will probably eventually be set depending on some preset database values
    const STARTING_ROBOT_HEALTH = 100;


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

        // TODO: Create the tracks
        // const trackA = 

        // Create the API for the robot
        const api = RobotAPIFactory.createAPI(currentRobotIndex);
        RobotsData_Instance_robotAPIs[currentRobotIndex] = api;

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
            const robotCenterPosition = RobotsBoundsHelpers.getHullCenter(i);
            const robotPositionX = robotCenterPosition.x;
            const robotPositionY = robotCenterPosition.y;
            RobotsData_CurrentData_positionXs[i] = robotPositionX;
            RobotsData_CurrentData_positionYs[i] = robotPositionY;

            const robotBodyImage = RobotsData_PhysicsBodies_robotBodyImages[i];
            const robotBodyImagePhysicsBody = robotBodyImage.body;
            const hullAngle_degrees = robotBodyImage.angle;
            RobotsData_CurrentData_currentRobotAngles_degrees[i] = hullAngle_degrees;
            RobotsData_CurrentData_currentRobotVelocities[i] = robotBodyImagePhysicsBody.velocity;

            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[i];
            const turretAngle_degrees = turretImage.angle;
            RobotsData_CurrentData_currentTurretAngles[i] = turretAngle_degrees;

            RobotMatterFactory.updateParts(i);

            RobotsRadar.drawRadarArc(i);

            const api = RobotsData_Instance_robotAPIs[i];

            const data = api.data;
            data.positionX = robotPositionX;
            data.positionY = robotPositionY;
            data.angle_degrees = hullAngle_degrees;

            // Set the radar scanned robots to the api
            const radar = api.radar;
            const [scannedRobots, scannedAliveRobots] = RobotsRadar.scanForRobots(i);
            radar.scannedRobots = scannedRobots;
            radar.scannedAliveRobots = scannedAliveRobots;

            // Set the robot collisions to the api
            const api_collisions = api.collisions;
            api_collisions.otherRobots = RobotsData_CurrentData_robotCollisions[i];
            api_collisions.arena = RobotsData_CurrentData_arenaCollisions[i];

            const turret = api.turret;
            const turretFollowHull = turret.turretFollowHull;
            if (turretFollowHull) {
                robotManager.setTurretAngle_degrees(i, hullAngle_degrees);
            }
            const radarFollowTurret = radar.radarFollowTurret;
            if (radarFollowTurret) {
                RobotsRadar.setRadarAngle_degrees(i, turretAngle_degrees);
            }

            // Draw the bounds of the hull and turret
            RobotsBoundsHelpers.drawHullBounds(i);
            RobotsBoundsHelpers.drawTurretBounds(i);

            const robotAlive = RobotsData_CurrentData_alive[i];
            if (!robotAlive) {
                continue;
            }

            // Call the robot's update function
            const time = GameContextHolder.gameTime;
            const deltaTime = GameContextHolder.deltaTime;
            const updateFunction = RobotsData_Instance_updateFunctions[i];
            updateFunction(api, time, deltaTime);
        }
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
        moveHull: function(robotIndex, direction) {
            const robotBody = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];
            const robotSpeed = RobotsData_Instance_robotSpeeds[robotIndex];

            const angle_degrees = RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex];
            const angle_radians = Phaser.Math.DegToRad(angle_degrees);

            //const force = new Phaser.Math.Vector2(Math.cos(angle_radians) * robotSpeed * direction, Math.sin(angle_radians) * robotSpeed * direction);
            const multiplier = robotSpeed * direction * GameContextHolder.deltaTime;
            const force = new Phaser.Math.Vector2(
                Math.cos(angle_radians) * multiplier,
                Math.sin(angle_radians) * multiplier);
            robotBody.applyForce(force);
        },
        rotateHull: function(robotIndex, direction) {
            const angularVelocity = constantAngularVelocityForHullRotation * direction * GameContextHolder.deltaTime;
            //const angularVelocity = constantAngularVelocityForHullRotation * direction;

            const robotBody = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];
            robotBody.setAngularVelocity(angularVelocity);
            return angularVelocity;
        },
        rotateHullTowards: function(robotIndex, angle_degrees) {
            const currentAngle_degrees = RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex];
            const angleDifference_degrees = Phaser.Math.Angle.WrapDegrees(angle_degrees - currentAngle_degrees);

            // Determine the direction of rotation
            let direction;
            if (angleDifference_degrees > 0) {
                direction = 1;
            } else if (angleDifference_degrees < 0) {
                direction = -1;
            } else {
                direction = 0;
            }

            // Rotate towards that direction
            const angularVelocity = robotManager.rotateHull(robotIndex, direction);

            // Calculate the angle change without including deltaTime
            const angleChange_degrees = constantAngularVelocityForHullRotation * direction;

            // Check if the robot has reached the target angle
            const angleAfterRotation_degrees = Phaser.Math.Angle.WrapDegrees(currentAngle_degrees + angleChange_degrees);
            const newAngleDifference_degrees = Phaser.Math.Angle.WrapDegrees(angle_degrees - angleAfterRotation_degrees);
            const reachedTargetAngle = (direction === 1 && newAngleDifference_degrees <= 0) ||
                (direction === -1 && newAngleDifference_degrees >= 0) ||
                (direction === 0);

            // return boolean indicating whether we're there
            return reachedTargetAngle;
        },
        rotateTurret: function(robotIndex, direction) {
            const multiplier = turretRotationPerFrameSpeed * direction * GameContextHolder.deltaTime;
            RobotManager.incrementTurretAngle_degrees(robotIndex, multiplier);
        },
        rotateTurretTowards: function(robotIndex, angle_degrees) {
            const currentAngle_degrees = RobotsData_PhysicsBodies_robotTurretImages[robotIndex].angle;
            const angleDifference_degrees = Phaser.Math.Angle.WrapDegrees(angle_degrees - currentAngle_degrees);

            // Determine the direction of rotation
            let direction;
            if (angleDifference_degrees > 0) {
                direction = 1;
            } else if (angleDifference_degrees < 0) {
                direction = -1;
            } else {
                direction = 0;
            }

            // Rotate towards that direction
            const angleChange_degrees = turretRotationPerFrameSpeed * direction * GameContextHolder.deltaTime;
            RobotManager.incrementTurretAngle_degrees(robotIndex, angleChange_degrees);

            // Check if the turret has reached the target angle
            const angleAfterRotation_degrees = Phaser.Math.Angle.WrapDegrees(currentAngle_degrees + angleChange_degrees);
            const newAngleDifference_degrees = Phaser.Math.Angle.WrapDegrees(angle_degrees - angleAfterRotation_degrees);

            // Add a threshold to account for small fluctuations
            const threshold = 0.5;
            const reachedTargetAngle = (direction === 1 && newAngleDifference_degrees <= threshold) ||
                (direction === -1 && newAngleDifference_degrees >= -threshold) ||
                (direction === 0);

            if (reachedTargetAngle) {
                // Set the turret angle directly to the target angle
                RobotManager.setTurretAngle_degrees(robotIndex, angle_degrees);
            }

            // return boolean indicating whether we're there
            return reachedTargetAngle;
        },
        setTurretAngle_degrees: function(robotIndex, angle_degrees) {
            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            turretImage.angle = angle_degrees;
        },
        incrementTurretAngle_degrees: function(robotIndex, angle_degrees) {
            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            const currentTurretImageAngle_degrees = turretImage.angle;
            turretImage.angle = AngleOperations.incrementAngle_degrees(currentTurretImageAngle_degrees, angle_degrees);
        },
        fire: function(robotIndex, projectileType) {
            ProjectileManager.fireRobotProjectile(robotIndex, projectileType);
        },
        markRobotAsDestroyed: function(robotIndex) {
            // TODO: needs more work

            RobotsData_CurrentData_alive[robotIndex] = false;
            aliveRobotsIndexes.delete(robotIndex);
            totalAliveRobots--;
        }
    };

    return robotManager;
}());
