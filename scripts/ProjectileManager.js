"use script";

var ProjectileManager = (function() {
    var createProjectile = function({ x, y, angle, projectileType }) {
        var gameContext = GameContextHolder.gameContext;

        var projectilesCollisionData = gameContext.cache.json.get('Projectiles_CollisionData');
        const bullet = gameContext.matter.add.sprite(
            x,
            y,
            projectileType,
            null,
            {
                shape: projectilesCollisionData[projectileType]
            });
        //var bullet = GameContextHolder.gameContext.add.image(x, y, projectileType);
        bullet.setAngle(angle);

        var velocity = {
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

        bullet.body.onCollideCallback = function() {
            console.log('collided');
            bullet.destroy();
        };

        return bullet;
    };

    var obj = {
        fireRobotProjectile: function(robotIndex, projectileType) {
            var turret = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            var angle = turret.angle - 90;

            var turretTipPosition = new Phaser.Math.Vector2();
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
