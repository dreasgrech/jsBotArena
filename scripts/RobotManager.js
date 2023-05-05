"use strict";

const RobotManager = (function() {
    let currentRobotIndex = 0;
    let totalRobots = 0;

    const constantAngularVelocityForHullRotation = 1;
    const turretRotationPerFrameSpeed = 50;

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
            scale: 0.4,
            x: x,
            y: y,
            robotSetup: robotSetup
        });

        // Find a spot for the robot to spawn in and place it there
        placeRobotInArena(RobotsData_PhysicsBodies_robotBodyImages[currentRobotIndex]);

        // Set the starting data for the robot
        RobotsData_CurrentData_health[currentRobotIndex] = STARTING_ROBOT_HEALTH;

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
        RobotsData_Instance_robotSpeeds[currentRobotIndex] = 5;

        // Create the radar
        RobotsRadar.createRadar(currentRobotIndex);

        // Inform the UI information panel about the new robot
        UIRobotInfoPanel.add(currentRobotIndex);

        // Inform  the other objects that a new robot has been added
        ProjectileManager.onRobotAdded(currentRobotIndex);

        // Execute the robot's onSpawned callback
        const onSpawned = newRobot.onSpawned;
        if (onSpawned) {
            newRobot.onSpawned(api, GameContextHolder.gameTime);
        } else {
            Logger.warn(newRobot, "doesn't have onCreate()");
        }

        // RobotsData.totalRobots++;
        totalRobots++;
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
            // RobotsData_CurrentData.currentRobotAngles_degrees[i] = normalizeAngle(robotBodyImage.angle);
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
            const scannedRobots = RobotsRadar.scanForRobots(i);
            radar.scannedRobots = scannedRobots;

            // Set the robot collisions to the api
            const api_collisions = api.collisions;
            api_collisions.otherRobots = RobotsData_CurrentData_robotCollisions[i];
            api_collisions.arena = RobotsData_CurrentData_arenaCollisions[i];

            // Call the robot's update function
            const time = GameContextHolder.gameTime;
            const deltaTime = GameContextHolder.deltaTime;
            const updateFunction = RobotsData_Instance_updateFunctions[i];
            updateFunction(api, time, deltaTime);

            const turret = api.turret;
            const turretFollowHull = turret.turretFollowHull;
            if (turretFollowHull) {
                robotManager.setTurretAngle_degrees(i, hullAngle_degrees);
            }

            const radarFollowTurret = radar.radarFollowTurret;
            if (radarFollowTurret) {
                RobotsRadar.setRadarAngle_degrees(i, turretAngle_degrees);
            }

            /*************************/
            // testing turret rotation
            // turretImage.angle += 1;
            //turretImage.angle = RobotsData_CurrentData.currentRobotAngles_degrees[i];

            //// testing radar rotation
            //if (api.radarEnabled) {
            //    const currentRadarAngle = RobotsData_CurrentData.currentRadarAngles_degrees[i];
            //    // RobotsData_CurrentData.currentRadarAngles_degrees[i] = normalizeAngle(currentRadarAngle + 1);
            //    //RobotsData_CurrentData.currentRadarAngles_degrees[i] = 0;
            //}
            /*************************/

            RobotsBoundsHelpers.drawHullBounds(i);
            RobotsBoundsHelpers.drawTurretBounds(i);
        }
    };

    const robotManager = {
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
        },
        rotateTurret: function(robotIndex, direction) {
            const multiplier = turretRotationPerFrameSpeed * direction * GameContextHolder.deltaTime;
            RobotManager.incrementTurretAngle_degrees(robotIndex, multiplier);
        },
        setTurretAngle_degrees: function(robotIndex, angleDegrees) {
            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            turretImage.angle = angleDegrees;
        },
        incrementTurretAngle_degrees: function(robotIndex, angleDegrees) {
            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            const currentTurretImageAngle_degrees = turretImage.angle;
            turretImage.angle = AngleOperations.incrementAngle_degrees(currentTurretImageAngle_degrees, angleDegrees);
        },
        fire: function(robotIndex, projectileType) {
            ProjectileManager.fireRobotProjectile(robotIndex, projectileType);
        }
        // matterBodyToObjectType: {}
    };

    return robotManager;
}());
