"use strict";

const RobotManager = (function() {
    let currentRobotIndex = 0;
    let totalRobots = 0;

    //const placeRobotInArena = function(robotBody) {
    //    const maxAttempts = 10;
    //    var attempts = 0;
    //    var x, y;

    //    while (attempts < maxAttempts && PhysicsBodies.isBodyOverlappingWithArenaBodies(robotBody)) {
    //        // Generate new random position
    //        x = Math.random() * (GAME_WIDTH * 0.7);
    //        y = Math.random() * (GAME_HEIGHT * 0.7);

    //        // Update robotBody position
    //        robotBody.setPosition(x, y);

    //        attempts++;
    //    }

    //    if (attempts >= maxAttempts) {
    //        console.log("Failed to place the robot without overlapping after", maxAttempts, "attempts.");
    //    }
    //};

    const addRobot = function(newRobot) {
        RobotsData_Instance.ids[currentRobotIndex] = currentRobotIndex + 1;
        RobotsData_Instance.names[currentRobotIndex] = newRobot.name;
        RobotsData_Instance.updateFunctions[currentRobotIndex] = newRobot.update;

        /*********************/
        const x = GAME_WIDTH * .5,
            y = GAME_HEIGHT * .5;

        /*********************/


        /*****************************/
        RobotMatterFactory.createRobot({
            currentRobotIndex: currentRobotIndex,
            scale: 0.4,
            x: x,
            y: y,
            robotHullColor: RobotHullColors.Brown
        });

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

        // Add the entry for the robot in the per-frame robotCollisions array
        RobotsData_CurrentData.robotCollisions[currentRobotIndex] = [];

        // Call the robot's create() method
        newRobot.create();

        // RobotsData.totalRobots++;
        totalRobots++;
        currentRobotIndex++;
    };

    const normalizeAngle = function (angle) {
        return ((angle % 360) + 360) % 360;
    };

    const update = function(time, delta) {
        for (let i = 0; i < totalRobots; i++) {
            const robotCenterPosition = RobotsBoundsHelpers.getCenter(i);
            RobotsData_CurrentData.positionXs[i] = robotCenterPosition.x;
            RobotsData_CurrentData.positionYs[i] = robotCenterPosition.y;

            const robotBodyImage = RobotsData_PhysicsBodies.robotBodyImages[i];
            const robotBodyImagePhysicsBody = robotBodyImage.body;
            RobotsData_CurrentData.currentRobotAngles[i] = robotBodyImage.angle;
            // RobotsData_CurrentData.currentRobotAngles[i] = normalizeAngle(robotBodyImage.angle);
            RobotsData_CurrentData.currentRobotVelocities[i] = robotBodyImagePhysicsBody.velocity;

            // console.log(robotBody.body.velocity);

            const turretImage = RobotsData_PhysicsBodies.robotTurretImages[i];
            RobotsData_CurrentData.currentTurretAngles[i] = turretImage.angle;

            RobotMatterFactory.updateParts(i);

            RobotsRadar.drawRadarArc(i);

            const api = RobotsData_Instance.robotAPIs[i];

            // Set the radar scanned robots to the api
            const scannedRobots = RobotsRadar.scanForRobots(i);
            api.scannedRobots = scannedRobots;

            // Set the robot collisions to the api
            const collisionsThisFrame = RobotsData_CurrentData.robotCollisions[i];
            api.collisionsThisFrame = collisionsThisFrame;

            // Call the robot's update function
            const updateFunction = RobotsData_Instance.updateFunctions[i];
            updateFunction(api, time, delta);

            /*************************/
            // testing turret rotation
            // turretImage.angle += 1;
            turretImage.angle = RobotsData_CurrentData.currentRobotAngles[i];

            // testing radar rotation
            if (api.radarEnabled) {
                const currentRadarAngle = RobotsData_CurrentData.currentRadarAngles[i];
                RobotsData_CurrentData.currentRadarAngles[i] = normalizeAngle(currentRadarAngle + 1);
            }
            /*************************/
        }
    };

    const obj = {
        getTotalRobots: function() { return totalRobots; },
        addRobot: addRobot,
        update: update,
        // matterBodyToObjectType: {}
    };

    return obj;
}());

