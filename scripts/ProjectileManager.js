"use script";


const ProjectileManager = (function() {
    let projectilesCollisionData;
    let gameContext;
    let currentProjectileIndex = 0;

    // const projectileGroups = {};

    const pools = {};

    const ProjectilesData = (function() {
        const projectilesData = {
            projectileType:[],
            matterBody:[]
        };

        return projectilesData;
    }());

    const projectileMatterBodyID_to_ProjectileIndex = {};

    const queuedProjectilesForRemoval = new Set();

    const projectileManager = {
        onCreate: function() {
            gameContext = GameContextHolder.gameContext;

            projectilesCollisionData = gameContext.cache.json.get('Projectiles_CollisionData');
            // console.log("projectilesCollisionData", projectilesCollisionData);

            for (let projectileTypeField in ProjectileTypes) {
                if (!ProjectileTypes.hasOwnProperty(projectileTypeField)) {
                    continue;
                }

                const projectileType = ProjectileTypes[projectileTypeField];

                const pool = MatterBodyPoolFactory.createMatterBodyPool({
                    poolName: `Projectiles (${projectileType})`,
                    createElement: function() {
                        // Logger.log("creating projectile", projectileType);
                        const projectileImage = gameContext.matter.add.sprite(
                            0,
                            0,
                            projectileType//,
                            //null,
                            // { shape: projectilesCollisionData[projectileType] }
                        );
                        //PhysicsBodies.disableMatterBody(projectileImage);
                        return projectileImage;
                    },
                    //    beforePush: function(){},
                    //    afterPop: function(){},
                });

                pool.prePopulate(10);

                pools[projectileType] = pool;
            }
        },
        update: function(time, delta) { },
        onEndOfFrame: function() {
            for (const projectile of queuedProjectilesForRemoval) {
                // console.log(projectile);
                projectileManager.destroyProjectile(projectile);
            }

            queuedProjectilesForRemoval.clear();
        },
        fireRobotProjectile: function(robotIndex, projectileType) {
            const turret = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            // const angle = turret.angle - 90;
            const angle = turret.angle;

            const robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            const robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];

            /*
            const turretTipPosition = new Phaser.Math.Vector2();
            turret.getTopLeft(turretTipPosition); // Get the turret's top-left position
            //turretTipPosition.x += turret.width*.2;// * Math.cos(Phaser.Math.DegToRad(angle)); // Calculate the tip's x position
            // turretTipPosition.y += turret.width * Math.sin(Phaser.Math.DegToRad(angle)); // Calculate the tip's y position

            //const x = turretTipPosition.x;
            //const y = turretTipPosition.y;
            */
            const x = robotPositionX;
            const y = robotPositionY;

            const pool = pools[projectileType];
            const bullet = pool.pop();
            // console.log("bullet", bullet);
            bullet.setPosition(x, y);
            //bullet.setActive(true);
            //bullet.setVisible(true);
            PhysicsBodies.enableMatterBody(bullet);

            bullet.setBody(projectilesCollisionData[projectileType], null);
            bullet.depth = GameObjectDepths.Projectile;
            bullet.setDensity(5);
            bullet.setAngle(angle);
            bullet.setFrictionAir(0);
            bullet.setBounce(0);

            // Logger.log("created projectile", bullet);

            const robotID = RobotsData_Instance.ids[robotIndex];
            // Logger.log("Setting group of projectile to", -robotID);
            PhysicsHelperFunctions.setCollisionProperties({
                physicsObject: bullet.body,
                group: -robotID, // -robotID so that it doesn't collide with the robot that fired it
                category: CollisionCategories.RobotProjectile,
                collidesWithCategories: CollisionCategories.RobotBody |
                    CollisionCategories.Arena |
                    CollisionCategories.RobotProjectile
            });

            const bulletPhysicsBody = bullet.body;

            PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.RobotProjectile, [bulletPhysicsBody]); // Add all the bodies from the arena to the arena bodies collection

            const speed = 100;
            /*
            const velocity = {
                x: Math.cos(Phaser.Math.DegToRad(angle-90)) * 1, // Adjust bullet speed (multiplier) as needed
                y: Math.sin(Phaser.Math.DegToRad(angle-90)) * 1, // Adjust bullet speed (multiplier) as needed
            };
    
            bullet.setVelocity(velocity.x, velocity.y);
            */

            const angleRad = Phaser.Math.DegToRad(angle - 90);
            const force = new Phaser.Math.Vector2(Math.cos(angleRad) * speed, Math.sin(angleRad) * speed);
            bullet.applyForce(force);

            ProjectilesData.matterBody[currentProjectileIndex] = bullet;
            ProjectilesData.projectileType[currentProjectileIndex] = projectileType;
            projectileMatterBodyID_to_ProjectileIndex[bullet.body.id] = currentProjectileIndex;
            // console.log(bullet);
            // Logger.log("mapping", bullet.body.id, "to", currentProjectileIndex);

            currentProjectileIndex++;
        },
        // Mark a projectile for removal so that it's removed at the end of frame
        markProjectileForRemoval: function(projectile) {
            // Add the projectile to the queue so that it gets removed later
            queuedProjectilesForRemoval.add(projectile);
        },
        destroyProjectile: function(projectile) {
            const projectileIndex = projectileMatterBodyID_to_ProjectileIndex[projectile.body.id];
            const projectileType = ProjectilesData.projectileType[projectileIndex];
            const projectilePool = pools[projectileType];
            // Logger.log("destroying projectile", projectile, projectileIndex, projectileType, projectilePool);

            projectilePool.push(projectile);
        }
    };

    return projectileManager;
}());
