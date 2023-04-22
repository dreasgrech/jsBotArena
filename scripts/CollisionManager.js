"use strict";

var CollisionManager = (function() {

    var saveBodyCollision = function(collidingBody, collidedWithBody) {
        const collidingBodyID = collidingBody.parent.id;
        const collidingBodyRobotIndex = PhysicsBodies.matterObjectIDToEntityIndex[collidingBodyID];

        // console.log(`Checking for body id: ${collidingBodyID}.  Robot Index: ${collidingBodyRobotIndex}`);

        if (collidingBodyRobotIndex !== undefined) {
            let collidingBodyRobotCollisions = RobotsData_CurrentData.robotCollisions[collidingBodyRobotIndex];
            if (!collidingBodyRobotCollisions) {
                collidingBodyRobotCollisions = [];
            }

            // Add the information about the other collision for this robot
            const collidedWithBodyID = collidedWithBody.parent.id;
            const collidedWithBodyObjectType = PhysicsBodies.matterBodyToObjectType[collidedWithBodyID];
            collidingBodyRobotCollisions.push(collidedWithBodyObjectType);

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
            var totalRobots = RobotManager.getTotalRobots();
            for (let i = 0; i < totalRobots; i++) {
                RobotsData_CurrentData.robotCollisions[i] = [];
                // console.log(`cleared: ${RobotsData_CurrentData.robotCollisions[i].length} `);
            }

            RobotsData_CurrentData.totalCollisions = 0;
        }
    };

    return obj;
}());