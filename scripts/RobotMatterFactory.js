"use strict";

const RobotMatterFactory = (function() {
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
            x, y,
            // `Hulls_Color_${hullColor}/Hull_01`,
            `Hulls_Color_${hullColor}/Hull_${hullType}`,
            null,
            {
                // shape: shapes['Hull_01'],
                shape: shapes[`Hull_${hullType}`],
            });
        hullImage.setScale(scale);
        hullImage.setAngle(0);
        hullImage.setFrictionAir(0.2);
        hullImage.depth = GameObjectDepths.RobotBody;

        const hullImagePhysicsBody = hullImage.body;

        const area = hullImagePhysicsBody.area;
        const density = 0.01;
        hullImage.setDensity(density);
        // Logger.log("area", area, "density", hullImagePhysicsBody.density, "mass", hullImagePhysicsBody.mass);

        const robotID = RobotsData_Instance_ids[currentRobotIndex];
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: hullImagePhysicsBody,
            // group: 0,
            group: -robotID,
            category: CollisionCategories.RobotBody,
            collidesWithCategories:
                CollisionCategories.RobotBody |
                CollisionCategories.Arena |
                CollisionCategories.RobotProjectile
        });
        // Logger.log("Setting group of robot to", -robotID);

        RobotsData_PhysicsBodies_robotBodyImages[currentRobotIndex] = hullImage;

        // Add the robot's body to the arena bodies collection
        PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.RobotBody, [hullImagePhysicsBody]); // Add all the bodies from the arena to the arena bodies collection

        // Make a reference to the current robot index from the matter object id
        const hullImagePhysicsBodyID = hullImagePhysicsBody.id;
        // PhysicsBodies.matterObjectIDToEntityIndex[hullImagePhysicsBodyID] = currentRobotIndex;
        PhysicsBodies.mapMatterObjectIDToRobotIndex(hullImagePhysicsBodyID, currentRobotIndex);
        // Logger.log(`Mapping hullImage.id ${hullImagePhysicsBodyID} to currentRobotIndex ${currentRobotIndex}`);

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
        createRobot: createRobot,
        updateParts: function(robotIndex) {

            // Update the position of the turret to remain attached to the robot
            const robotTurretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            const robotPositionX = RobotsData_CurrentData_positionXs[robotIndex];
            const robotPositionY = RobotsData_CurrentData_positionYs[robotIndex];
            robotTurretImage.setPosition(robotPositionX, robotPositionY);
        }
    };

    return robotMatterFactory;
}());
