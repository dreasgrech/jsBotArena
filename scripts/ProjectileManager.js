"use script";

const ProjectileManager = (function() {

    // The minimum time between firing projectiles
    const BASE_PROJECTILE_INTERVAL_DELAY_SECONDS = 1;

    let projectilesCollisionData;
    let gameContext;
    let currentProjectileIndex = 0;

    const pools = [];

    const projectileMatterBodyID_to_ProjectileIndex = {};

    const queuedProjectilesForRemoval = new Set();

    const robotsLastFiredTime = [];

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
                const poolIndex = MatterGameObjectPoolManager.createMatterGameObjectPool({
                    poolName: `Projectiles (${projectilePhaserImageKey})`,
                    createElement: function() {
                        const projectileMatterGameObject = gameContext.matter.add.sprite(
                            0,
                            0,
                            projectilePhaserImageKey
                        );
                        return projectileMatterGameObject;
                    },
                    //    beforePush: function(){},
                    //    afterPop: function(){},
                });

                // Prepopulate the pool
                // TODO: Increase the prepopulate number when everything is stable
                MatterGameObjectPoolManager.prePopulateMatterGameObjectsPool(poolIndex, 1);

                pools[projectileTypeIndex] = poolIndex;
            }
        },
        update: function() { },
        onRobotAdded: function(robotIndex) {
            robotsLastFiredTime[robotIndex] = -BASE_PROJECTILE_INTERVAL_DELAY_SECONDS;
        },
        onEndOfFrame: function() {
            for (const projectileMatterGameObject of queuedProjectilesForRemoval) {
                projectileManager.destroyProjectile(projectileMatterGameObject);
            }

            queuedProjectilesForRemoval.clear();
        },
        robotAllowedToFireNow: function(robotIndex) {
            const now = GameContextHolder.gameTime;
            const robotLastFiredTime = robotsLastFiredTime[robotIndex];
            const allowedToFireNow = now - robotLastFiredTime > BASE_PROJECTILE_INTERVAL_DELAY_SECONDS;
            return allowedToFireNow;
        },
        fireRobotProjectile: function(robotIndex, projectileType) {
            const allowedToFireNow = projectileManager.robotAllowedToFireNow(robotIndex);
            if (!allowedToFireNow) {
                return false;
            }

            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            const turretAngle_degrees = turretImage.angle;

            //const robotPositionX = RobotsData_CurrentData.positionXs[robotIndex];
            //const robotPositionY = RobotsData_CurrentData.positionYs[robotIndex];
            //const x = robotPositionX;
            //const y = robotPositionY;

            const turretTipPosition = RobotsBoundsHelpers.getTurretTipPosition(robotIndex);
            const turretTipPositionX = turretTipPosition.x;
            const turretTipPositionY = turretTipPosition.y;

            const poolIndex = pools[projectileType];
            const projectileMatterGameObject = MatterGameObjectPoolManager.fetchMatterGameObjectFromPool(poolIndex);
            projectileMatterGameObject.setPosition(turretTipPositionX, turretTipPositionY);
            PhysicsBodies.enableMatterBody(projectileMatterGameObject);

            const projectileCollisionDataName = ProjectilesDatabase.physicsEditorSpriteNames[projectileType];
            projectileMatterGameObject.setBody(projectilesCollisionData[projectileCollisionDataName], null);
            projectileMatterGameObject.depth = GameObjectDepths.Projectile;
            // projectileMatterGameObject.setDensity(5); 
            projectileMatterGameObject.setDensity(0.1); 
            // projectileMatterGameObject.setFrictionAir(0);
            projectileMatterGameObject.setFrictionAir(0.001);
            projectileMatterGameObject.setBounce(0);
            projectileMatterGameObject.setAngle(turretAngle_degrees);

            //Logger.log("Projectile area", projectileMatterGameObject.body.area, "density", projectileMatterGameObject.body.density, "mass", projectileMatterGameObject.body.mass);

            // Logger.log("created projectile", projectileMatterGameObject);
            const projectileMatterBody = projectileMatterGameObject.body;

            const robotID = RobotsData_Instance_ids[robotIndex];
            // Logger.log("Setting group of projectile to", -robotID);
            PhysicsHelperFunctions.setCollisionProperties({
                physicsObject: projectileMatterBody,
                group: -robotID, // -robotID so that it doesn't collide with the robot that fired it
                category: CollisionCategories.RobotProjectile,
                // collidesWithCategories: CollisionCategories.RobotBody |
                collidesWithCategories: CollisionCategories.RobotProjectileSensor |
                    CollisionCategories.Arena |
                    CollisionCategories.RobotProjectile
            });

            // Add the projectile as part of the arena bodies collection
            PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.RobotProjectile, [projectileMatterBody], true); // Add all the bodies from the arena to the arena bodies collection

            ProjectilesData_matterBody[currentProjectileIndex] = projectileMatterGameObject;
            ProjectilesData_projectileType[currentProjectileIndex] = projectileType;
            projectileMatterBodyID_to_ProjectileIndex[projectileMatterBody.id] = currentProjectileIndex;
            // console.log("creating bullet", projectileMatterGameObject);

            // Fire the projectile
            const angle_radians = Phaser.Math.DegToRad(turretAngle_degrees);
            const speed = ProjectilesDatabase.speeds[projectileType];
            projectileMatterGameObject.setVelocity(Math.cos(angle_radians) * speed, Math.sin(angle_radians) * speed);
            //const force = new Phaser.Math.Vector2(Math.cos(angle_radians) * speed, Math.sin(angle_radians) * speed);
            //projectileMatterGameObject.applyForce(force);

            //const dt = GameContextHolder.deltaTime;
            //projectileMatterGameObject.setVelocity(Math.cos(angle_radians) * speed * dt, Math.sin(angle_radians) * speed * dt);

            // Logger.log("mapping", projectileMatterGameObject.body.id, "to", currentProjectileIndex);

            const fireShotAnimationIndex = AnimationManager.playAnimation(
                AnimationEffects.TankAnimationEffects.Fire_Shots_A,
                turretTipPositionX,
                turretTipPositionY,
                turretAngle_degrees,
                GameObjectDepths.ImpactAnimation,
                ROBOT_SCALE);

            //ObjectAnchorManager.anchorToRobot(
            //    AnimationManager.sprites[fireShotAnimationIndex],
            //    robotIndex,
            //    0,
            //    0
            //);

            //AnimationManager.sprites[fireShotAnimationIndex].setScale(ROBOT_SCALE);

            const now = GameContextHolder.gameTime;
            robotsLastFiredTime[robotIndex] = now;

            currentProjectileIndex++;

            return true;
        },
        // Mark a projectile for removal so that it's removed at the end of frame
        markProjectileForRemoval: function(projectileMatterGameObject) {
            // Add the projectile to the queue so that it gets removed later
            queuedProjectilesForRemoval.add(projectileMatterGameObject);
        },
        destroyProjectile: function(projectileMatterGameObject) {
            const projectileType = projectileManager.resolveProjectileType_from_Projectile(projectileMatterGameObject);
            const projectilePoolIndex = pools[projectileType];
            //Logger.log("Destroying Projectile.  Resolved type:", projectileType, ".  Object type:", JSObjectOperations.getObjectTypeName(projectileMatterGameObject));

            // Remove the projectile from the arena bodies collection
            PhysicsBodies.removeArenaPhysicsBody(projectileMatterGameObject.body);
            //RaycastManager.removeMappedGameObjects(projectileMatterGameObject);

            // projectilePool.push(projectileMatterGameObject);
            MatterGameObjectPoolManager.returnMatterGameObjectToPool(projectilePoolIndex, projectileMatterGameObject);
        },
        resolveProjectileIndex_from_Projectile: function(projectileMatterGameObject) {
            const projectileMatterBody = projectileMatterGameObject.body;
            const projectileMatterBodyID = projectileMatterBody.id;
            const projectileIndex = projectileMatterBodyID_to_ProjectileIndex[projectileMatterBodyID];
            // Logger.log(projectileMatterGameObject, "'s index is", projectileIndex);

            return projectileIndex;
        },
        resolveProjectileType_from_Projectile: function(projectileMatterGameObject) {
            const projectileIndex = projectileManager.resolveProjectileIndex_from_Projectile(projectileMatterGameObject);
            const projectileType = ProjectilesData_projectileType[projectileIndex];

            return projectileType;
        }
    };

    return projectileManager;
}());
