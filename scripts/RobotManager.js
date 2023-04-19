"use strict";

var robotManager = (function() {
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
        RobotsData.updateFunctions[currentRobotIndex] = newRobot.update;

        var robotScale = 0.4;

        //var gameObject = scene.matter.add.gameObject(gameObject);


        /*****************************/
        // Create tank body and turret
        //var x = Math.random() * (GAME_WIDTH*.7);
        //var y = Math.random() * (GAME_HEIGHT*.7);
        // var tankBody = gameContext.matter.add.image(600, 300, 'tankBody');
        // var tankBody = gameContext.matter.add.image(GAME_WIDTH * .5, GAME_HEIGHT * .5, 'Hulls_Color_A/Hull_01');
        var tankBody = MatterPhysicsHelpers.loadImage({ x: GAME_WIDTH * .5, y: GAME_HEIGHT * .5, id: 'Hulls_Color_A/Hull_01'});
        //placeRobotInArena(tankBody);
        tankBody.setScale(robotScale);
        tankBody.setFrictionAir(0.2);
        tankBody.setMass(10);
        // tankBody.setAngle(45);
        RobotsData.robotBodyImages[currentRobotIndex] = tankBody;
        PhysicsHelperFunctions.setCollisionProperties({physicsObject: tankBody.body, group: 0, category: PhysicsCategories.RobotBody, collidesWithCategories: PhysicsCategories.RobotBody | PhysicsCategories.Walls});
        PhysicsBodies.addArenaBodies([tankBody]);
        //PhysicsBodies.isBodyOverlappingWithArenaBodies(tankBody);

        // const tankTurret = this.matter.add.image(400, 300, 'tankTurret');
        var tankTurret = MatterPhysicsHelpers.loadImage({ x: 0, y: 0, id: 'Weapon_Color_A/Gun_01'});
        tankTurret.setScale(robotScale);
        tankTurret.setAngle(0);
        tankTurret.setCollisionCategory(PhysicsCategories.RobotTurret);
        tankTurret.setCollidesWith(0);

        // Set the origin of the turret to the base of the turret
        tankTurret.setOrigin(0.5, 0.75);

        // Create a constraint to attach the turret to the body
        var turretConstraint = GameContextHolder.gameContext.matter.add.constraint(tankBody, tankTurret, 0, 1);

        RobotsData.robotTurretImages[currentRobotIndex] = tankTurret;

        // Create the tracks
        // var trackA = 

        var api = RobotAPIFactory.createAPI(currentRobotIndex);
        RobotsData.robotAPIs[currentRobotIndex] = api;

        // RobotsData.robotSpeeds[currentRobotIndex] = 0.1;
        // RobotsData.robotSpeeds[currentRobotIndex] = Math.random() * 0.5;
        RobotsData.robotSpeeds[currentRobotIndex] = 0.05;

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

        totalRobots++;
        currentRobotIndex++;
    };

    var update = function(time, delta) {
        for (var i = 0; i < totalRobots; i++) {
            var updateFunction = RobotsData.updateFunctions[i];
            var api = RobotsData.robotAPIs[i];
            updateFunction(api, time, delta);
        }
    };

    return {
        addRobot: addRobot,
        update: update
    };
}());
