﻿"use strict";

/**
 * Contains the functions that is used by the Phaser game engine to run the game
 * @type {{create: PhaserGameManager.create, update: PhaserGameManager.update, preload: PhaserGameManager.preload}}
 */
const PhaserGameManager = (function() {
    // TODO: Create a statemachine to keep track of whether the round is happening
    // let roundRunning = false;

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

        TweakPaneManager,
        RaycastManager,
        RobotMatterFactory,
        ProjectileManager,
        PoolsManager,
        CollisionManager,
        RobotManager,
        PhysicsBodiesManager
    ];

    /**
     * The system_afterPreloadOnce function is called only once and is not called again during the lifetime of the game.
     * It is called after the preloadOnce functions have finished processing and loading whatever they loaded
     */
    const objectsWith_afterPreloadOnce = [
        ProjectileManager,
        AnimationManager,
        //RobotMatterFactory,
        UIManager,
        RobotsRadarManager,
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

    //const FIXED_DELTA_TIME = 0.02; //50hz
    // let stepTimer = 0;

    return {
        preload: function() {
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

            // Hook to the Matter 'collisionstart' event
            gameContext.matter.world.on(Phaser.Physics.Matter.Events.COLLISION_START , CollisionManager.handleEvent_CollisionStart);

            for (let i = 0; i < objectsWith_preloadOnce.length; i++) {
                const toLoad = objectsWith_preloadOnce[i];
                toLoad.system_preloadOnce();
            }
        },
        create: function() {
            const gameContext = GameContextHolder.scene;

            // Enable Matter physics
            // TODO: Check about this https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Matter.World#setBounds
            //gameContext.matter.world.setBounds();

            // gameContext.matter.world.on('collisionstart', CollisionManager.handleEvent_CollisionStart);

            // Call all the system_afterPreloadOnce functions that are hooked
            for (let i = 0; i < objectsWith_afterPreloadOnce.length; i++) {
                const toLoad = objectsWith_afterPreloadOnce[i];
                toLoad.system_afterPreloadOnce();
            }

            // Load the arena asynchronously
            //const arenaToLoad = Arenas.BridgeLevel;
            const arenaToLoad = Arenas.MetalLevel;
            //const arenaToLoad = Arenas.BrownLevel;
            ArenaManager.loadArena(arenaToLoad, function(){
                // Start the round
                GameRoundManager.startRound();
            });
        },
        update: function(time, delta) {
            if (!GameRoundManager.roundRunning) {
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
        }
    };
}());