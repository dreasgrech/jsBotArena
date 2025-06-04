"use strict";

/**
 * In charge of creating and maintaining the projectiles
 */
const ProjectileManager = (function() {
    const PROJECTILES_COLLISION_DATA_PATH = './CollisionData/Projectiles_CollisionData.json';

    let projectilesCollisionData;
    let scene;
    let currentProjectileIndex = 0;
    let totalSpawnedProjectiles = 0;

    const pools = [];
    
    /** Holds the Matter bodies of the projectiles */
    const projectileIndex_to_ProjectileGameObject = {};

    const projectileMatterBodyID_to_ProjectileIndex = {};
    const queuedProjectilesForRemoval = new Set();
    const currentlySpawnedProjectilesIndexes = new Set();

    // const resolveProjectileType_from_Projectile = function(projectileMatterGameObject) {
    //     const projectileIndex = projectileManager.resolveProjectileIndex_from_Projectile(projectileMatterGameObject);
    //     return ProjectilesData_projectileType[projectileIndex];
    // };

    const destroyProjectile = function(projectileMatterGameObject) {
        const projectileIndex = projectileManager.resolveProjectileIndex_from_Projectile(projectileMatterGameObject);
        
        // const projectileType = resolveProjectileType_from_Projectile(projectileMatterGameObject);
        const projectileType = ProjectilesData_projectileType[projectileIndex];
        const projectilePoolIndex = pools[projectileType];
        //Logger.log("Destroying Projectile.  Resolved type:", projectileType, ".  Object type:", JSObjectOperations.getObjectTypeName(projectileMatterGameObject));

        const projectileMatterBody = projectileMatterGameObject.body;
        // Remove the projectile from the arena bodies collection
        PhysicsBodiesManager.removeArenaPhysicsBody(projectileMatterBody);
        //RaycastManager.removeMappedGameObjects(projectileMatterGameObject);

        // projectilePool.push(projectileMatterGameObject);
        MatterGameObjectPoolManager.returnMatterGameObjectToPool(projectilePoolIndex, projectileMatterGameObject);

        const projectileMatterBodyID = projectileMatterBody.id;
        delete projectileIndex_to_ProjectileGameObject[projectileIndex];
        delete projectileMatterBodyID_to_ProjectileIndex[projectileMatterBodyID];
        ProjectilesData_projectileType[projectileIndex] = null;
        
        currentlySpawnedProjectilesIndexes.delete(projectileIndex);
        
        totalSpawnedProjectiles--;
    };
    
    const removeQueuedProjectiles = function (){
        for (const projectileMatterGameObject of queuedProjectilesForRemoval) {
            destroyProjectile(projectileMatterGameObject);
        }

        queuedProjectilesForRemoval.clear();
    };

    const projectileManager = {
        system_preloadOnce: function() {
            scene = GameContextHolder.scene;
            
            // gameContext.load.json('Projectiles_CollisionData', PROJECTILES_COLLISION_DATA_PATH);
            JSONDatabaseReader.loadDatabase('Projectiles_CollisionData', PROJECTILES_COLLISION_DATA_PATH, function (data){
                // console.log("from preloadOnce", data);
                projectilesCollisionData = data;
            });

            const tweakPaneFolderID = TweakPaneManager.createFolder("Projectile Manager");
            const dataForTweakPane = {
                get totalSpawnedProjectiles() {
                    return totalSpawnedProjectiles;
                },
                get totalQueuedProjectilesForRemoval() {
                    return queuedProjectilesForRemoval.size;
                },
                // get totalRobotsLastFiredTime() {
                //     return robotsLastFiredTime.length;
                // }
            };

            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'totalSpawnedProjectiles');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'totalQueuedProjectilesForRemoval');
            // TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'totalRobotsLastFiredTime');
        },
        system_afterPreloadOnce: function() {
            // projectilesCollisionData = gameContext.cache.json.get('Projectiles_CollisionData');
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
                        const projectileMatterGameObject = scene.matter.add.sprite(
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
        },
        system_onEndOfFrame: function() {
            removeQueuedProjectiles();
        },
        /**
         * Fires a projectile from the robot's turret.
         * Returns true if the shot was fired.
         * @param {number} robotIndex
         * @param {ProjectileTypes} projectileType
         * @returns {boolean}
         */
        spawnRobotProjectile: function(robotIndex, projectileType) {
            // const allowedToFireNow = projectileManager.robotAllowedToFireNow(robotIndex);
            // if (!allowedToFireNow) {
            //     return false;
            // }

            const turretImage = RobotsData_PhysicsBodies_robotTurretGameObjects[robotIndex];
            const turretAngle_degrees = turretImage.angle;
            const turretTipPosition = RobotsBoundsHelpers.getTurretTipPosition(turretImage);
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

            // todo: needs to be renamed
            projectileIndex_to_ProjectileGameObject[currentProjectileIndex] = projectileMatterGameObject;
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

            
            currentlySpawnedProjectilesIndexes.add(currentProjectileIndex);

            // Prepare variables for the next projectile to be spawned
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
            // Destroy all currently active projectiles
            for (const projectileIndex of currentlySpawnedProjectilesIndexes) {
                const projectileGameObject = projectileIndex_to_ProjectileGameObject[projectileIndex];
                destroyProjectile(projectileGameObject);
            }
            removeQueuedProjectiles();
            
            // Make sure everything is cleaned up
            Logger.assert(Object.getOwnPropertyNames(projectileIndex_to_ProjectileGameObject).length === 0, "projectileIndex_to_ProjectileGameObject.length should be 0: " + Object.getOwnPropertyNames(projectileIndex_to_ProjectileGameObject).length);
            Logger.assert(Object.getOwnPropertyNames(projectileMatterBodyID_to_ProjectileIndex).length === 0, "projectileMatterBodyID_to_ProjectileIndex.length should be 0: " + Object.getOwnPropertyNames(projectileMatterBodyID_to_ProjectileIndex).length);
            Logger.assert(queuedProjectilesForRemoval.size === 0, "queuedProjectilesForRemoval.size should be 0: " + queuedProjectilesForRemoval.size);
            Logger.assert(currentlySpawnedProjectilesIndexes.size === 0, "currentlySpawnedProjectilesIndexes.size should be 0: " + currentlySpawnedProjectilesIndexes.size);
            Logger.assert(totalSpawnedProjectiles === 0, "totalSpawnedProjectiles should be 0: " + totalSpawnedProjectiles);

            // TODO: Angelica: stay cute <3. Be a mazz (just like you already are) <3
            currentProjectileIndex = 0;
        }
    };

    return projectileManager;
}());