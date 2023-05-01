"use strict";

const RobotManager = (function() {
    let currentRobotIndex = 0;
    let totalRobots = 0;

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
        RobotsData_Instance.ids[currentRobotIndex] = currentRobotIndex + 1;
        RobotsData_Instance.names[currentRobotIndex] = newRobot.name;
        RobotsData_Instance.updateFunctions[currentRobotIndex] = newRobot.update;

        const gameWidth = GameSetup.Width, gameHeight = GameSetup.Height;
        const x = gameWidth * .5, y = gameHeight * .5;

        // const robotSetup = newRobot.setup;

        // Call the robot's create() method
        const robotSetup = RobotSetupFactory.createRobotSetup();
        // newRobot.create({ robotSetup: robotSetup });
        newRobot.create(robotSetup);

        /*****************************/
        RobotMatterFactory.createRobot({
            currentRobotIndex: currentRobotIndex,
            scale: 0.4,
            x: x,
            y: y,
            robotSetup: robotSetup
        });

        placeRobotInArena(RobotsData_PhysicsBodies.robotBodyImages[currentRobotIndex]);

        // Create the tracks
        // const trackA = 

        // Create the API for the robot
        const api = RobotAPIFactory.createAPI(currentRobotIndex);
        RobotsData_Instance.robotAPIs[currentRobotIndex] = api;

        // Set the speed
        RobotsData_Instance.robotSpeeds[currentRobotIndex] = 0.05;

        // Create the radar
        RobotsRadar.createRadar(currentRobotIndex);

        //// Update the turret rotation based on pointer location
        /*
        GameContextHolder.gameContext.input.on('pointermove', (pointer) => {
        });
        */

        // Listen for a pointerdown event to apply force to the robot body
        /*
        GameContextHolder.gameContext.input.on('pointerdown', () => {
        });
        */
        /*****************************/

        // Inform the UI information panel about the new robot
        UIRobotInfoPanel.add(currentRobotIndex);

        // Add the entry for the robot in the per-frame collisions arrays
        RobotsData_CurrentData.robotCollisions[currentRobotIndex] = [];
        RobotsData_CurrentData.arenaCollisions[currentRobotIndex] = [];

        // RobotsData.totalRobots++;
        totalRobots++;
        currentRobotIndex++;
    };

    const constantAngularVelocityForHullRotation = 0.01;

    const turretRotationPerFrameSpeed = 0.6;

    const update = function(time, delta) {
        for (let i = 0; i < totalRobots; i++) {
            const robotCenterPosition = RobotsBoundsHelpers.getCenter(i);
            const robotPositionX = robotCenterPosition.x;
            const robotPositionY = robotCenterPosition.y;
            RobotsData_CurrentData.positionXs[i] = robotPositionX;
            RobotsData_CurrentData.positionYs[i] = robotPositionY;

            const robotBodyImage = RobotsData_PhysicsBodies.robotBodyImages[i];
            const robotBodyImagePhysicsBody = robotBodyImage.body;
            const hullAngle_PhaserDegrees = robotBodyImage.angle;
            RobotsData_CurrentData.currentRobotAngles_PhaserDegrees[i] = hullAngle_PhaserDegrees;
            // RobotsData_CurrentData.currentRobotAngles_PhaserDegrees[i] = normalizeAngle(robotBodyImage.angle);
            RobotsData_CurrentData.currentRobotVelocities[i] = robotBodyImagePhysicsBody.velocity;

            const turretImage = RobotsData_PhysicsBodies.robotTurretImages[i];
            const turretAngle_degrees = turretImage.angle;
            RobotsData_CurrentData.currentTurretAngles[i] = turretAngle_degrees;

            RobotMatterFactory.updateParts(i);

            RobotsRadar.drawRadarArc(i);

            const api = RobotsData_Instance.robotAPIs[i];

            const data = api.data;
            data.positionX = robotPositionX;
            data.positionY = robotPositionY;

            // Set the radar scanned robots to the api
            const radar = api.radar;
            const scannedRobots = RobotsRadar.scanForRobots(i);
            radar.scannedRobots = scannedRobots;

            // Set the robot collisions to the api
            const api_collisions = api.collisions;
            api_collisions.otherRobots = RobotsData_CurrentData.robotCollisions[i];
            api_collisions.arena = RobotsData_CurrentData.arenaCollisions[i];

            // Call the robot's update function
            const updateFunction = RobotsData_Instance.updateFunctions[i];
            updateFunction(api, time, delta);

            const turret = api.turret;
            const turretFollowHull = turret.turretFollowHull;
            if (turretFollowHull) {
                robotManager.setTurretAngle_degrees(i, hullAngle_PhaserDegrees);
            }

            const radarFollowTurret = radar.radarFollowTurret;
            if (radarFollowTurret) {
                RobotsRadar.setRadarAngle_degrees(i, turretAngle_degrees);
            }

            /*************************/
            // testing turret rotation
            // turretImage.angle += 1;
            //turretImage.angle = RobotsData_CurrentData.currentRobotAngles_PhaserDegrees[i];

            //// testing radar rotation
            //if (api.radarEnabled) {
            //    const currentRadarAngle = RobotsData_CurrentData.currentRadarAngles_degrees[i];
            //    // RobotsData_CurrentData.currentRadarAngles_degrees[i] = normalizeAngle(currentRadarAngle + 1);
            //    //RobotsData_CurrentData.currentRadarAngles_degrees[i] = 0;
            //}
            /*************************/

            RobotsBoundsHelpers.drawBounds(i);
        }
    };

    const robotManager = {
        getTotalRobots: function() { return totalRobots; },
        addRobot: addRobot,
        update: update,
        moveHull: function(robotIndex, direction) {
            const robotBody = RobotsData_PhysicsBodies.robotBodyImages[robotIndex];
            const robotSpeed = RobotsData_Instance.robotSpeeds[robotIndex];

            // const angle = robotBody.angle - 90; // The '- 90' is because of Phaser's coordinate system where angle 0 points to the right
            // const angle = RobotsData_CurrentData.currentRobotAngles_PhaserDegrees[robotIndex] - 90; // The '- 90' is because of Phaser's coordinate system where angle 0 points to the right
            const angle = RobotsData_CurrentData.currentRobotAngles_PhaserDegrees[robotIndex]; // The '- 90' is because of Phaser's coordinate system where angle 0 points to the right
            const angleRadians = Phaser.Math.DegToRad(angle);

            //console.log(angle);
            const force = new Phaser.Math.Vector2(Math.cos(angleRadians) * robotSpeed * direction, Math.sin(angleRadians) * robotSpeed * direction);
            robotBody.applyForce(force);
            //console.log(robotBody.getCenter());
            // console.log(robotBody.getBounds());
            // robotBody.thrust(0.1);
        },
        rotateHull: function(robotIndex, direction) {
            const angularVelocity = constantAngularVelocityForHullRotation * direction;

            const robotBody = RobotsData_PhysicsBodies.robotBodyImages[robotIndex];
            robotBody.setAngularVelocity(angularVelocity);
        },
        rotateTurret: function(robotIndex, direction) {
            RobotManager.incrementTurretAngle_degrees(robotIndex, turretRotationPerFrameSpeed * direction);
        },
        setTurretAngle_degrees: function(robotIndex, angleDegrees) {
            const turretImage = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            turretImage.angle = angleDegrees;
        },
        incrementTurretAngle_degrees: function(robotIndex, angleDegrees) {
            const turretImage = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            const currentTurretImageAngle_degrees = turretImage.angle;
            turretImage.angle = AngleOperations.incrementAngle_degrees(currentTurretImageAngle_degrees, angleDegrees);
        }
        // matterBodyToObjectType: {}
    };

    return robotManager;
}());
