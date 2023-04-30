"use strict";

const CollisionManager = (function() {

    const saveCollision_RobotToRobot = function(collidingBody, collidedWithBody) {
        // const collidingBodyID = collidingBody.parent.id;

        // Logger.log(`Checking for body id: `, collidingBodyID, `.  Body Type: `, collidingBodyObjectType);

        // const collidingBodyRobotIndex = PhysicsBodies.resolveRobotIndexFromMatterObjectID(collidingBodyID);
        // const collidingBodyRobotCollisions = RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex];

        // Logger.log(collidedWithBody);

        // Add the information about the other collision for this robot
        const collidedWithBody_ID = collidedWithBody.parent.id;
        const collidedWithBody_CollisionCategory = PhysicsBodies.resolveCollisionCategoryFromMatterObjectID(collidedWithBody_ID);
        if (collidedWithBody_CollisionCategory == null) {
            throw "collidedWithBodyObjectType is undefined!!";
        }

        const collidedWithBody_RobotIndex = PhysicsBodies.resolveRobotIndexFromMatterObjectID(collidedWithBody_ID);
        // Logger.log(`bot #${collidingBodyRobotIndex} collided with bot #${collidedWithBodyRobotIndex}`);

        // Create the event info object which will be passed to the robots api
        const eventInfo = {
            type: collidedWithBody_CollisionCategory.type,
            data: {
                robotIndex: collidedWithBody_RobotIndex,
                name: RobotsData_Instance.names[collidedWithBody_RobotIndex],
                angle: RobotsData_CurrentData.currentRobotAngles_PhaserDegrees[collidedWithBody_RobotIndex],
                velocity: RobotsData_CurrentData.currentRobotVelocities[collidedWithBody_RobotIndex],
                positionX: RobotsData_CurrentData.positionXs[collidedWithBody_RobotIndex],
                positionY: RobotsData_CurrentData.positionYs[collidedWithBody_RobotIndex],
            }
        };

        // Save the collisions in the colliding robot's data
        const collidingBodyID = collidingBody.parent.id;
        const collidingBodyRobotIndex = PhysicsBodies.resolveRobotIndexFromMatterObjectID(collidingBodyID);
        const collidingBodyRobotCollisions = RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex];
        collidingBodyRobotCollisions.push(eventInfo);
        RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex] = collidingBodyRobotCollisions;
        // Logger.log(`Saved RobotsData_CurrentData.robotCollisions[${collidingBodyRobotIndex}] = ${collidingBodyRobotCollisions.length}`);
    };

    const saveCollision_RobotToArena = function(robotBody, arenaBody) {
        const robotIndex = PhysicsBodies.resolveRobotIndexFromMatterObjectID(robotBody.parent.id);
        const eventInfo = {
            type: CollisionCategories.Arena,
            data: { }
        };

        RobotsData_CurrentData.arenaCollisions[robotIndex].push(eventInfo);
    };

    // Holds the keys that map to the different collisions that can happen
    const collisionHandlers = {};

    // Robot-Robot collision
    const handleCollision_RobotToRobot = function(bodyA, bodyB) {
        saveCollision_RobotToRobot(bodyA, bodyB);
        saveCollision_RobotToRobot(bodyB, bodyA);
    };

    const handleCollision_RobotToProjectile = function(bodyA, bodyB) {
        const isBodyA_Robot = bodyA.collisionFilter.category & CollisionCategories.RobotBody;
        const robotBody = isBodyA_Robot ? bodyA : bodyB;
        const projectileBody = isBodyA_Robot ? bodyB : bodyA;

        Logger.log("robot", robotBody, "projectile", projectileBody);

        // Mark the projectile for removal
        ProjectileManager.markProjectileForRemoval(projectileBody.parent.gameObject);
    };

    const handleCollision_RobotToArena = function(bodyA, bodyB) {
        const isBodyA_Arena = bodyA.collisionFilter.category & CollisionCategories.Arena;
        const robotBody = isBodyA_Arena ? bodyB : bodyA;
        const arenaBody = isBodyA_Arena ? bodyA : bodyB;

        // Logger.log("robot", robotBody, "arena", arenaBody);

        saveCollision_RobotToArena(robotBody, arenaBody);
    };
    const handleCollision_ProjectileToProjectile = function(projectileA, projectileB) {
        // Mark the projectiles for removal
        ProjectileManager.markProjectileForRemoval(projectileA.parent.gameObject);
        ProjectileManager.markProjectileForRemoval(projectileB.parent.gameObject);
    };

    const handleCollision_ProjectileToArena = function(bodyA, bodyB) {
        const isBodyA_Arena = bodyA.collisionFilter.category & CollisionCategories.Arena;
        const projectileBody = isBodyA_Arena ? bodyB : bodyA;
        const arenaBody = isBodyA_Arena ? bodyA : bodyB;

        // Logger.log("projectile", projectileBody, "arena", arenaBody);

        // Mark the projectile for removal
        ProjectileManager.markProjectileForRemoval(projectileBody.parent.gameObject);
    };

    const obj = {
        initialCreate: function() {

            // Set up all the collision handlers lookups.  This is the matrix which allows for the collision handler resolution
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotBody, CollisionCategories.RobotBody)] = handleCollision_RobotToRobot;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotBody, CollisionCategories.RobotProjectile)] = handleCollision_RobotToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotBody, CollisionCategories.Arena)] = handleCollision_RobotToArena;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotProjectile, CollisionCategories.RobotProjectile)] = handleCollision_ProjectileToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotProjectile, CollisionCategories.Arena)] = handleCollision_ProjectileToArena;

            // Logger.log(collisionHandlers);
        },
        handleEvent_CollisionStart: function(event) {
            const eventPairs = event.pairs;

            if (eventPairs.length > 0) {
                //Logger.log(`Total pairs: ${eventPairs.length}`);
                //Logger.log(eventPairs[0], eventPairs[1]);
                // RobotsData_CurrentData.totalCollisions = eventPairs.length;

                for (let i = 0; i < eventPairs.length; i++) {
                    const pair = eventPairs[i];

                    const bodyA = pair.bodyA;
                    const bodyA_parent = bodyA.parent;
                    // const bodyA_id = bodyA_parent.id;
                    // const bodyA_CollisionCategory = PhysicsBodies.resolveCollisionCategoryFromMatterObjectID(bodyA_id).type;
                    const bodyA_CollisionCategory = bodyA_parent.collisionFilter.category;
                    // Logger.log(bodyA.collisionFilter.category, bodyA.parent.collisionFilter.category);

                    const bodyB = pair.bodyB;
                    const bodyB_parent = bodyB.parent;
                    //const bodyB_id = bodyB_parent.id;
                    //const bodyB_CollisionCategory = PhysicsBodies.resolveCollisionCategoryFromMatterObjectID(bodyB_id).type;
                    const bodyB_CollisionCategory = bodyB_parent.collisionFilter.category;
                    // Logger.log(bodyB.parent.collisionFilter.category);

                    // TODO: ALSO PUT THE ENUMS IN THEIR OWN FILES
                    // TODO: ALSO, CAN THE PHYSICS CATEGORY BE DETERMINED FROM THE BODY ITSELF INSTEAD OF FROM AN ARRAY?

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
                RobotsData_CurrentData.robotCollisions[i] = [];
                RobotsData_CurrentData.arenaCollisions[i] = [];
            }

            // RobotsData_CurrentData.totalCollisions = 0;
        }
    };

    return obj;
}());