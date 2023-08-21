"use strict";

//const GAME_DEBUG_MODE = true;
const GAME_DEBUG_MODE = false;

// The initial game dimensions.  These are changed when a level is loaded
const INITIAL_GAME_WIDTH = 1024;
const INITIAL_GAME_HEIGHT = 1024;

 //const FPS_LIMIT = 15;
// const FPS_LIMIT = 40;
// const FPS_LIMIT = 60;
const FPS_LIMIT = 144;

$(function(){
    // Start the Phaser game
    GameContextHolder.game = new Phaser.Game({
        title: "jsBotArena",
        url: "http://dreasgrech.com/upload/jsBotArena/index.html",
        type: Phaser.AUTO,
        backgroundColor: "#4c3585",
        scale: {
            parent: 'game_container',
            mode: Phaser.Scale.ScaleModes.WIDTH_CONTROLS_HEIGHT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: INITIAL_GAME_WIDTH,
            maxWidth: INITIAL_GAME_WIDTH,
            height: INITIAL_GAME_HEIGHT,
            maxHeight: INITIAL_GAME_HEIGHT,
        },
        //antialias: true,
        scene: {
            preload: PhaserGameManager.preload,
            create: PhaserGameManager.create,
            update: PhaserGameManager.update
        },
        physics: {
            default: 'matter',
            matter: {
                debug: GAME_DEBUG_MODE,
                gravity: {
                    x: 0,
                    y: 0
                },
                runner: {
                    isFixed: true
                }
            }
        },
        plugins: {
            global: [
                {
                    key: 'InspectorGlobalPlugin',
                    plugin: PhaserPluginInspector.InspectorGlobalPlugin,
                    mapping: 'inspectorGame'
                }
            ],
            scene: [
                {
                    key: 'PhaserRaycaster',
                    plugin: PhaserRaycaster,
                    mapping: 'raycasterPlugin'
                },
                //{
                //    key: 'InspectorScenePlugin',
                //    plugin: PhaserPluginInspector.InspectorScenePlugin,
                //    mapping: 'inspectorScene'
                //}
            ]
        },
        fps: {
            limit: FPS_LIMIT
        }
    });
});
