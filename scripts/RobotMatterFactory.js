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

var RobotMatterFactory = (function() {
    var createRobot = function({ currentRobotIndex, x, y, scale, robotHullColor = RobotHullColors.Blue }) {
        var gameContext = GameContextHolder.gameContext;

        var shapes = gameContext.cache.json.get('Hulls_CollisionData');

        // TANK BODY
        const tankBody = gameContext.matter.add.sprite(x,
            y,
            `Hulls_Color_${robotHullColor}/Hull_01`,
            null,
            {
                shape: shapes['Hull_01']
            });
        tankBody.setScale(scale);
        tankBody.setFrictionAir(0.2);
        tankBody.setMass(10);

        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: tankBody.body,
            group: 0,
            category: PhysicsCategories.RobotBody,
            collidesWithCategories:
                PhysicsCategories.RobotBody |
                PhysicsCategories.Walls |
                PhysicsCategories.RobotProjectile
        });

        RobotsData_PhysicsBodies.robotBodyImages[currentRobotIndex] = tankBody;

        PhysicsBodies.addArenaBodies([tankBody]);

        // TANK TURRET
        var tankTurret = MatterPhysicsHelpers.loadImage({ x: 0, y: 0, id: 'Weapon_Color_A/Gun_01' });
        tankTurret.setScale(scale);
        tankTurret.setAngle(0);
        tankTurret.setCollisionCategory(PhysicsCategories.RobotTurret);
        tankTurret.setCollidesWith(0);

        // Set the origin of the turret to the base of the turret
        tankTurret.setOrigin(0.5, 0.75);

        // Create a constraint to attach the turret to the body
        var turretConstraint = gameContext.matter.add.constraint(tankBody, tankTurret, 0, 1);

        RobotsData_PhysicsBodies.robotTurretImages[currentRobotIndex] = tankTurret;
    };

    var obj = {
        createRobot: createRobot
    };

    return obj;
}());
