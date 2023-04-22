"use strict";

const CollisionManager = (function() {

    const saveBodyCollision = function(collidingBody, collidedWithBody) {
        const collidingBodyID = collidingBody.parent.id;
        const collidingBodyObjectType = PhysicsBodies.matterBodyToObjectType[collidingBodyID];

        // console.log(`Checking for body id: ${collidingBodyID}.  Robot Index: ${collidingBodyRobotIndex}`);

        // If this colliding body is a robot...
        if (collidingBodyObjectType.type === PhysicsObjectType.RobotBody) {
            const collidingBodyRobotIndex = PhysicsBodies.matterObjectIDToEntityIndex[collidingBodyID];
            const collidingBodyRobotCollisions = RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex];

            // Add the information about the other collision for this robot
            const collidedWithBodyID = collidedWithBody.parent.id;
            const collidedWithBodyObjectType = PhysicsBodies.matterBodyToObjectType[collidedWithBodyID];
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
            if (collidedWithBodyObjectType.type === PhysicsObjectType.RobotBody) {
                const collidedWithBodyRobotIndex = PhysicsBodies.matterObjectIDToEntityIndex[collidedWithBodyID];
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

    const obj = {
        handleEvent_CollisionStart: function(event) {
            const eventPairs = event.pairs;

            if (eventPairs.length > 0) {
                // console.log(`[${FrameCounter.current}] Total pairs: ${eventPairs.length} `);
                RobotsData_CurrentData.totalCollisions = eventPairs.length;

                for (let i = 0; i < eventPairs.length; i++) {
                    const pair = eventPairs[i];

                    const bodyA = pair.bodyA;
                    const bodyB = pair.bodyB;

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