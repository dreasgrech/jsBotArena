"use script";

const ProjectileManager = (function() {
    let projectilesCollisionData;

    const obj = {
        onCreate: function() {
            var gameContext = GameContextHolder.gameContext;

            projectilesCollisionData = gameContext.cache.json.get('Projectiles_CollisionData');
            console.log("projectilesCollisionData", projectilesCollisionData);
        },
        fireRobotProjectile: function(robotIndex, projectileType) {
            const turret = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            // const angle = turret.angle - 90;
            const angle = turret.angle;

            var robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            var robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];

            /*
            const turretTipPosition = new Phaser.Math.Vector2();
            turret.getTopLeft(turretTipPosition); // Get the turret's top-left position
            //turretTipPosition.x += turret.width*.2;// * Math.cos(Phaser.Math.DegToRad(angle)); // Calculate the tip's x position
            // turretTipPosition.y += turret.width * Math.sin(Phaser.Math.DegToRad(angle)); // Calculate the tip's y position

            //var x = turretTipPosition.x;
            //var y = turretTipPosition.y;
            */
            var x = robotPositionX;
            var y = robotPositionY;

            const gameContext = GameContextHolder.gameContext;

            const bullet = gameContext.matter.add.sprite(
                x,
                y,
                projectileType,
                null,
                {
                    shape: projectilesCollisionData[projectileType]
                });

            // bullet.depth = -1;
            bullet.depth = DepthManager.Projectile;
            bullet.setDensity(5);
            bullet.setAngle(angle);
            bullet.setFrictionAir(0);
            bullet.setBounce(0);

            var robotID = RobotsData_Instance.ids[robotIndex];
            // Logger.log("Setting group of projectile to", -robotID);
            PhysicsHelperFunctions.setCollisionProperties({
                physicsObject: bullet.body,
                // group: 0,
                group: -robotID,
                category: PhysicsCategories.RobotProjectile,
                collidesWithCategories: PhysicsCategories.RobotBody |
                    PhysicsCategories.Walls |
                    PhysicsCategories.RobotProjectile
            });

            var bulletPhysicsBody = bullet.body;

            PhysicsBodies.addArenaPhysicsBodies(PhysicsObjectType.Projectile, [bulletPhysicsBody]); // Add all the bodies from the arena to the arena bodies collection

            var speed = 100;
            /*
            const velocity = {
                x: Math.cos(Phaser.Math.DegToRad(angle-90)) * 1, // Adjust bullet speed (multiplier) as needed
                y: Math.sin(Phaser.Math.DegToRad(angle-90)) * 1, // Adjust bullet speed (multiplier) as needed
            };
    
            bullet.setVelocity(velocity.x, velocity.y);
            */

            var angleRad = Phaser.Math.DegToRad(angle - 90);
            const force = new Phaser.Math.Vector2(Math.cos(angleRad) * speed, Math.sin(angleRad) * speed);
            bullet.applyForce(force);
        }
    };

    return obj;
}());
