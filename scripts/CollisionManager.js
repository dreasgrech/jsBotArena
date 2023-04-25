"use strict";

const CollisionManager = (function() {

    const saveBodyCollision = function(collidingBody, collidedWithBody) {
        const collidingBodyID = collidingBody.parent.id;
        // const collidingBodyObjectType = PhysicsBodies.matterBodyToObjectType[collidingBodyID];
        const collidingBodyObjectType = PhysicsBodies.resolveObjectTypeFromMatterObjectID(collidingBodyID);

        // Logger.log(`Checking for body id: `, collidingBodyID, `.  Body Type: `, collidingBodyObjectType);

        // If this colliding body is a robot...
        if (collidingBodyObjectType.type === PhysicsCategories.RobotBody) {
            // const collidingBodyRobotIndex = PhysicsBodies.matterObjectIDToEntityIndex[collidingBodyID];
            const collidingBodyRobotIndex = PhysicsBodies.resolveEntityIndexFromMatterObjectID(collidingBodyID);
            const collidingBodyRobotCollisions = RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex];

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

            // If this robot has collided with another robot...
            if (collidedWithBodyObjectType.type === PhysicsCategories.RobotBody) {
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
            }

            collidingBodyRobotCollisions.push(eventInfo);

            RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex] = collidingBodyRobotCollisions;
            // console.log(`Saved RobotsData_CurrentData.robotCollisions[${collidingBodyRobotIndex}] = ${collidingBodyRobotCollisions.length}`);
        }
    };

    // Holds the keys that map to the different collisions that can happen
    const collisionHandlers = {};

    const handleCollision_RobotToRobot = function(bodyA, bodyB) {};
    const handleCollision_RobotToProjectile = function(bodyA, bodyB) {};
    const handleCollision_RobotToArena = function(bodyA, bodyB) {};
    const handleCollision_ProjectileToProjectile = function(bodyA, bodyB) {};
    const handleCollision_ProjectileToArena = function(bodyA, bodyB) {};

    const obj = {
        initialCreate: function() {

            // Set up all the collision handlers lookups
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotBody, PhysicsCategories.RobotBody)] = handleCollision_RobotToRobot;
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotBody, PhysicsCategories.RobotProjectile)] = handleCollision_RobotToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotBody, PhysicsCategories.Walls)] = handleCollision_RobotToArena;
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotProjectile, PhysicsCategories.RobotProjectile)] = handleCollision_ProjectileToProjectile;
            collisionHandlers[EnumHelpers.createLookupKey(PhysicsCategories.RobotProjectile, PhysicsCategories.Walls)] = handleCollision_ProjectileToArena;

            Logger.log(collisionHandlers);
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
                    const bodyA_ObjectType = PhysicsBodies.resolveObjectTypeFromMatterObjectID(bodyA_id);

                    const bodyB = pair.bodyB;
                    const bodyB_id = bodyB.parent.id;
                    const bodyB_ObjectType = PhysicsBodies.resolveObjectTypeFromMatterObjectID(bodyB_id);

                    const collisionLookupKey = EnumHelpers.createLookupKey(bodyA_ObjectType, bodyB_ObjectType);
                    const collisionHandler = collisionHandlers[collisionLookupKey];

                    if (collisionHandler != null) {
                        console.log('Found handler:', collisionHandler);
                        Logger.log('Found handler:', collisionHandler, ' => ', bodyA_ObjectType, 'and', bodyB_ObjectType, '. Key:', collisionLookupKey);
                    } else {
                        Logger.error('Unable to find collision handler for', bodyA_ObjectType, 'and', bodyB_ObjectType, '. Key:', collisionLookupKey);
                    }

                    Logger.log(bodyA, bodyB);

                    saveBodyCollision(bodyA, bodyB);
                    saveBodyCollision(bodyB, bodyA);
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