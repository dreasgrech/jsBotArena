"use script";

const ProjectileManager = (function() {
    let projectilesCollisionData;
    let gameContext;
    let currentProjectileIndex = 0;

    const pools = [];

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
        system_create: function() {
            gameContext = GameContextHolder.gameContext;

            projectilesCollisionData = gameContext.cache.json.get('Projectiles_CollisionData');
            // console.log("projectilesCollisionData", projectilesCollisionData);

            for (let projectileTypeField in ProjectileTypes) {
                if (!ProjectileTypes.hasOwnProperty(projectileTypeField)) {
                    continue;
                }

                const projectileTypeIndex = ProjectileTypes[projectileTypeField];
                const projectilePhaserImageKey = ProjectilesDatabase.phaserImageKeys[projectileTypeIndex];
                const pool = MatterBodyPoolFactory.createMatterBodyPool({
                    poolName: `Projectiles (${projectilePhaserImageKey})`,
                    createElement: function() {
                        const projectileImage = gameContext.matter.add.sprite(
                            0,
                            0,
                            projectilePhaserImageKey
                        );
                        return projectileImage;
                    },
                    //    beforePush: function(){},
                    //    afterPop: function(){},
                });

                // Prepopulate the pool
                pool.prePopulate(10);

                pools[projectileTypeIndex] = pool;
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
            const turretImage = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
            const angle = turretImage.angle;

            const robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            const robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];

            /*
            const turretTipPosition = new Phaser.Math.Vector2();
            turretImage.getTopLeft(turretTipPosition); // Get the turretImage's top-left position
            //turretTipPosition.x += turretImage.width*.2;// * Math.cos(Phaser.Math.DegToRad(angle)); // Calculate the tip's x position
            // turretTipPosition.y += turretImage.width * Math.sin(Phaser.Math.DegToRad(angle)); // Calculate the tip's y position

            //const x = turretTipPosition.x;
            //const y = turretTipPosition.y;
            */
            const x = robotPositionX;
            const y = robotPositionY;

            const pool = pools[projectileType];
            const bullet = pool.pop();
            bullet.setPosition(x, y);
            PhysicsBodies.enableMatterBody(bullet);

            const projectileCollisionDataName = ProjectilesDatabase.physicsEditorSpriteNames[projectileType];
            bullet.setBody(projectilesCollisionData[projectileCollisionDataName], null);
            bullet.depth = GameObjectDepths.Projectile;
            bullet.setDensity(5); 
            // bullet.setFrictionAir(0);
            bullet.setFrictionAir(0.001);
            bullet.setBounce(0);
            bullet.setAngle(angle);

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

            // Add the projectile as part of the arena bodies collection
            PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.RobotProjectile, [bulletPhysicsBody]); // Add all the bodies from the arena to the arena bodies collection

            const angleRad = Phaser.Math.DegToRad(angle);
            const speed = ProjectilesDatabase.speeds[projectileType];
            bullet.setVelocity(Math.cos(angleRad) * speed, Math.sin(angleRad) * speed);

            ProjectilesData.matterBody[currentProjectileIndex] = bullet;
            ProjectilesData.projectileType[currentProjectileIndex] = projectileType;
            projectileMatterBodyID_to_ProjectileIndex[bullet.body.id] = currentProjectileIndex;

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

            // Remove the projectile from the arena bodies collection
            PhysicsBodies.removeArenaPhysicsBody(projectile.body);

            projectilePool.push(projectile);
        }
    };

    return projectileManager;
}());
