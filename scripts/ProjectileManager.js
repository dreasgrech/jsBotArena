"use script";

const ProjectileManager = (function() {
    const createProjectile = function({ x, y, angle, projectileType }) {
        const gameContext = GameContextHolder.gameContext;

        const projectilesCollisionData = gameContext.cache.json.get('Projectiles_CollisionData');
        const bullet = gameContext.matter.add.sprite(
            x,
            y,
            projectileType,
            null,
            {
                shape: projectilesCollisionData[projectileType]
            });
        //const bullet = GameContextHolder.gameContext.add.image(x, y, projectileType);
        bullet.setAngle(angle);

        const velocity = {
            x: Math.cos(Phaser.Math.DegToRad(angle)) * 10, // Adjust bullet speed (multiplier) as needed
            y: Math.sin(Phaser.Math.DegToRad(angle)) * 10, // Adjust bullet speed (multiplier) as needed
        };

        // gameContext.matter.add.gameObject(bullet);
        bullet.setVelocity(velocity.x, velocity.y);
        bullet.setFrictionAir(0);
        bullet.setBounce(1);
        PhysicsHelperFunctions.setCollisionProperties({
            physicsObject: bullet.body,
            group: 0,
            category: PhysicsCategories.RobotProjectile,
            collidesWithCategories: PhysicsCategories.RobotBody |
                PhysicsCategories.Walls |
                PhysicsCategories.RobotProjectile
        });

        //bullet.body.onCollideCallback = function() {
        //    console.log('collided');
        //    bullet.destroy();
        //};

        return bullet;
    };

    const obj = {
        fireRobotProjectile: function(robotIndex, projectileType) {
            const turret = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            const angle = turret.angle - 90;

            const turretTipPosition = new Phaser.Math.Vector2();
            turret.getTopLeft(turretTipPosition); // Get the turret's top-left position
            turretTipPosition.x += turret.width * Math.cos(Phaser.Math.DegToRad(angle)); // Calculate the tip's x position
            turretTipPosition.y += turret.width * Math.sin(Phaser.Math.DegToRad(angle)); // Calculate the tip's y position

            createProjectile({
                x: turretTipPosition.x,
                y: turretTipPosition.y,
                angle: angle,
                projectileType: projectileType
            });
        }
    };

    return obj;
}());
