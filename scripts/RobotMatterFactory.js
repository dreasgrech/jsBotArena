"use strict";

var RobotHullColors = {
    Brown: 'A',
    Green: 'B',
    Aqua: 'C',
    Blue: 'D'
};

var ProjectileTypes = {
    Granade: 'Granade_Shell',
    Heavy: 'Heavy_Shell',
    Light: 'Light_Shell',
    Medium: 'Medium_Shell',
    Shotgun: 'Shotgun_Shell'
};

var PhysicsObjectType = {
    RobotBody: 'RobotBody',
    ArenaWall: 'ArenaWall',
    Projectile: 'Projectile'
};

var RobotMatterFactory = (function() {
    var createRobot = function({ currentRobotIndex, x, y, scale, robotHullColor = RobotHullColors.Blue }) {
        const gameContext = GameContextHolder.gameContext;

        const shapes = gameContext.cache.json.get('Hulls_CollisionData');

        // ROBOT HULL
        const hullImage = gameContext.matter.add.image(
            x, y,
            `Hulls_Color_${robotHullColor}/Hull_01`,
            null,
            {
                shape: shapes['Hull_01']
            });
        hullImage.setScale(scale);
        hullImage.setFrictionAir(0.2);
        hullImage.setMass(10);

        const hullImagePhysicsBody = hullImage.body;

        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: hullImagePhysicsBody,
            group: 0,
            category: PhysicsCategories.RobotBody,
            collidesWithCategories:
                PhysicsCategories.RobotBody |
                PhysicsCategories.Walls |
                PhysicsCategories.RobotProjectile
        });

        RobotsData_PhysicsBodies.robotBodyImages[currentRobotIndex] = hullImage;

        PhysicsBodies.addArenaPhysicsBodies(PhysicsObjectType.RobotBody, [hullImagePhysicsBody]); // Add all the bodies from the arena to the arena bodies collection

        // Make a reference to the current robot index from the matter object id
        var hullImagePhysicsBodyID = hullImagePhysicsBody.id;
        PhysicsBodies.matterObjectIDToEntityIndex[hullImagePhysicsBodyID] = currentRobotIndex;
        console.log(`Mapping hullImage.id ${hullImagePhysicsBodyID} to currentRobotIndex ${currentRobotIndex}`);

        // ROBOT TURRET
        const turretImage = MatterPhysicsHelpers.loadImage({ x: 0, y: 0, id: 'Weapon_Color_A/Gun_01' });
        turretImage.setScale(scale);
        turretImage.setAngle(0);
        turretImage.setCollisionCategory(PhysicsCategories.RobotTurret);
        turretImage.setCollidesWith(0);

        // Set the origin of the turret to the base of the turret
        turretImage.setOrigin(0.5, 0.75);

        // Create a constraint to attach the turret to the body
        const turretConstraint = gameContext.matter.add.constraint(hullImage, turretImage, 0, 1);

        RobotsData_PhysicsBodies.robotTurretImages[currentRobotIndex] = turretImage;
    };

    const obj = {
        createRobot: createRobot
    };

    return obj;
}());
