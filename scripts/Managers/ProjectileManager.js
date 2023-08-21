"use script";

const ProjectileManager = (function() {

    const PROJECTILES_COLLISION_DATA_PATH = './CollisionData/Projectiles_CollisionData.json';

    // The minimum time between firing projectiles
    const BASE_PROJECTILE_INTERVAL_DELAY_SECONDS = 1;

    /** Holds the Matter bodies of the projectiles */
    const ProjectilesData_matterBody = [];

    let projectilesCollisionData;
    let gameContext;
    let currentProjectileIndex = 0;
    let totalSpawnedProjectiles = 0;

    const pools = [];

    const projectileMatterBodyID_to_ProjectileIndex = {};
    const queuedProjectilesForRemoval = new Set();
    const robotsLastFiredTime = [];
    const robotFiringProjectilesActiveAnimationSprites = {};

    const resolveProjectileType_from_Projectile = function(projectileMatterGameObject) {
        const projectileIndex = projectileManager.resolveProjectileIndex_from_Projectile(projectileMatterGameObject);
        return ProjectilesData_projectileType[projectileIndex];
    };

    const destroyProjectile = function(projectileMatterGameObject) {
        const projectileType = resolveProjectileType_from_Projectile(projectileMatterGameObject);
        const projectilePoolIndex = pools[projectileType];
        const projectileIndex = projectileManager.resolveProjectileIndex_from_Projectile(projectileMatterGameObject);
        //Logger.log("Destroying Projectile.  Resolved type:", projectileType, ".  Object type:", JSObjectOperations.getObjectTypeName(projectileMatterGameObject));

        // Remove the projectile from the arena bodies collection
        PhysicsBodiesManager.removeArenaPhysicsBody(projectileMatterGameObject.body);
        //RaycastManager.removeMappedGameObjects(projectileMatterGameObject);

        // projectilePool.push(projectileMatterGameObject);
        MatterGameObjectPoolManager.returnMatterGameObjectToPool(projectilePoolIndex, projectileMatterGameObject);

        const projectileMatterBodyID = projectileMatterGameObject.id;
        //delete ProjectilesData_matterBody[projectileIndex];
        //delete ProjectilesData_projectileType[projectileIndex];
        //delete projectileMatterBodyID_to_ProjectileIndex[projectileMatterBodyID];
        ProjectilesData_matterBody[projectileIndex] = null;
        ProjectilesData_projectileType[projectileIndex] = null;
        projectileMatterBodyID_to_ProjectileIndex[projectileMatterBodyID] = null;
        
        totalSpawnedProjectiles--;
    };

    AnimationManager.registerAnimationCompleteCallback(function(spriteIndex) {
        const robotFiringProjectileAnimationSpriteIndex = robotFiringProjectilesActiveAnimationSprites[spriteIndex];
        if (robotFiringProjectileAnimationSpriteIndex >= 0) {
            // console.log("firing animation complete", robotFiringProjectileAnimationSpriteIndex);
            delete robotFiringProjectilesActiveAnimationSprites[spriteIndex];
        }
    });

    const projectileManager = {
        system_preloadOnce: function() {
            gameContext = GameContextHolder.scene;
            
            gameContext.load.json('Projectiles_CollisionData', PROJECTILES_COLLISION_DATA_PATH);
            // JSONDatabaseReader.loadDatabase('Projectiles_CollisionData', PROJECTILES_COLLISION_DATA_PATH, function (data){
            //     console.log("from preloadOnce", data);
            //     projectilesCollisionData = data;
            // });
        },
        system_afterPreloadOnce: function() {
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
                        const projectileCollisionDataName = ProjectilesDatabase.physicsEditorSpriteNames[projectileTypeIndex];
                        const projectileMatterGameObject = gameContext.matter.add.sprite(
                            0,
                            0,
                            ImageDatabase.GameElementsSpritesheetKey,
                            projectilePhaserImageKey,
                            {
                                shape: projectilesCollisionData[projectileCollisionDataName],
                            }
                        );

                        // Logger.log(projectileMatterGameObject, projectileMatterGameObject.body.isSensor);

                        return projectileMatterGameObject;
                    },
                    //    beforePush: function(){},
                    //    afterPop: function(){},
                });

                // Prepopulate the pool
                MatterGameObjectPoolManager.prePopulateMatterGameObjectsPool(poolIndex, PoolsPrepopulateValues.Projectiles);

                pools[projectileTypeIndex] = poolIndex;
            }

            const tweakPaneFolderID = TweakPaneManager.createFolder("Projectile Manager");
            const dataForTweakPane = {
                get totalSpawnedProjectiles() {
                    return totalSpawnedProjectiles;
                },
                get totalQueuedProjectilesForRemoval() {
                    return queuedProjectilesForRemoval.size;
                },
                get totalRobotsLastFiredTime() {
                    return robotsLastFiredTime.length;
                }
            };

            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'totalSpawnedProjectiles');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'totalQueuedProjectilesForRemoval');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'totalRobotsLastFiredTime');
        },
        update: function() {
            // Update all the currently active robot firing projectiles muzzle flash animations
            // to stay attached to the turret tip
            for (let fireShotAnimationSpriteIndex in robotFiringProjectilesActiveAnimationSprites) {
                if (!robotFiringProjectilesActiveAnimationSprites.hasOwnProperty(fireShotAnimationSpriteIndex)) {
                    continue;
                }

                const robotIndex = robotFiringProjectilesActiveAnimationSprites[fireShotAnimationSpriteIndex];
                //Logger.log(
                //    'fireShotAnimationSpriteIndex',
                //    fireShotAnimationSpriteIndex,
                //    'robotIndex',
                //    robotIndex);

                const turretTipPosition = RobotsBoundsHelpers.getTurretTipPosition(robotIndex);
                const turretTipPositionX = turretTipPosition.x;
                const turretTipPositionY = turretTipPosition.y;
                const turretImage = RobotsData_PhysicsBodies_robotTurretGameObjects[robotIndex];
                const turretAngle_degrees = turretImage.angle;

                AnimationManager.setSpritePositionAndAngle(
                    fireShotAnimationSpriteIndex,
                    turretTipPositionX,
                    turretTipPositionY,
                    turretAngle_degrees);
            }
        },
        onRobotAdded: function(robotIndex) {
            robotsLastFiredTime[robotIndex] = -BASE_PROJECTILE_INTERVAL_DELAY_SECONDS;
        },
        system_onEndOfFrame: function() {
            for (const projectileMatterGameObject of queuedProjectilesForRemoval) {
                destroyProjectile(projectileMatterGameObject);
            }

            queuedProjectilesForRemoval.clear();
        },
        /**
         * Returns a value indicating whether the specified robot can currently fire
         * @param {number} robotIndex
         * @returns {boolean}
         */
        robotAllowedToFireNow: function(robotIndex) {
            const now = GameContextHolder.gameTime;
            const robotLastFiredTime = robotsLastFiredTime[robotIndex];
            const allowedToFireNow = now - robotLastFiredTime > BASE_PROJECTILE_INTERVAL_DELAY_SECONDS;
            return allowedToFireNow;
        },
        /**
         * Fires a projectile from the robot's turret.
         * Returns true if the shot was fired.
         * @param {number} robotIndex
         * @param {ProjectileTypes} projectileType
         * @returns {boolean}
         */
        fireRobotProjectile: function(robotIndex, projectileType) {
            const allowedToFireNow = projectileManager.robotAllowedToFireNow(robotIndex);
            if (!allowedToFireNow) {
                return false;
            }

            const turretImage = RobotsData_PhysicsBodies_robotTurretGameObjects[robotIndex];
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
            // Logger.log(projectileMatterGameObject.body.id, projectileMatterGameObject.body.isSensor);
            projectileMatterGameObject.setPosition(turretTipPositionX, turretTipPositionY);
            PhysicsBodiesManager.enableMatterBody(projectileMatterGameObject);

            //Logger.log("Matter object id before setBody:", projectileMatterGameObject.body.id);
            //const projectileCollisionDataName = ProjectilesDatabase.physicsEditorSpriteNames[projectileType];
            //projectileMatterGameObject.setBody(projectilesCollisionData[projectileCollisionDataName], null);
            //Logger.log("Matter object id after setBody:", projectileMatterGameObject.body.id);
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

            // const robotID = RobotsData_Instance_ids[robotIndex];
            const robotHullMatterGroup = RobotsData_Instance_hullMatterGroup[robotIndex];
            // Logger.log("Setting group of projectile to", -robotID);
            PhysicsHelperFunctions.setCollisionProperties({
                physicsObject: projectileMatterBody,
                //group: -robotID, // -robotID so that it doesn't collide with the robot that fired it
                group: -robotHullMatterGroup, // -robotHullMatterGroup so that it doesn't collide with the robot that fired it
                category: CollisionCategories.RobotProjectile,
                collidesWithCategories: CollisionCategoriesCollidesWith[CollisionCategories.RobotProjectile]
            });

            // Add the projectile as part of the arena bodies collection
            PhysicsBodiesManager.addDynamicArenaPhysicsBodies([projectileMatterBody]);

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
            
            // Logger.log(projectileMatterGameObject, projectileMatterGameObject.isSensor(), projectileMatterGameObject.body.id, projectileMatterGameObject.body.isSensor);

            const fireShotAnimationSpriteIndex = AnimationManager.playNewAnimation(
                AnimationEffects.TankAnimationEffects.Fire_Shots_A,
                turretTipPositionX,
                turretTipPositionY,
                turretAngle_degrees,
                GameObjectDepths.ImpactAnimation,
                ROBOT_SCALE);

            robotFiringProjectilesActiveAnimationSprites[fireShotAnimationSpriteIndex] = robotIndex;
            //robotFiringProjectilesActiveAnimationSprites[fireShotAnimationSpriteIndex] = true;

            //ObjectAnchorManager.anchorToRobot(
            //    AnimationManager.sprites[fireShotAnimationIndex],
            //    robotIndex,
            //    0,
            //    0
            //);

            //AnimationManager.sprites[fireShotAnimationIndex].setScale(ROBOT_SCALE);

            robotsLastFiredTime[robotIndex] = GameContextHolder.gameTime;

            currentProjectileIndex++;
            
            totalSpawnedProjectiles++;

            return true;
        },
        /**
         * Mark a projectile for removal so that it's removed at the end of frame
         * @param {Phaser.GameObjects.GameObject} projectileMatterGameObject
         */
        markProjectileForRemoval: function(projectileMatterGameObject) {
            // Logger.log("Marking projectile for removal", projectileMatterGameObject);
            // Add the projectile to the queue so that it gets removed later
            queuedProjectilesForRemoval.add(projectileMatterGameObject);
        },
        /**
         * Resolves the projectile index from the projectile Matter GameObject
         * @param {Phaser.Physics.Matter.Sprite} projectileMatterGameObject
         * @returns {number}
         */
        resolveProjectileIndex_from_Projectile: function(projectileMatterGameObject) {
            const projectileMatterBody = projectileMatterGameObject.body;
            const projectileMatterBodyID = projectileMatterBody.id;
            const projectileIndex = projectileMatterBodyID_to_ProjectileIndex[projectileMatterBodyID];
            // Logger.log(projectileMatterGameObject, "'s index is", projectileIndex);

            return projectileIndex;
        },
        system_unloadLevel: function() {
            // TODO: Keep track of all projectiles and remove them here
            Logger.log("Resetting ProjectileManager. TODO: Needs more work here");
            
            robotsLastFiredTime.length = 0;
        }
    };

    return projectileManager;
}());
