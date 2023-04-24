"use strict";

const RobotHullColors = {
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
    Shotgun: 'Shotgun_Shell'
};

const PhysicsObjectType = {
    RobotBody: 'RobotBody',
    ArenaWall: 'ArenaWall',
    Projectile: 'Projectile'
};

const RobotMatterFactory = (function() {
    const createRobot = function({ currentRobotIndex, x, y, scale, robotHullColor = RobotHullColors.Blue }) {
        const gameContext = GameContextHolder.gameContext;

        const shapes = gameContext.cache.json.get('Hulls_CollisionData');

        // ROBOT HULL
        const hullImage = gameContext.matter.add.image(
            x, y,
            `Hulls_Color_${robotHullColor}/Hull_01`,
            null,
            {
                shape: shapes['Hull_01'],
                // density: 100 // doesnt work
            });
        hullImage.setScale(scale);
        hullImage.setAngle(0);
        hullImage.setFrictionAir(0.2);
        hullImage.depth = DepthManager.RobotBody;

        const hullImagePhysicsBody = hullImage.body;

        const area = hullImagePhysicsBody.area;
        const density = 0.01;
        hullImage.setDensity(density);
        Logger.log("area", area, "density", hullImagePhysicsBody.density, "mass", hullImagePhysicsBody.mass);

        const robotID = RobotsData_Instance.ids[currentRobotIndex];
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: hullImagePhysicsBody,
            // group: 0,
            group: -robotID,
            category: PhysicsCategories.RobotBody,
            collidesWithCategories:
                PhysicsCategories.RobotBody |
                PhysicsCategories.Walls |
                PhysicsCategories.RobotProjectile
        });
        // Logger.log("Setting group of robot to", -robotID);

        RobotsData_PhysicsBodies.robotBodyImages[currentRobotIndex] = hullImage;

        PhysicsBodies.addArenaPhysicsBodies(PhysicsObjectType.RobotBody, [hullImagePhysicsBody]); // Add all the bodies from the arena to the arena bodies collection

        // Make a reference to the current robot index from the matter object id
        const hullImagePhysicsBodyID = hullImagePhysicsBody.id;
        // PhysicsBodies.matterObjectIDToEntityIndex[hullImagePhysicsBodyID] = currentRobotIndex;
        PhysicsBodies.mapMatterObjectIDToEntityIndex(hullImagePhysicsBodyID, currentRobotIndex);
        Logger.log(`Mapping hullImage.id ${hullImagePhysicsBodyID} to currentRobotIndex ${currentRobotIndex}`);

        // ROBOT TURRET
        // const turretImage = MatterPhysicsHelpers.loadImage({ x: 0, y: 0, id: 'Weapon_Color_A/Gun_01' });
        const turretImage = GameContextHolder.gameContext.add.image(
            hullImage.x,
            hullImage.y,
            'Weapon_Color_A/Gun_04');
        
        turretImage.setOrigin(0.5, 0.75); // Set the origin of the turret to the base of the turret
        Logger.log(turretImage.body);
        turretImage.depth = DepthManager.RobotTurret;
        turretImage.setScale(scale);
        turretImage.setAngle(0);
        // turretImage.setDensity(.1);

        /*
        const turretImagePhysicsBody = turretImage.body;
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: turretImagePhysicsBody,
            group: 0,
            category: PhysicsCategories.RobotTurret,
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

    const obj = {
        createRobot: createRobot,
        updateParts: function(robotIndex) {

            // Update the position of the turret to remain attached to the robot
            var robotTurretImage = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            var robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            var robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];
            robotTurretImage.setPosition(robotPositionX, robotPositionY);
        }
    };

    return obj;
}());

const DepthManager = (function() {

    const obj = {
        Projectile: 4,
        RobotBody: 5,
        RobotTurret: 6,
    };

    return obj;

}());
