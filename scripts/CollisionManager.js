"use strict";

const CollisionManager = (function() {

    const saveCollision_RobotToRobot = function(collidingBody, collidedWithBody) {
        // const collidingBodyID = collidingBody.parent.id;

        // Logger.log(`Checking for body id: `, collidingBodyID, `.  Body Type: `, collidingBodyObjectType);

        // const collidingBodyRobotIndex = PhysicsBodies.resolveEntityIndexFromMatterObjectID(collidingBodyID);
        // const collidingBodyRobotCollisions = RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex];

        // Add the information about the other collision for this robot
        const collidedWithBody_ID = collidedWithBody.parent.id;
        const collidedWithBody_CollisionCategory = PhysicsBodies.resolveCollisionCategoryFromMatterObjectID(collidedWithBody_ID);
        if (collidedWithBody_CollisionCategory == null) {
            throw "collidedWithBodyObjectType is undefined!!";
            return;
        }

        const collidedWithBody_RobotIndex = PhysicsBodies.resolveEntityIndexFromMatterObjectID(collidedWithBody_ID);
        // console.log(`bot #${collidingBodyRobotIndex} collided with bot #${collidedWithBodyRobotIndex}`);

        // Create the event info object which will be passed to the robots api
        const eventInfo = {
            type: collidedWithBody_CollisionCategory.type,
            data: {
                robotIndex: collidedWithBody_RobotIndex,
                name: RobotsData_Instance.names[collidedWithBody_RobotIndex],
                angle: RobotsData_CurrentData.currentRobotAngles[collidedWithBody_RobotIndex],
                velocity: RobotsData_CurrentData.currentRobotVelocities[collidedWithBody_RobotIndex]
            }
        };

        // Save the collisions in the colliding robot's data
        const collidingBodyID = collidingBody.parent.id;
        const collidingBodyRobotIndex = PhysicsBodies.resolveEntityIndexFromMatterObjectID(collidingBodyID);
        const collidingBodyRobotCollisions = RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex];
        collidingBodyRobotCollisions.push(eventInfo);
        RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex] = collidingBodyRobotCollisions;
        // console.log(`Saved RobotsData_CurrentData.robotCollisions[${collidingBodyRobotIndex}] = ${collidingBodyRobotCollisions.length}`);
    };

    // Holds the keys that map to the different collisions that can happen
    const collisionHandlers = {};

    const handleCollision_RobotToRobot = function(bodyA, bodyB) {
        saveCollision_RobotToRobot(bodyA, bodyB);
        saveCollision_RobotToRobot(bodyB, bodyA);
    };

    const handleCollision_RobotToProjectile = function(bodyA, bodyB) {};
    const handleCollision_RobotToArena = function(bodyA, bodyB) {};
    const handleCollision_ProjectileToProjectile = function(bodyA, bodyB) {};
    const handleCollision_ProjectileToArena = function(bodyA, bodyB) {};

    const obj = {
        initialCreate: function() {

            // Set up all the collision handlers lookups.  This is the matrix which allows for the collision handler resolution
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotBody, CollisionCategories.RobotBody)] = handleCollision_RobotToRobot;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotBody, CollisionCategories.RobotProjectile)] = handleCollision_RobotToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotBody, CollisionCategories.Walls)] = handleCollision_RobotToArena;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotProjectile, CollisionCategories.RobotProjectile)] = handleCollision_ProjectileToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(CollisionCategories.RobotProjectile, CollisionCategories.Walls)] = handleCollision_ProjectileToArena;

            // Logger.log(collisionHandlers);
        },
        handleEvent_CollisionStart: function(event) {
            const eventPairs = event.pairs;

            if (eventPairs.length > 0) {
                // console.log(`[${FrameCounter.current}] Total pairs: ${eventPairs.length} `);
                RobotsData_CurrentData.totalCollisions = eventPairs.length;

                for (let i = 0; i < eventPairs.length; i++) {
                    const pair = eventPairs[i];

                    const bodyA = pair.bodyA;
                    const bodyA_id = bodyA.parent.id;
                    const bodyA_CollisionCategory = PhysicsBodies.resolveCollisionCategoryFromMatterObjectID(bodyA_id).type;

                    const bodyB = pair.bodyB;
                    const bodyB_id = bodyB.parent.id;
                    const bodyB_CollisionCategory = PhysicsBodies.resolveCollisionCategoryFromMatterObjectID(bodyB_id).type;

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
        clearPerFrameData: function() {
            // Clear all the collisions
            const totalRobots = RobotManager.getTotalRobots();
            for (let i = 0; i < totalRobots; i++) {
                RobotsData_CurrentData.robotCollisions[i] = [];
                // console.log(`cleared: ${RobotsData_CurrentData.robotCollisions[i].length} `);
            }

            RobotsData_CurrentData.totalCollisions = 0;
        }
    };

    return obj;
}());