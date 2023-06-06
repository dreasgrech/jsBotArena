"use strict";

const PhysicsBodies = (function() {
    /**
     * Contains all the physics bodies in the arena
     * @type {Phaser.Types.Physics.Matter.MatterBody[]}
     */
    let allBodies = [];
    
    /**
     * Contains the arena bodies (walls, obstacles, etc..)
     * @type {Phaser.Types.Physics.Matter.MatterBody[]}
     */
    let arenaBodies = []; 
    
    // let arenaBodyMappingToEveryOtherArenaBody = {};

    // const matterBodyToObjectType = {};
    const matterBodyToCollisionCategory = {};
    const matterBodyIDToRobotIndex = {};

    const projectileSensorBodyIDToRobotIndex = {};

    //let arenaBodySpatialHash = new rbush();
    let arenaBodySpatialHash = new RBush();

    // contains all the bodies except the body of the specific robot index
    //const allOtherBodiesExceptThisRobot = []; // [[],[],[]]

    let arenaBodiesAdded = false;
    
    const arenaStaticObstacleBodiesBounds = [];

    const obj = {
        getArenaBodies: function() {
            return arenaBodies;
        },
        getArenaBody: function(arenaBodyIndex) {
            return arenaBodies[arenaBodyIndex];
        },
        // getEveryOtherArenaBodyExceptThis: function(arenaBodyIndex) {
        //     return arenaBodyMappingToEveryOtherArenaBody[arenaBodyIndex];
        // },
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
                    const boundsForSpatialHash = {
                        minX: arenaBodyBoundsMin.x,
                        minY: arenaBodyBoundsMin.y,
                        maxX: arenaBodyBoundsMax.x,
                        maxY: arenaBodyBoundsMax.y,
                        arenaBodyIndex: i
                    };
                    arenaBodiesElementsForSpatialHash.push(boundsForSpatialHash);
/*
                    const everyOtherArenaBodyExceptThis = [];
                    for (let j = 0; j < bodiesLength; j++) {
                        // Skip this particular body
                        if (j === i) {
                            continue;
                        }
                        everyOtherArenaBodyExceptThis.push(bodies[j]);
                    }

                    arenaBodyMappingToEveryOtherArenaBody[i] = everyOtherArenaBodyExceptThis;
*/
                }

                arenaBodySpatialHash.load(arenaBodiesElementsForSpatialHash);
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
        /**
         * Returns true if the specified Matter body overlaps any Matter bodies that are currently registered
         * @param body {Phaser.Types.Physics.Matter.MatterBody}
         * @returns {boolean}
         */
        isBodyOverlappingWithOtherBodies: function(body) {
            const gameContext = GameContextHolder.gameContext;
            return gameContext.matter.overlap(body, allBodies);
        },
        queryArenaBodiesSpatialHash: function(bounds) {
            //performance.mark('queryArenaBodiesSpatialHash:start');
            const result = arenaBodySpatialHash.search(bounds);
            //performance.mark('queryArenaBodiesSpatialHash:end');
            //console.log(result);
            // performance.measure('Spatial hash stuff', 
            //     'queryArenaBodiesSpatialHash:start', 
            //     'queryArenaBodiesSpatialHash:end');
            return result;
        },
        /**
         * Yields all the absolute world bound points of the arena body
         * @param arenaBodyIndex {number}
         * @returns {Generator<{x: number, y: number}, void, *>}
         */
        yieldArenaBodyBounds: function*(arenaBodyIndex) {
            // TODO: These can all probably be prefilled and cached because they don't change
            // TODO: Especially since this function is called in a hot-path (scanForArenaObstacles).
            // TODO: Also, it's probably to just have them all stored in the same array and remove the generator stuff
            const arenaBody = arenaBodies[arenaBodyIndex];
            const arenaBodyBounds = arenaBody.bounds;
            const arenaBodyPosition = arenaBody.position;
            const arenaBodyPositionX = arenaBodyPosition.x;
            const arenaBodyPositionY = arenaBodyPosition.y;
            const arenaBodyBoundsMax = arenaBodyBounds.max;
            const arenaBodyBoundsMin = arenaBodyBounds.min;
            const arenaBodyBoundsHalfWidth = (arenaBodyBoundsMax.x - arenaBodyBoundsMin.x) * 0.5;
            const arenaBodyBoundsHalfHeight = (arenaBodyBoundsMax.y - arenaBodyBoundsMin.y) * 0.5;

            //yield { x: arenaBodyPositionX , y: arenaBodyPositionY };
            yield { x: arenaBodyPositionX - arenaBodyBoundsHalfWidth, y: arenaBodyPositionY - arenaBodyBoundsHalfHeight }; // top left
            yield { x: arenaBodyPositionX + arenaBodyBoundsHalfWidth, y: arenaBodyPositionY - arenaBodyBoundsHalfHeight }; // top right
            yield { x: arenaBodyPositionX - arenaBodyBoundsHalfWidth, y: arenaBodyPositionY + arenaBodyBoundsHalfHeight }; // bottom left
            yield { x: arenaBodyPositionX + arenaBodyBoundsHalfWidth, y: arenaBodyPositionY + arenaBodyBoundsHalfHeight }; // bottom right
        }
    };

    return obj;
}());
