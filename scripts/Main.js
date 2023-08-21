"use strict";

//const GAME_DEBUG_MODE = true;
const GAME_DEBUG_MODE = false;

const GameManager = (function() {
    // TODO: Create a statemachine to keep track of whether the round is happening
    let roundRunning = false;

    /**
     * The system_preloadOnce function is called only once and is not called again during the lifetime of the game.
     */
    const objectsWith_preloadOnce = [
        // Load the databases first so that their resources are available to the managers
        ImageDatabase,
        ProjectilesDatabase,
        AnimationSpritesDatabase,
        RobotPartsDatabase,
        ArenasDatabase,
        
        RaycastManager,
        AnimationManager,
        RobotMatterFactory,
        ProjectileManager
    ];

    const objectsWith_create = [
        TweakPaneManager,
        PoolsManager,
        ProjectileManager,
        AnimationManager,
        //RobotMatterFactory,
        CollisionManager,
        UIManager,
        RobotsRadarManager,
        RobotManager,
        PhysicsBodiesManager
    ];

    const objectsWith_onEndOfFrame = [
        CollisionManager,
        ProjectileManager,
        DamageManager
    ];
    const totalObjectsWith_onEndOfFrame = objectsWith_onEndOfFrame.length;

    const objectsWith_update = [
        RobotManager,
        RobotsRadarManager,
        ProjectileManager,
        ObjectAnchorManager,
        UIManager
    ];
    const totalObjectsWith_update = objectsWith_update.length;

    /**
     * The system function that's called when unloading a level.
     * All of these scripts should be MANAGERS. 
     */
    const objectsWith_unloadLevel = [
        RaycastManager,
        RobotManager,
        RobotsRadarManager,
        ProjectileManager,
        AnimationManager,
        PhysicsBodiesManager,
        ArenaManager,
        ObjectAnchorManager,
        TweakPaneManager,
        UIManager,
        CollisionManager
    ];

    const preload = function() {
        const gameContext = this;
        GameContextHolder.scene = gameContext;

        // gameContext.matter.world.autoUpdate = false;

        //this.load.scripts('inspector', [
        //    'https://cdn.jsdelivr.net/npm/tweakpane@3.1.0/dist/tweakpane.js',
        //    'https://cdn.jsdelivr.net/npm/phaser-plugin-inspector@1.9.1/dist/phaser-plugin-inspector.umd.js',
        //]);
        //this.load.once('complete', () => {
        //    PhaserPluginInspector.Install(this.plugins);
        //});

        //gameContext.matter.set60Hz();

        //gameContext.load.tilemapTiledJSON('arena_json', 'arena_map.json');

        for (let i = 0; i < objectsWith_preloadOnce.length; i++) {
            const toLoad = objectsWith_preloadOnce[i];
            toLoad.system_preloadOnce();
        }
    };

    //const FIXED_DELTA_TIME = 0.02; //50hz
    // let stepTimer = 0;

    const gameManager = {
        preload: preload,
            create: function() {
                const gameContext = GameContextHolder.scene;

                // Enable Matter physics
                // TODO: Check about this https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Matter.World#setBounds
                //gameContext.matter.world.setBounds();

                gameContext.matter.world.on('collisionstart', CollisionManager.handleEvent_CollisionStart);

                // Load the arena asynchronously
                const arenaToLoad = Arenas.BridgeLevel;
                //const arenaToLoad = Arenas.MetalLevel;
                //const arenaToLoad = Arenas.BrownLevel;
                ArenaManager.loadArena(arenaToLoad, function(){
                    // Call all the system_create functions that are hooked
                    for (let i = 0; i < objectsWith_create.length; i++) {
                        const toLoad = objectsWith_create[i];
                        toLoad.system_create();
                    }

                    // Start the round
                    gameManager.startRound();
                });
        },
            update: function(time, delta) {
                if (!roundRunning) {
                    return;
                }

                GameContextHolder.gameTime = time*0.001;
                GameContextHolder.deltaTime = delta*0.001;

                // performance.mark('mainupdate:start');
                for (let i = 0; i < totalObjectsWith_update; i++) {
                    objectsWith_update[i].update();
                }
                // performance.mark('mainupdate:end');
                // performance.measure('Main Update',
                //     'mainupdate:start',
                //     'mainupdate:end');

                // Since we're now at the end of frame, clear any per-frame data
                for (let i = 0; i < totalObjectsWith_onEndOfFrame; i++) {
                    objectsWith_onEndOfFrame[i].system_onEndOfFrame();
                }

                // Increase the frame counter
                FrameCounter.current++;

                // stepTimer += delta * 0.001;

                // Step the physics
                //GameContextHolder.scene.matter.world.step();
                
            //    while (stepTimer >= FIXED_DELTA_TIME) {
            //        stepTimer -= FIXED_DELTA_TIME;
            //        //GameContextHolder.gameContext.matter.world.step(FIXED_DELTA_TIME);
            //        GameContextHolder.gameContext.matter.world.step();
            //    }
        },
        startRound: function() {
            if (roundRunning) {
                Logger.error("Round already running so not starting");
                return;
            }
            
            Logger.log("Starting new round");
/*
            //const ROBOT_CREATION_ITERATIONS = 3;
            const ROBOT_CREATION_ITERATIONS = 1;
            for (let i = 0; i < ROBOT_CREATION_ITERATIONS; i++) {
                RobotManager.addRobot(keyBot());
                // RobotManager.addRobot(doNothingBot());
                // RobotManager.addRobot(astarBot());
                // RobotManager.addRobot(shredder());
                // RobotManager.addRobot(circleBot());
                // RobotManager.addRobot(sittingBot());
                // RobotManager.addRobot(followBot_followAngle());
                // RobotManager.addRobot(followBot_followPosition());
            }
*/
            // Allow robots to be added no the round is loaded
            RobotLoader.openLoaderForScripts();
            
            roundRunning = true;
        },
        resetRound: function() {
            if (!roundRunning) {
                Logger.error("Round not running so not stopping");
                return;
            }
            
            Logger.log("Resetting round");
            for (let i = 0; i < objectsWith_unloadLevel.length; i++) {
                const toLoad = objectsWith_unloadLevel[i];
                toLoad.system_unloadLevel();
            }
            roundRunning = false;
        }
    };
    
    return gameManager;
}());

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
            preload: GameManager.preload,
            create: GameManager.create,
            update: GameManager.update
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
