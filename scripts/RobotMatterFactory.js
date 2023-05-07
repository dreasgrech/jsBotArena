"use strict";

const RobotMatterFactory = (function() {

    const createRobotSensor = function (robotIndex) {
        const gameContext = GameContextHolder.gameContext;

        // Get the robot's vertices
        const vertices = RobotsBoundsHelpers.getHullBounds(robotIndex);

        // Create a custom-shaped sensor using the vertices
        const sensor = gameContext.matter.add.fromVertices(300, 300, vertices, {
        //const sensor = gameContext.matter.add.rectangle(300, 300, 100, 100, {
        //const sensor = gameContext.matter.add.image(300, 300, '', {
            isSensor: true, // Set the body to be a sensor
        //    //isStatic: true // Set the sensor to be static (won't move)
        });

        gameContext.matter.add.constraint(RobotsData_PhysicsBodies_robotBodyImages[robotIndex].body, sensor, 0, 1);

        // Set the sensor's position to match the hullImage's center
        const hullCenter = RobotsBoundsHelpers.getHullCenter(robotIndex);
        //gameContext.matter.body.setPosition(sensor, { x: hullCenter.x, y: hullCenter.y });

        const robotID = RobotsData_Instance_ids[robotIndex];
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: sensor,
            group: -robotID,
            // category: CollisionCategories.RobotBody,
            category: CollisionCategories.RobotProjectileSensor,
            collidesWithCategories:
                //CollisionCategories.RobotBody |
                //CollisionCategories.Arena |
                CollisionCategories.RobotProjectile
        });

        // Store the sensor in your RobotsData for future reference or updates
        RobotsData_PhysicsBodies_robotProjectileSensor[robotIndex] = sensor;

        PhysicsBodies.mapProjectileSensorBodyIDToRobotIndex(sensor.id, robotIndex);

        if (robotIndex === 0) {

        }

        Logger.log("sensor", sensor);
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


        //hullImage.setSensor(true);


        const hullImagePhysicsBody = hullImage.body;

        const area = hullImagePhysicsBody.area;
        //const density = 0.01;
        // const density = 0.05;
        // const density = 5000;
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
        // Logger.log("Setting group of robot to", -robotID);


        RobotsData_PhysicsBodies_robotBodyImages[currentRobotIndex] = hullImage;

        // Add the robot's body to the arena bodies collection
        PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.RobotBody, [hullImagePhysicsBody]); // Add all the bodies from the arena to the arena bodies collection

        // Make a reference to the current robot index from the matter object id
        const hullImagePhysicsBodyID = hullImagePhysicsBody.id;
        // PhysicsBodies.matterObjectIDToEntityIndex[hullImagePhysicsBodyID] = currentRobotIndex;
        PhysicsBodies.mapHullImageBodyIDToRobotIndex(hullImagePhysicsBodyID, currentRobotIndex);
        // Logger.log(`Mapping hullImage.id ${hullImagePhysicsBodyID} to currentRobotIndex ${currentRobotIndex}`);

        // Logger.log("Hull Body", hullImage);


        createRobotSensor(currentRobotIndex);


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

            // Move the projectile sensor
            const hullImage = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];
            const hullImageBody = hullImage.body;

            const projectileSensor = RobotsData_PhysicsBodies_robotProjectileSensor[robotIndex];
            /*
            //projectileSensor.position.x = robotPositionX;
            //projectileSensor.position.y = robotPositionY;
            projectileSensor.position.x = hullImageBody.position.x;
            projectileSensor.position.y = hullImageBody.position.y;
            //projectileSensor.setPosition(hullImageBody.position.x, hullImageBody.position.y); // gameobject

            */
            //const hullAngles_degrees = RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex];
            //const gameContext = GameContextHolder.gameContext;
            projectileSensor.angle = Phaser.Math.DegToRad(RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex]);
            //projectileSensor.angle = hullImageBody.angle; // body
            //projectileSensor.body.angle = hullImageBody.angle; // gameobject
            if (robotIndex === 0) {
                //Logger.log(projectileSensor.angle);
            }
        }
    };

    return robotMatterFactory;
}());
