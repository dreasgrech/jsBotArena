"use strict";

const RobotHullColors = {
    Brown: 'A',
    Green: 'B',
    Aqua: 'C',
    Blue: 'D'
};

const RobotTurretColors = {
    Brown: 'A',
    Green: 'B',
    Aqua: 'C',
    Blue: 'D'
};

const ProjectileTypes = {
    Granade: 'Granade_Shell',
    Heavy: 'Heavy_Shell',
    Light: 'Light_Shell',
    Medium: 'Medium_Shell',
    Shotgun: 'Shotgun_Shells'
};

const RobotHullTypes = {
    One: '01',
    Two: '02',
    Three: '03',
    Four: '04',
    Five: '05',
    Six: '06',
    Seven: '07',
    Eight: '08'
};

const RobotTurretTypes = {
    One: '01',
    Two: '02',
    Three: '03',
    Four: '04',
    Five: '05',
    Six: '06',
    Seven: '07',
    Eight: '08'
};

const RobotMatterFactory = (function() {
    const createRobot = function({ currentRobotIndex, x, y, scale, robotSetup }) {
        const gameContext = GameContextHolder.gameContext;

        const shapes = gameContext.cache.json.get('Hulls_CollisionData');

        const hullType = robotSetup.hullType;
        const turretType = robotSetup.turretType;

        const hullColor = robotSetup.hullColor;
        const turretColor = robotSetup.turretColor;

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

        const robotID = RobotsData_Instance.ids[currentRobotIndex];
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

        RobotsData_PhysicsBodies.robotBodyImages[currentRobotIndex] = hullImage;

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
        // turretImage.setDensity(.1);

        /*
        const turretImagePhysicsBody = turretImage.body;
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: turretImagePhysicsBody,
            group: 0,
            category: CollisionCategories.RobotTurret,
            collidesWithCategories: 0
        });
        */


        // Create a constraint to attach the turret to the body
        /*
        const turretConstraint = gameContext.matter.add.constraint(hullImage, turretImage, 0, 1,
        // const turretConstraint = gameContext.matter.add.constraint(turretImage, hullImage, 0, 1,
            {
                // pointA: {x: 0, y: 8},
                pointA: {x: 0, y: 5},
            });
            */

        RobotsData_PhysicsBodies.robotTurretImages[currentRobotIndex] = turretImage;
    };

    const robotMatterFactory = {
        createRobot: createRobot,
        updateParts: function(robotIndex) {

            // Update the position of the turret to remain attached to the robot
            var robotTurretImage = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            var robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            var robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];
            robotTurretImage.setPosition(robotPositionX, robotPositionY);
        }
    };

    return robotMatterFactory;
}());
