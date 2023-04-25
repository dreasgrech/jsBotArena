"use strict";

const CollisionManager = (function() {

    const saveCollision_RobotToRobot = function(collidingBody, collidedWithBody) {
        // const collidingBodyID = collidingBody.parent.id;

        // Logger.log(`Checking for body id: `, collidingBodyID, `.  Body Type: `, collidingBodyObjectType);

        // const collidingBodyRobotIndex = PhysicsBodies.resolveEntityIndexFromMatterObjectID(collidingBodyID);
        // const collidingBodyRobotCollisions = RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex];

        // Add the information about the other collision for this robot
        const collidedWithBodyID = collidedWithBody.parent.id;
        // const collidedWithBodyObjectType = PhysicsBodies.matterBodyToObjectType[collidedWithBodyID];
        const collidedWithBodyObjectType = PhysicsBodies.resolveObjectTypeFromMatterObjectID(collidedWithBodyID);
        if (collidedWithBodyObjectType == null) {
            throw "collidedWithBodyObjectType is undefined!!";
            return;
        }

        // Create the event info object which will be passed to the robots api
        const eventInfo = {
            type: collidedWithBodyObjectType.type,
            data: {}
        };

        // const collidedWithBodyRobotIndex = PhysicsBodies.matterObjectIDToEntityIndex[collidedWithBodyID];
        const collidedWithBodyRobotIndex = PhysicsBodies.resolveEntityIndexFromMatterObjectID(collidedWithBodyID);
        // console.log(`bot #${collidingBodyRobotIndex} collided with bot #${collidedWithBodyRobotIndex}`);

        // Create the event info data
        const data = {
            robotIndex: collidedWithBodyRobotIndex,
            name: RobotsData_Instance.names[collidedWithBodyRobotIndex],
            angle: RobotsData_CurrentData.currentRobotAngles[collidedWithBodyRobotIndex],
            velocity: RobotsData_CurrentData.currentRobotVelocities[collidedWithBodyRobotIndex]
        };

        eventInfo.data = data;

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
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotBody, PhysicsCategories.RobotBody)] = handleCollision_RobotToRobot;
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotBody, PhysicsCategories.RobotProjectile)] = handleCollision_RobotToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotBody, PhysicsCategories.Walls)] = handleCollision_RobotToArena;
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotProjectile, PhysicsCategories.RobotProjectile)] = handleCollision_ProjectileToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotProjectile, PhysicsCategories.Walls)] = handleCollision_ProjectileToArena;

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
                    const bodyA_ObjectType = PhysicsBodies.resolveObjectTypeFromMatterObjectID(bodyA_id).type;

                    const bodyB = pair.bodyB;
                    const bodyB_id = bodyB.parent.id;
                    const bodyB_ObjectType = PhysicsBodies.resolveObjectTypeFromMatterObjectID(bodyB_id).type;

                    // TODO: RENAME OBJECT TYPE TO PHYSICSCATEGORY
                    // TODO: ALSO PUT THE ENUMS IN THEIR OWN FILES
                    // TODO: ALSO, CAN THE PHYSICS CATEGORY BE DETERMINED FROM THE BODY ITSELF INSTEAD OF FROM AN ARRAY?


                    // Resolve the lookup key based on the physics category
                    const collisionLookupKey = EnumHelpers.createLookupKey(bodyA_ObjectType, bodyB_ObjectType);
                    const collisionHandler = collisionHandlers[collisionLookupKey];

                    if (collisionHandler != null) {
                        Logger.log('Found handler:', collisionHandler, ' => ', bodyA_ObjectType, 'and', bodyB_ObjectType, '. Key:', collisionLookupKey);
                        collisionHandler(bodyA, bodyB);
                    } else {
                        Logger.error('Unable to find collision handler for', bodyA_ObjectType, 'and', bodyB_ObjectType, '. Key:', collisionLookupKey);
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