"use strict";

/**
 * The absolute world bound positions of all the static arena obstacles.  
 * Each obstacle occupies 8 elements in the array to hold the four bounds points because each x and y point values are stored after each other as such:
 *
 * Top-Left:
 * arenaStaticObstacleBodiesBounds[boundsPointsIndex] = leftX;
 * arenaStaticObstacleBodiesBounds[boundsPointsIndex + 1] = topY;
 * Top-Right:
 * arenaStaticObstacleBodiesBounds[boundsPointsIndex + 2] = rightX;
 * arenaStaticObstacleBodiesBounds[boundsPointsIndex + 3] = topY;
 * Bottom-Left:
 * arenaStaticObstacleBodiesBounds[boundsPointsIndex + 4] = leftX;
 * arenaStaticObstacleBodiesBounds[boundsPointsIndex + 5] = bottomY;
 * Bottom-Right:
 * arenaStaticObstacleBodiesBounds[boundsPointsIndex + 6] = rightX;
 * arenaStaticObstacleBodiesBounds[boundsPointsIndex + 7] = bottomY;
 * @type {number[]}
 */
const arenaStaticObstacleBodiesBounds = [];

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
    
    // /**
    //  * The x-positions of the bounds of the static arena obstacles
    //  * @type {number[]}
    //  */
    // const arenaStaticObstacleBodiesBoundsX = [];
    // /**
    //  * The y-positions of the bounds of the static arena obstacles
    //  * @type {number[]}
    //  */
    // const arenaStaticObstacleBodiesBoundsY = [];

    const obj = {
        // TODO: Rename these two gets to proper ES getters
        getArenaBodies: function() {
            return arenaBodies;
        },
        getArenaBody: function(arenaBodyIndex) {
            return arenaBodies[arenaBodyIndex];
        },
        system_create: function() {
            // Create the Tweak pane data
            const dataForTweakPane = {
                get allBodiesTotal() {
                    return allBodies.length;
                },
                get arenaStaticObstacleBodiesTotal() {
                    return arenaBodies.length;
                },
            };
            const tweakPaneFolderID = TweakPaneManager.createFolder("Physics Bodies Manager");
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'allBodiesTotal');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'arenaStaticObstacleBodiesTotal');
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
                    const arenaBodyIndex = i;
                    const boundsForSpatialHash = {
                        minX: arenaBodyBoundsMin.x,
                        minY: arenaBodyBoundsMin.y,
                        maxX: arenaBodyBoundsMax.x,
                        maxY: arenaBodyBoundsMax.y,
                        arenaBodyIndex: arenaBodyIndex
                    };
                    arenaBodiesElementsForSpatialHash.push(boundsForSpatialHash);

                    const arenaBodyPosition = arenaBody.position;
                    const arenaBodyPositionX = arenaBodyPosition.x;
                    const arenaBodyPositionY = arenaBodyPosition.y;
                    const arenaBodyBoundsHalfWidth = (arenaBodyBoundsMax.x - arenaBodyBoundsMin.x) * 0.5;
                    const arenaBodyBoundsHalfHeight = (arenaBodyBoundsMax.y - arenaBodyBoundsMin.y) * 0.5;
                    
                    const leftX= arenaBodyPositionX - arenaBodyBoundsHalfWidth;
                    const rightX = arenaBodyPositionX + arenaBodyBoundsHalfWidth;
                    const topY = arenaBodyPositionY - arenaBodyBoundsHalfHeight;
                    const bottomY = arenaBodyPositionY + arenaBodyBoundsHalfHeight;
                    
                    // Save the 8 absolute world bound points of the arena obstacle
                    const boundsPointsIndex = arenaBodyIndex * 8;
                    arenaStaticObstacleBodiesBounds[boundsPointsIndex] = leftX;
                    arenaStaticObstacleBodiesBounds[boundsPointsIndex + 1] = topY;
                    arenaStaticObstacleBodiesBounds[boundsPointsIndex + 2] = rightX;
                    arenaStaticObstacleBodiesBounds[boundsPointsIndex + 3] = topY;
                    arenaStaticObstacleBodiesBounds[boundsPointsIndex + 4] = leftX;
                    arenaStaticObstacleBodiesBounds[boundsPointsIndex + 5] = bottomY;
                    arenaStaticObstacleBodiesBounds[boundsPointsIndex + 6] = rightX;
                    arenaStaticObstacleBodiesBounds[boundsPointsIndex + 7] = bottomY;
                    
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
        system_newRoundReset: function(){
            // arenaStaticObstacleBodiesBoundsX.length = 0;
            // arenaStaticObstacleBodiesBoundsY.length = 0;
            
        }
    };

    return obj;
}());
