"use strict";

/**
 * The absolute world bound positions of all the static arena obstacles.  
 * Each obstacle occupies 8 elements in the array to hold the four bounds points because each x and y point values are stored after each other as such:
 *
 * const boundsPointsIndex = arenaBodyIndex * 8;
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

/**
 * Holds all the Matter IDs of all the static arena obstacles
 * @type {number[]}
 */
const arenaStaticObstacleBodiesIDs = [];

/**
 * Holds all the positions of all the static arena obstacles.
 * Each obstacle occupies 2 elements in the array to hold the x and y coordinates
 * @type {number[]}
 */
const arenaStaticObstacleBodiesPositions = [];

const ARENA_STATIC_OBSTACLES_TOTAL_POINTS_PER_BOUNDS = 8;

const PhysicsBodiesManager = (function() {
    /**
     * Contains all the physics bodies in the arena
     * @type {Phaser.Types.Physics.Matter.MatterBody[]}
     */
    let allBodies = [];
    
    /**
     * Contains the arena bodies (walls, obstacles, etc..)
     * @type {Phaser.Types.Physics.Matter.MatterBody[]}
     */
    let staticArenaBodies = []; 
    
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

    // TODO: also need to make sure not to have duplicates in arenaBodies
    // TODO: maybe using Set is an option
    const addBodiesToCollection = function(bodies){
        // Add all the bodies to the allBodies collection
        const arenaBodiesTotalBeforeAdd = allBodies.length;
        allBodies.push(...bodies);
        const bodiesLength = bodies.length;
        console.assert(allBodies.length === arenaBodiesTotalBeforeAdd + bodiesLength,
            "Make sure that all the elements were added");

        // Map each body to its collision category
        for (let i = 0; i < bodiesLength; i++) {
            let body = bodies[i];
            // console.log(body);
            const collisionCategory = body.collisionFilter.category;
            matterBodyToCollisionCategory[body.id] =
                {
                    type: collisionCategory
                };

            // Logger.log("Setting", body.id, "to", collisionCategory);
        }
    };

    const physicsBodiesManager = {
        get staticArenaBodies() {
            return staticArenaBodies;
        },
        system_create: function() {
            // Create the Tweak pane data
            const dataForTweakPane = {
                get allBodiesTotal() {
                    return allBodies.length;
                },
                get arenaStaticObstacleBodiesTotal() {
                    return staticArenaBodies.length;
                },
            };
            const tweakPaneFolderID = TweakPaneManager.createFolder("Physics Bodies Manager");
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'allBodiesTotal');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'arenaStaticObstacleBodiesTotal');
        },
        // getEveryOtherArenaBodyExceptThis: function(arenaBodyIndex) {
        //     return arenaBodyMappingToEveryOtherArenaBody[arenaBodyIndex];
        // },
        addStaticArenaPhysicsBodies: function(bodies) {
            // If these are arena collider bodies, add them to their own collection too
            if (arenaBodiesAdded) {
                throw "Arena bodies already added and cannot be re-added";
            }

            // Add all the bodies to the allBodies collection
            addBodiesToCollection(bodies);

            // TODO: This array is used by the scanner to determine which
            // TODO: arena bodies to raycast against.
            // TODO: This means that not all bodies need to be pushed to it
            staticArenaBodies = bodies;

            const arenaBodiesElementsForSpatialHash = [];
            const bodiesLength = bodies.length;
            for (let i = 0; i < bodiesLength; i++) {
                const arenaBodyIndex = i;
                const arenaBody = bodies[i];
                arenaStaticObstacleBodiesIDs[arenaBodyIndex] = arenaBody.id;

                // Create the bounds that will be handed to the spatial hash
                const arenaBodyBounds = arenaBody.bounds;
                const arenaBodyBoundsMin = arenaBodyBounds.min;
                const arenaBodyBoundsMinX = arenaBodyBoundsMin.x;
                const arenaBodyBoundsMinY = arenaBodyBoundsMin.y;
                const arenaBodyBoundsMax = arenaBodyBounds.max;
                const arenaBodyBoundsMaxX = arenaBodyBoundsMax.x;
                const arenaBodyBoundsMaxY = arenaBodyBoundsMax.y;
                const boundsForSpatialHash = {
                    minX: arenaBodyBoundsMinX,
                    minY: arenaBodyBoundsMinY,
                    maxX: arenaBodyBoundsMaxX,
                    maxY: arenaBodyBoundsMaxY,
                    arenaBodyIndex: arenaBodyIndex
                };
                arenaBodiesElementsForSpatialHash.push(boundsForSpatialHash);

                const arenaBodyPosition = arenaBody.position;
                const arenaBodyPositionX = arenaBodyPosition.x;
                const arenaBodyPositionY = arenaBodyPosition.y;

                // Save the arena obstacle's position
                const positionIndex = arenaBodyIndex * 2;
                arenaStaticObstacleBodiesPositions[positionIndex] = arenaBodyPositionX;
                arenaStaticObstacleBodiesPositions[positionIndex + 1] = arenaBodyPositionY;

                const arenaBodyBoundsHalfWidth = (arenaBodyBoundsMaxX - arenaBodyBoundsMinX) * 0.5;
                const arenaBodyBoundsHalfHeight = (arenaBodyBoundsMaxY - arenaBodyBoundsMinY) * 0.5;

                // Calculate the corner points world positions of the arena obstacle
                const leftX = arenaBodyPositionX - arenaBodyBoundsHalfWidth;
                const rightX = arenaBodyPositionX + arenaBodyBoundsHalfWidth;
                const topY = arenaBodyPositionY - arenaBodyBoundsHalfHeight;
                const bottomY = arenaBodyPositionY + arenaBodyBoundsHalfHeight;

                // Save the 8 absolute world bound points of the arena obstacle
                const boundsPointsIndex = arenaBodyIndex * ARENA_STATIC_OBSTACLES_TOTAL_POINTS_PER_BOUNDS;
                arenaStaticObstacleBodiesBounds[boundsPointsIndex + 0] = leftX;
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
            
            // Register the bodies with the RaycastManager
            RaycastManager.mapGameObjects(bodies, false);

            // Load the arena bodies into the spatial hash
            arenaBodySpatialHash.load(arenaBodiesElementsForSpatialHash);
            
            arenaBodiesAdded = true;
        },
        addDynamicArenaPhysicsBodies: function(bodies) {
            // Add all the bodies to the allBodies collection
            addBodiesToCollection(bodies);

            // Register the bodies with the RaycastManager
            RaycastManager.mapGameObjects(bodies, true);
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

            const bodyID = body.id;
            // Remove the body's mapping from matterBodyToCollisionCategory
            delete matterBodyToCollisionCategory[bodyID];

            // If the body is also associated with a robot, remove its mapping from matterObjectIDToRobotIndex
            if (matterBodyIDToRobotIndex.hasOwnProperty(bodyID)) {
                delete matterBodyIDToRobotIndex[bodyID];
            }

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
            const gameContext = GameContextHolder.scene;
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

    return physicsBodiesManager;
}());
