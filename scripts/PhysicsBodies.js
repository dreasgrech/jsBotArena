"use strict";

const PhysicsBodies = (function() {
    let allBodies = []; // contains all the physics bodies in the arena
    let arenaBodies = []; // contains the arena bodies (walls, obstacles, etc..)
    let arenaBodyMappingToEveryOtherArenaBody = {};

    // const matterBodyToObjectType = {};
    const matterBodyToCollisionCategory = {};
    const matterBodyIDToRobotIndex = {};

    const projectileSensorBodyIDToRobotIndex = {};

    let arenaBodySpatialHash = new rbush();

    // contains all the bodies except the body of the specific robot index
    //const allOtherBodiesExceptThisRobot = []; // [[],[],[]]

    let arenaBodiesAdded = false;

    const obj = {
        getArenaBodies: function() {
            return arenaBodies;
        },
        getArenaBody: function(arenaBodyIndex) {
            return arenaBodies[arenaBodyIndex];
        },
        getEveryOtherArenaBodyExceptThis: function(arenaBodyIndex) {
            return arenaBodyMappingToEveryOtherArenaBody[arenaBodyIndex];
        },
        // TODO: also need to make sure not to have duplicates in arenaBodies
        // TODO: maybe using Set is an option
        addArenaPhysicsBodies: function(collisionCategory, bodies, dynamic) {
            const arenaBodiesTotalBeforeAdd = allBodies.length;
            allBodies = allBodies.concat(bodies);
            const bodiesLength = bodies.length;
            console.assert(allBodies.length === arenaBodiesTotalBeforeAdd + bodiesLength,
                "Make sure that all the elements were added");


            for (let i = 0; i < bodiesLength; i++) {
                let body = bodies[i];
                matterBodyToCollisionCategory[body.id] =
                {
                    type: collisionCategory
                };

                // Logger.log("Setting", body.id, "to", collisionCategory);
            }

            // If these are arena collider bodies, add them to their own collection too
            if (collisionCategory === CollisionCategories.Arena) {
                if (arenaBodiesAdded) {
                    throw "Arena bodies already added and cannot be readded";
                }

                // arenaBodies = arenaBodies.concat(bodies);
                arenaBodies = bodies;

                const arenaBodiesElementsForSpatialHash = [];
                for (let i = 0; i < bodiesLength; i++) {
                    const arenaBody = bodies[i];
                    const arenaBodyBounds = arenaBody.bounds;
                    const arenaBodyBoundsMin = arenaBodyBounds.min;
                    const arenaBodyBoundsMax = arenaBodyBounds.max;
                    const item = {
                        minX: arenaBodyBoundsMin.x,
                        minY: arenaBodyBoundsMin.y,
                        maxX: arenaBodyBoundsMax.x,
                        maxY: arenaBodyBoundsMax.y,
                        arenaBodyIndex: i
                    };
                    arenaBodiesElementsForSpatialHash.push(item);
                    //Logger.log(item);
                    const everyOtherArenaBodyExceptThis = [];
                    for (let j = 0; j < bodiesLength; j++) {
                        // Skip this particular body
                        if (j === i) {
                            continue;
                        }
                        everyOtherArenaBodyExceptThis.push(bodies[j]);
                    }

                    arenaBodyMappingToEveryOtherArenaBody[i] = everyOtherArenaBodyExceptThis;
                }

                arenaBodySpatialHash.load(arenaBodiesElementsForSpatialHash);
                console.log(arenaBodySpatialHash);
                arenaBodiesAdded = true;
            }

            RaycastManager.mapGameObjects(bodies, dynamic);

            //Logger.log("Added arena bodies:", ...bodies);

        },
        removeArenaPhysicsBody: function(body) {
            // Logger.log("Starting removal of arena body:", body, allBodies);
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

            // Logger.log("Finished removing arena body:", body, allBodies);
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
        enableMatterBody: function(matterObject) {
            matterObject.setActive(true);
            matterObject.setVisible(true);
        },
        //disableMatterGameObject: function(matterObject) {
        //    obj.disableMatterGameObject(disableMatterGameObject)
        //},
        disableMatterGameObject: function(matterGameObject) {
            matterGameObject.setCollisionCategory(null);
            matterGameObject.setVelocity(0, 0);
            matterGameObject.setAngularVelocity(0, 0);
            matterGameObject.setAngle(0);
            matterGameObject.setActive(false);
            matterGameObject.setVisible(false);
        },
        isBodyOverlappingWithArenaBodies: function(body) {
            const gameContext = GameContextHolder.gameContext;
            return gameContext.matter.overlap(body, allBodies);
        },
        queryArenaBodiesSpatialHash: function(bounds) {
            const result = arenaBodySpatialHash.search(bounds);
            //console.log(result);
            return result;
        },
        // Yields all the absolute world bound points of the arena body
        yieldArenaBodyBounds: function*(arenaBodyIndex) {
            // TODO: These can all probably be prefilled and cached because they don't change
            const arenaBody = arenaBodies[arenaBodyIndex];
            const arenaBodyBounds = arenaBody.bounds;
            const arenaBodyPosition = arenaBody.position;
            const arenaBodyPositionX = arenaBodyPosition.x;
            const arenaBodyPositionY = arenaBodyPosition.y;
            const halfWidth = (arenaBodyBounds.max.x - arenaBodyBounds.min.x) * 0.5;
            const halfHeight = (arenaBodyBounds.max.y - arenaBodyBounds.min.y) * 0.5;

            //yield { x: arenaBodyPositionX , y: arenaBodyPositionY };
            yield { x: arenaBodyPositionX - halfWidth, y: arenaBodyPositionY - halfHeight }; // top left
            yield { x: arenaBodyPositionX + halfWidth, y: arenaBodyPositionY - halfHeight }; // top right
            yield { x: arenaBodyPositionX - halfWidth, y: arenaBodyPositionY + halfHeight }; // bottom left
            yield { x: arenaBodyPositionX + halfWidth, y: arenaBodyPositionY + halfHeight }; // bottom right
        }
    };

    return obj;
}());
