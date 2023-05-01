"use strict";

const PhysicsBodies = (function() {
    let arenaBodies = []; // contains all the physics bodies in the arena
    // const matterBodyToObjectType = {};
    const matterBodyToCollisionCategory = {};
    const matterObjectIDToRobotIndex = {};

    const isBodyOverlappingWithArenaBodies = function(body) {
        const gameContext = GameContextHolder.gameContext;
        return gameContext.matter.overlap(body, arenaBodies);
    };

    const obj = {
        // TODO: also need to make sure not to have duplicates in arenaBodies
        addArenaPhysicsBodies: function(collisionCategory, bodies) {
            const arenaBodiesTotalBeforeAdd = arenaBodies.length;
            arenaBodies = arenaBodies.concat(bodies);

            console.assert(arenaBodies.length === arenaBodiesTotalBeforeAdd + bodies.length,
                "Make sure that all the elements were added");

            for (let i = 0; i < bodies.length; i++) {
                let body = bodies[i];
                matterBodyToCollisionCategory[body.id] =
                {
                    type: collisionCategory
                };

                // Logger.log("Setting", body.id, "to", collisionCategory);
            }
        },
        removeArenaPhysicsBody: function(body) {
            // Filter out the specified body from the arenaBodies array
            const arenaBodiesTotalBeforeRemoval = arenaBodies.length;
            arenaBodies = arenaBodies.filter(function(currentBody) {
                return currentBody !== body;
            });
            const arenaBodiesTotalAfterRemoval = arenaBodies.length;
            console.assert(arenaBodiesTotalAfterRemoval === arenaBodiesTotalBeforeRemoval - 1);

            // Remove the body's mapping from matterBodyToCollisionCategory
            delete matterBodyToCollisionCategory[body.id];

            // If the body is also associated with a robot, remove its mapping from matterObjectIDToRobotIndex
            if (matterObjectIDToRobotIndex.hasOwnProperty(body.id)) {
                delete matterObjectIDToRobotIndex[body.id];
            }
        },
        mapMatterObjectIDToRobotIndex: function(matterObjectID, entityIndex) {
            matterObjectIDToRobotIndex[matterObjectID] = entityIndex;
        },
        resolveRobotIndexFromMatterObjectID: function(matterObjectID) {
            return matterObjectIDToRobotIndex[matterObjectID];
        },
        resolveCollisionCategoryFromMatterObjectID: function(matterObjectID) {
            return matterBodyToCollisionCategory[matterObjectID];
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
