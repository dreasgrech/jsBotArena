"use strict";

var RobotManager = (function() {
    var currentRobotIndex = 0;
    var totalRobots = 0;

    //var placeRobotInArena = function(tankBody) {
    //    var maxAttempts = 10;
    //    var attempts = 0;
    //    var x, y;

    //    while (attempts < maxAttempts && PhysicsBodies.isBodyOverlappingWithArenaBodies(tankBody)) {
    //        // Generate new random position
    //        x = Math.random() * (GAME_WIDTH * 0.7);
    //        y = Math.random() * (GAME_HEIGHT * 0.7);

    //        // Update tankBody position
    //        tankBody.setPosition(x, y);

    //        attempts++;
    //    }

    //    if (attempts >= maxAttempts) {
    //        console.log("Failed to place the tank without overlapping after", maxAttempts, "attempts.");
    //    }
    //};

    var addRobot = function(newRobot) {
        // RobotsData.ids[currentRobotIndex] = currentRobotIndex;
        RobotsData_Instance.ids[currentRobotIndex] = currentRobotIndex;
        // RobotsData.names[currentRobotIndex] = newRobot.name;
        RobotsData_Instance.names[currentRobotIndex] = newRobot.name;
        RobotsData_Instance.updateFunctions[currentRobotIndex] = newRobot.update;

        var robotScale = 0.4;

        //var gameObject = scene.matter.add.gameObject(gameObject);


        /*****************************/
        var tankBody = MatterPhysicsHelpers.loadImage({ x: GAME_WIDTH * .5, y: GAME_HEIGHT * .5, id: 'Hulls_Color_A/Hull_01'});
        //placeRobotInArena(tankBody);
        tankBody.setScale(robotScale);
        tankBody.setFrictionAir(0.2);
        tankBody.setMass(10);
        // tankBody.setAngle(45);
        RobotsData_PhysicsBodies.robotBodyImages[currentRobotIndex] = tankBody;
        PhysicsHelperFunctions.setCollisionProperties({physicsObject: tankBody.body, group: 0, category: PhysicsCategories.RobotBody, collidesWithCategories: PhysicsCategories.RobotBody | PhysicsCategories.Walls});
        PhysicsBodies.addArenaBodies([tankBody]);
        //PhysicsBodies.isBodyOverlappingWithArenaBodies(tankBody);

        var tankTurret = MatterPhysicsHelpers.loadImage({ x: 0, y: 0, id: 'Weapon_Color_A/Gun_01'});
        tankTurret.setScale(robotScale);
        tankTurret.setAngle(0);
        tankTurret.setCollisionCategory(PhysicsCategories.RobotTurret);
        tankTurret.setCollidesWith(0);

        // Set the origin of the turret to the base of the turret
        tankTurret.setOrigin(0.5, 0.75);

        // Create a constraint to attach the turret to the body
        var turretConstraint = GameContextHolder.gameContext.matter.add.constraint(tankBody, tankTurret, 0, 1);

        RobotsData_PhysicsBodies.robotTurretImages[currentRobotIndex] = tankTurret;

        // Create the tracks
        // var trackA = 

        // Create the API for the robot
        var api = RobotAPIFactory.createAPI(currentRobotIndex);
        RobotsData_Instance.robotAPIs[currentRobotIndex] = api;

        // Set the speed
        RobotsData_Instance.robotSpeeds[currentRobotIndex] = 0.05;

        // Create the radar
        RobotsRadar.createRadar(currentRobotIndex);

        //// Update the turret rotation based on pointer location
        /*
        GameContextHolder.gameContext.input.on('pointermove', (pointer) => {
            // const angle = Phaser.Math.Angle.Between(tankTurret.x, tankTurret.y, pointer.x, pointer.y);
            const angle = Phaser.Math.Angle.Between(tankBody.x, tankBody.y, pointer.x, pointer.y);
            // tankTurret.setAngle(Phaser.Math.RadToDeg(angle));
            tankBody.setAngle(Phaser.Math.RadToDeg(angle));
        });
        */

        // Listen for a pointerdown event to apply force to the tank body
        /*
        GameContextHolder.gameContext.input.on('pointerdown', () => {
            var forceMagnitude = 0.005; // Change this value to adjust the force applied
            var angle = this.tankTurret.rotation;
            var force = new Phaser.Math.Vector2(Math.cos(angle) * forceMagnitude, Math.sin(angle) * forceMagnitude);
            tankBody.applyForce(force);
        });
        */
        /*****************************/

        // RobotsData.totalRobots++;
        totalRobots++;
        currentRobotIndex++;
    };

    var update = function(time, delta) {
        for (var i = 0; i < totalRobots; i++) {
            var updateFunction = RobotsData_Instance.updateFunctions[i];
            var api = RobotsData_Instance.robotAPIs[i];
            updateFunction(api, time, delta);

            var robotCenterPosition = RobotsBoundsHelpers.getCenter(i);
            RobotsData_CurrentData.positionXs[i] = robotCenterPosition.x;
            RobotsData_CurrentData.positionYs[i] = robotCenterPosition.y;

            var robotBody = RobotsData_PhysicsBodies.robotBodyImages[i];
            RobotsData_CurrentData.currentRobotAngles[i] = robotBody.angle;

            var turretImage = RobotsData_PhysicsBodies.robotTurretImages[i];
            RobotsData_CurrentData.currentTurretAngles[i] = turretImage.angle;

            RobotsRadar.scanForRobots(i);

            RobotsRadar.drawRadarArc(i);

            /*************************/
            // testing turret rotation
            turretImage.angle += 1;

            // testing radar rotation
            RobotsData_CurrentData.currentRadarAngles[i] += 1;
            /*************************/
        }
    };

    return {
        getTotalRobots: function() { return totalRobots; },
        addRobot: addRobot,
        update: update
    };
}());

