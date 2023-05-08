"use strict";

const RobotMatterFactory = (function() {

    const createProjectileSensor = function (robotIndex) {
        const gameContext = GameContextHolder.gameContext;

        // Get the robot's vertices
        const vertices = RobotsBoundsHelpers.getHullBounds(robotIndex);

        // Create a custom-shaped sensor using the vertices
        const sensorBody = gameContext.matter.add.fromVertices(300, 300, vertices, {
            isSensor: true // Set the body to be a sensor
        });

        // Add a constraint between the hull body and the sensor body so that the sensor moves with the hull
        gameContext.matter.add.constraint(RobotsData_PhysicsBodies_robotBodyImages[robotIndex].body, sensorBody, 0, 1);

        const robotID = RobotsData_Instance_ids[robotIndex];
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: sensorBody,
            group: -robotID, // -robotID so that it doesn't collide with the firing robot
            category: CollisionCategories.RobotProjectileSensor,
            collidesWithCategories:
                CollisionCategories.RobotProjectile
        });

        // Store the sensor in your RobotsData for future reference or updates
        RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex] = sensorBody;

        // Map the sensor body id to the robot index so that we can later resolve the robot index from it
        PhysicsBodies.mapProjectileSensorBodyIDToRobotIndex(sensorBody.id, robotIndex);
    };

    const createRobot = function({ currentRobotIndex, x, y, scale, robotSetup }) {
        const gameContext = GameContextHolder.gameContext;

        const shapes = gameContext.cache.json.get('Hulls_CollisionData');

        const hullSetup = robotSetup.hull;
        const turretSetup = robotSetup.turret;

        const hullType = hullSetup.hullType;
        const hullColor = hullSetup.hullColor;
        const turretType = turretSetup.turretType;
        const turretColor = turretSetup.turretColor;

        // ROBOT HULL
        const hullImage = gameContext.matter.add.image(
            x,
            y,
            `Hulls_Color_${hullColor}/Hull_${hullType}`,
            null,
            {
                //shape: shapes[`Hull_${hullType}`],
            
            });
        hullImage.setBody(shapes[`Hull_${hullType}`], null);
        hullImage.setScale(scale);
        hullImage.setAngle(0);
        hullImage.setFrictionAir(0.2);
        hullImage.depth = GameObjectDepths.RobotBody;

        const hullImagePhysicsBody = hullImage.body;

        //const area = hullImagePhysicsBody.area;
        const density = 1;
        hullImage.setDensity(density);
        //Logger.log("Robot area", area, "density", hullImagePhysicsBody.density, "mass", hullImagePhysicsBody.mass);

        const robotID = RobotsData_Instance_ids[currentRobotIndex];
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: hullImagePhysicsBody,
            group: -robotID,
            category: CollisionCategories.RobotBody,
            collidesWithCategories:
                CollisionCategories.RobotBody
                    | CollisionCategories.Arena
                    //| CollisionCategories.RobotProjectile
        });

        const hullImagePhysicsBodyID = hullImagePhysicsBody.id;

        RobotsData_PhysicsBodies_robotBodyImages[currentRobotIndex] = hullImage;
        RobotsData_PhysicsBodies_robotHullBodyIDs[currentRobotIndex] = hullImagePhysicsBodyID;

        // Add the robot's body to the arena bodies collection
        PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.RobotBody, [hullImagePhysicsBody], true); // Add all the bodies from the arena to the arena bodies collection

        // Make a reference to the current robot index from the matter object id
        PhysicsBodies.mapHullImageBodyIDToRobotIndex(hullImagePhysicsBodyID, currentRobotIndex);
        // Logger.log(`Mapping hullImage.id ${hullImagePhysicsBodyID} to currentRobotIndex ${currentRobotIndex}`);

        // Create the Projectile Sensor for the robot which detects which projectiles hit this robot
        createProjectileSensor(currentRobotIndex);

        // ROBOT TURRET
        const turretImage = GameContextHolder.gameContext.add.image(
            hullImage.x,
            hullImage.y,
            // `Weapon_Color_${turretColor}/Gun_04`);
            `Weapon_Color_${turretColor}/Gun_${turretType}`);

        turretImage.setOrigin(0.3, 0.5); // Set the origin of the turret to the base of the turret
        turretImage.depth = GameObjectDepths.RobotTurret;
        turretImage.setScale(scale);
        turretImage.setAngle(0);

        RobotsData_PhysicsBodies_robotTurretImages[currentRobotIndex] = turretImage;
    };

    const robotMatterFactory = {
        //system_create: function() {
        //    GameContextHolder.gameContext.matter.world.on('afterupdate', function() {
        //        //console.log('afterupdate');
        //    });
        //},
        createRobot: createRobot,
        updateParts: function(robotIndex) {

            // Update the position of the turret to remain attached to the robot
            const robotTurretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            const robotPositionX = RobotsData_CurrentData_positionXs[robotIndex];
            const robotPositionY = RobotsData_CurrentData_positionYs[robotIndex];
            robotTurretImage.setPosition(robotPositionX, robotPositionY);

            // Match the projectile sensor's angle to the robot hull's angle
            const projectileSensor = RobotsData_PhysicsBodies_robotProjectileSensorBodies[robotIndex];
            projectileSensor.angle = Phaser.Math.DegToRad(RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex]);
        }
    };

    return robotMatterFactory;
}());
