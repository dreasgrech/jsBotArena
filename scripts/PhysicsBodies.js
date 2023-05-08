"use strict";

const PhysicsBodies = (function() {
    let allBodies = []; // contains all the physics bodies in the arena
    let arenaBodies = []; // contains the arena bodies (walls, obstacles, etc..)

    // const matterBodyToObjectType = {};
    const matterBodyToCollisionCategory = {};
    const matterBodyIDToRobotIndex = {};

    const projectileSensorBodyIDToRobotIndex = {};

    const isBodyOverlappingWithArenaBodies = function(body) {
        const gameContext = GameContextHolder.gameContext;
        return gameContext.matter.overlap(body, allBodies);
    };

    // contains all the bodies except the body of the specific robot index
    const allOtherBodiesExceptThisRobot = []; // [[],[],[]]

    const obj = {
        getArenaBodies: function() {
            return arenaBodies;
        },
        // TODO: also need to make sure not to have duplicates in arenaBodies
        // TODO: maybe using Set is an option
        addArenaPhysicsBodies: function(collisionCategory, bodies, dynamic) {
            const arenaBodiesTotalBeforeAdd = allBodies.length;
            allBodies = allBodies.concat(bodies);

            console.assert(allBodies.length === arenaBodiesTotalBeforeAdd + bodies.length,
                "Make sure that all the elements were added");

            for (let i = 0; i < bodies.length; i++) {
                let body = bodies[i];
                matterBodyToCollisionCategory[body.id] =
                {
                    type: collisionCategory
                };

                // Logger.log("Setting", body.id, "to", collisionCategory);
            }

            // If these are arena collider bodies, add them to their own collection too
            if (collisionCategory === CollisionCategories.Arena) {
                arenaBodies = arenaBodies.concat(bodies);
            }

            RaycastManager.mapGameObjects(bodies, dynamic);
        },
        removeArenaPhysicsBody: function(body) {
            // Filter out the specified body from the arenaBodies array
            const arenaBodiesTotalBeforeRemoval = allBodies.length;
            allBodies = allBodies.filter(function(currentBody) {
                return currentBody !== body;
            });
            const arenaBodiesTotalAfterRemoval = allBodies.length;
            console.assert(arenaBodiesTotalAfterRemoval === arenaBodiesTotalBeforeRemoval - 1);

            // Remove the body's mapping from matterBodyToCollisionCategory
            delete matterBodyToCollisionCategory[body.id];

            // If the body is also associated with a robot, remove its mapping from matterObjectIDToRobotIndex
            if (matterBodyIDToRobotIndex.hasOwnProperty(body.id)) {
                delete matterBodyIDToRobotIndex[body.id];
            }

            // console.log(body);
            RaycastManager.removeMappedGameObjects(body);
        },
        mapHullImageBodyIDToRobotIndex: function(matterObjectID, robotIndex) {
            matterBodyIDToRobotIndex[matterObjectID] = robotIndex;
        },
        mapProjectileSensorBodyIDToRobotIndex: function(projectileSensorBodyID, robotIndex) {
            projectileSensorBodyIDToRobotIndex[projectileSensorBodyID] = robotIndex;
        },
        doesBodyIDBelongToRobot: function(matterObjectID) {
            const robotIndex = matterBodyIDToRobotIndex[matterObjectID];
            return robotIndex != null;
        },
        resolveRobotIndexFromMatterBodyID: function(matterObjectID) {
            const robotIndex = matterBodyIDToRobotIndex[matterObjectID];
            console.assert(matterObjectID != null);
            console.assert(robotIndex != null);
            return robotIndex;
        },
        resolveRobotIndexFromProjectileSensorBodyID: function(projectileObjectID) {
            const robotIndex = projectileSensorBodyIDToRobotIndex[projectileObjectID];
            console.assert(projectileObjectID != null);
            console.assert(robotIndex != null);
            return robotIndex;
        },
        resolveCollisionCategoryFromMatterObjectID: function(matterObjectID) {
            const collisionCategory = matterBodyToCollisionCategory[matterObjectID];
            console.assert(matterObjectID != null);
            console.assert(collisionCategory != null);
            return collisionCategory;
        },
        enableMatterBody: function(body) {
            body.setActive(true);
            body.setVisible(true);
        },
        disableMatterBody: function(body) {
            body.setCollisionCategory(null);
            body.setVelocity(0, 0);
            body.setAngularVelocity(0, 0);
            body.setAngle(0);
            body.setActive(false);
            body.setVisible(false);
        },
        isBodyOverlappingWithArenaBodies: isBodyOverlappingWithArenaBodies
    };

    return obj;
}());
