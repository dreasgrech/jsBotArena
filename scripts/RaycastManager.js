"use strict";

// Makes use of this raycasting Phaser plugin: https://wiserim.github.io/phaser-raycaster/
const RaycastManager = (function () {
    let raycaster;

    const raycastManager = {
        system_preload: function() {
            const gameContext = GameContextHolder.gameContext;

            const raycasterOptions = {
                debug: {
                    enabled: GAME_DEBUG_MODE, //enable debug mode
                    maps: GAME_DEBUG_MODE, //enable maps debug
                    rays: GAME_DEBUG_MODE, //enable rays debug
                    graphics: {
                        ray: 0x00ff00, //debug ray color; set false to disable
                        rayPoint: 0xff00ff, //debug ray point color; set false to disable
                        mapPoint: 0x00ffff, //debug map point color; set false to disable
                        mapSegment: 0x0000ff, //debug map segment color; set false to disable
                         mapBoundingBox: 0xff0000 //debug map bounding box color; set false to disable
                        //mapBoundingBox: false //debug map bounding box color; set false to disable
                    }
                }
            };

            raycaster = gameContext.raycasterPlugin.createRaycaster(raycasterOptions);
        },
        mapGameObjects: function(gameObjects, dynamic) {
            raycaster.mapGameObjects(gameObjects, dynamic);
        },
        removeMappedGameObjects: function(gameObjects) {
            raycaster.removeMappedObjects(gameObjects);
        },
        createRay: function() {
            const ray = raycaster.createRay();
            //ray.autoSlice = true; //enable auto slicing field of view

            // todo: keep a list of all created rays

            return ray;
        },
        destroyRay: function(ray) {
            ray.destroy();
        },
        logStatistics: function() {
            const stats = raycaster.getStats();
            Logger.log(stats);
        },
        system_dispose: function() {
            raycaster.destroy();
            // todo: remove all raycasts the same way
        }
    };
    return raycastManager;
}());
