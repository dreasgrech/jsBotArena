"use strict";

//const GAME_DEBUG_MODE = true;
const GAME_DEBUG_MODE = false;

window.onload = function(event) {
    const { InspectorGlobalPlugin, InspectorScenePlugin } = PhaserPluginInspector;

    GameContextHolder.game = new Phaser.Game({
        title: "jsBotArena",
        url: "http://dreasgrech.com/upload/jsBotArena/index.html",
        type: Phaser.AUTO,
        backgroundColor: "#4c3585",
        scale: {
            parent: 'game_container',
            mode: Phaser.Scale.ScaleModes.WIDTH_CONTROLS_HEIGHT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: GameSetup.width,
            maxWidth: GameSetup.width,
            height: GameSetup.height,
            maxHeight: GameSetup.height,
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
                    plugin: InspectorGlobalPlugin,
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
                //    plugin: InspectorScenePlugin,
                //    mapping: 'inspectorScene'
                //}
            ]
        },
        fps: {
             limit: 144
            //limit: 60
            //limit: 40
            //limit: 15
        }
    });
};
