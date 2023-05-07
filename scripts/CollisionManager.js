"use strict";

const CollisionManager = (function() {

    const saveCollision_RobotToRobot = function(collidingBody, collidedWithBody) {
        // const collidingBodyID = collidingBody.parent.id;

        // Logger.log(`Checking for body id: `, collidingBodyID, `.  Body Type: `, collidingBodyObjectType);

        // const collidingBodyRobotIndex = PhysicsBodies.resolveRobotIndexFromMatterBodyID(collidingBodyID);
        // const collidingBodyRobotCollisions = RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex];

        // Logger.log(collidedWithBody);

        // Add the information about the other collision for this robot
        const collidedWithBody_ID = collidedWithBody.parent.id;
        const collidedWithBody_CollisionCategory = PhysicsBodies.resolveCollisionCategoryFromMatterObjectID(collidedWithBody_ID);
        if (collidedWithBody_CollisionCategory == null) {
            throw "collidedWithBodyObjectType is undefined!!";
        }

        const collidedWithBody_RobotIndex = PhysicsBodies.resolveRobotIndexFromMatterBodyID(collidedWithBody_ID);
        // Logger.log(`bot #${collidingBodyRobotIndex} collided with bot #${collidedWithBodyRobotIndex}`);

        // Create the event info object which will be passed to the robots api
        const eventInfo = {
            type: collidedWithBody_CollisionCategory.type,
            data: {
                robotIndex: collidedWithBody_RobotIndex,
                name: RobotsData_Instance_names[collidedWithBody_RobotIndex],
                angle: RobotsData_CurrentData_currentRobotAngles_degrees[collidedWithBody_RobotIndex],
                velocity: RobotsData_CurrentData_currentRobotVelocities[collidedWithBody_RobotIndex],
                positionX: RobotsData_CurrentData_positionXs[collidedWithBody_RobotIndex],
                positionY: RobotsData_CurrentData_positionYs[collidedWithBody_RobotIndex],
            }
        };

        // Save the collisions in the colliding robot's data
        const collidingBodyID = collidingBody.parent.id;
        const collidingBodyRobotIndex = PhysicsBodies.resolveRobotIndexFromMatterBodyID(collidingBodyID);
        const collidingBodyRobotCollisions = RobotsData_CurrentData_robotCollisions[collidingBodyRobotIndex];
        collidingBodyRobotCollisions.push(eventInfo);
        RobotsData_CurrentData_robotCollisions[collidingBodyRobotIndex] = collidingBodyRobotCollisions;
        // Logger.log(`Saved RobotsData_CurrentData.robotCollisions[${collidingBodyRobotIndex}] = ${collidingBodyRobotCollisions.length}`);
    };

    const saveCollision_RobotToArena = function(robotMatterBody, arenaMatterBody) {
        const robotIndex = PhysicsBodies.resolveRobotIndexFromMatterBodyID(robotMatterBody.parent.id);
        const eventInfo = {
            type: CollisionCategories.Arena,
            data: { }
        };

        RobotsData_CurrentData_arenaCollisions[robotIndex].push(eventInfo);
    };

    // Holds the keys that map to the different collisions that can happen
    const collisionHandlers = {};

    // Robot to Robot 
    const handleCollision_RobotToRobot = function(matterBodyA, matterBodyB) {
        // Save the collision so that the robots have access to it via their api
        saveCollision_RobotToRobot(matterBodyA, matterBodyB);
        saveCollision_RobotToRobot(matterBodyB, matterBodyA);
    };

    // Robot to Projectile
    const handleCollision_RobotToProjectile = function(matterBodyA, matterBodyB) {
        // const isBodyA_Robot = matterBodyA.collisionFilter.category & CollisionCategories.RobotBody;
        const isBodyA_RobotProjectileSensor = matterBodyA.collisionFilter.category & CollisionCategories.RobotProjectileSensor;
        const robotProjectileSensorMatterBody = isBodyA_RobotProjectileSensor ? matterBodyA : matterBodyB;
        const projectileMatterBody = isBodyA_RobotProjectileSensor ? matterBodyB : matterBodyA;

        //console.log(matterBodyA, matterBodyB);
        //console.log(robotProjectileSensorMatterBody, projectileMatterBody);

        const projectileMatterGameObject = projectileMatterBody.parent.gameObject;
        //const robotMatterGameObject = robotMatterBody.parent.gameObject;

        const projectileIndex = ProjectileManager.resolveProjectileIndex_from_Projectile(projectileMatterGameObject);
        //const robotIndex = PhysicsBodies.resolveRobotIndexFromMatterBodyID(robotMatterGameObject.body.id);
        //const robotIndex = PhysicsBodies.resolveRobotIndexFromMatterBodyID(robotProjectileSensorMatterBody.id);
        const robotIndex = PhysicsBodies.resolveRobotIndexFromProjectileBodyID(robotProjectileSensorMatterBody.id);

        // Apply the damage to the robot from the projectile
        const newRobotHealth = DamageManager.applyProjectileToRobotDamage(projectileIndex, robotIndex);

        // Check if the robot's dead.
        if (newRobotHealth === 0) {

            // Mark the robot as destroyed
            RobotManager.markRobotAsDestroyed(robotIndex);
        }

        // Mark the projectile for removal
        ProjectileManager.markProjectileForRemoval(projectileMatterGameObject);
    };

    // Robot to Arena
    const handleCollision_RobotToArena = function(matterBodyA, matterBodyB) {
        const isBodyA_Arena = matterBodyA.collisionFilter.category & CollisionCategories.Arena;
        const robotMatterBody = isBodyA_Arena ? matterBodyB : matterBodyA;
        const arenaMatterBody = isBodyA_Arena ? matterBodyA : matterBodyB;

        // Logger.log("robot", robotMatterBody, "arena", arenaMatterBody);

        // Save the collision so that the robots have access to it via their api
        saveCollision_RobotToArena(robotMatterBody, arenaMatterBody);
    };

    // Projectile to Projectile
    const handleCollision_ProjectileToProjectile = function(projectileMatterBodyA, projectileMatterBodyB) {
        // Mark the projectiles for removal
        ProjectileManager.markProjectileForRemoval(projectileMatterBodyA.parent.gameObject);
        ProjectileManager.markProjectileForRemoval(projectileMatterBodyB.parent.gameObject);
    };

    // Projectile to Arena
    const handleCollision_ProjectileToArena = function(matterBodyA, matterBodyB) {
        const isBodyA_Arena = matterBodyA.collisionFilter.category & CollisionCategories.Arena;
        const projectileMatterBody = isBodyA_Arena ? matterBodyB : matterBodyA;
        const arenaBody = isBodyA_Arena ? matterBodyA : matterBodyB;

         // Logger.log("projectile", projectileMatterBody, "arena", arenaBody);

        // Mark the projectile for removal
        ProjectileManager.markProjectileForRemoval(projectileMatterBody.parent.gameObject);
    };

    const obj = {
        initialCreate: function() {

            // Set up all the collision handlers lookups.  This is the matrix which allows for the collision handler resolution
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotBody, CollisionCategories.RobotBody)] = handleCollision_RobotToRobot;
            // collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotBody, CollisionCategories.RobotProjectile)] = handleCollision_RobotToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotProjectileSensor, CollisionCategories.RobotProjectile)] = handleCollision_RobotToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotBody, CollisionCategories.Arena)] = handleCollision_RobotToArena;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotProjectile, CollisionCategories.RobotProjectile)] = handleCollision_ProjectileToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotProjectile, CollisionCategories.Arena)] = handleCollision_ProjectileToArena;

            // Logger.log(collisionHandlers);
        },
        handleEvent_CollisionStart: function(event) {
            //Logger.log(event);
            const eventPairs = event.pairs;

            if (eventPairs.length > 0) {
                //Logger.log(`Total pairs: ${eventPairs.length}`);
                //Logger.log(eventPairs[0], eventPairs[1]);
                // RobotsData_CurrentData.totalCollisions = eventPairs.length;

                for (let i = 0; i < eventPairs.length; i++) {
                    const matterCollisionData = eventPairs[i];
                    //Logger.log(matterCollisionData);

                    const bodyA = matterCollisionData.bodyA;
                    //Logger.log("bodyA", bodyA, JSObjectOperations.getObjectTypeName(bodyA));
                    const bodyA_parent = bodyA.parent;
                    //const bodyA_parent = matterCollisionData.parentA; // <- mentioned in docs but doesnt exist
                    //Logger.log("bodyA_parent", bodyA_parent, JSObjectOperations.getObjectTypeName(bodyA_parent));
                    //Logger.log("bodyA_parent.gameObject", bodyA_parent.gameObject, JSObjectOperations.getObjectTypeName(bodyA_parent.gameObject));
                    // const bodyA_id = bodyA_parent.id;
                    // const bodyA_CollisionCategory = PhysicsBodies.resolveCollisionCategoryFromMatterObjectID(bodyA_id).type;
                    const bodyA_CollisionCategory = bodyA_parent.collisionFilter.category;
                    // Logger.log(bodyA.collisionFilter.category, bodyA.parent.collisionFilter.category);

                    const bodyB = matterCollisionData.bodyB;
                    const bodyB_parent = bodyB.parent;
                    //const bodyB_parent = matterCollisionData.parentB; // <- mentioned in docs but doesnt exist
                    //const bodyB_id = bodyB_parent.id;
                    //const bodyB_CollisionCategory = PhysicsBodies.resolveCollisionCategoryFromMatterObjectID(bodyB_id).type;
                    const bodyB_CollisionCategory = bodyB_parent.collisionFilter.category;
                    // Logger.log(bodyB.parent.collisionFilter.category);

                    // Resolve the lookup key based on the physics category
                    const collisionLookupKey = EnumHelpers.createLookupKey(bodyA_CollisionCategory, bodyB_CollisionCategory);
                    const collisionHandler = collisionHandlers[collisionLookupKey];

                    if (collisionHandler != null) {
                        // Logger.log('Found handler:', collisionHandler, ' => ', bodyA_CollisionCategory, 'and', bodyB_CollisionCategory, '. Key:', collisionLookupKey);
                        collisionHandler(bodyA, bodyB);
                    } else {
                        Logger.error('Unable to find collision handler for', bodyA_CollisionCategory, 'and', bodyB_CollisionCategory, '. Key:', collisionLookupKey);
                    }

                    // Logger.log(bodyA, bodyB);
                }
            }
        },
        onEndOfFrame: function() {
            // Clear all the collisions
            const totalRobots = RobotManager.getTotalRobots();
            for (let i = 0; i < totalRobots; i++) {
                RobotsData_CurrentData_robotCollisions[i] = [];
                RobotsData_CurrentData_arenaCollisions[i] = [];
            }

            // RobotsData_CurrentData.totalCollisions = 0;
        }
    };

    return obj;
}());