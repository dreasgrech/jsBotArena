"use strict";

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

            // Call all the system_afterPreloadOnce functions that are hooked
            for (let i = 0; i < objectsWith_afterPreloadOnce.length; i++) {
                const toLoad = objectsWith_afterPreloadOnce[i];
                toLoad.system_afterPreloadOnce();
            }

            //const arenaToLoad = Arenas.BridgeLevel;
            //const arenaToLoad = Arenas.MetalLevel;
            const arenaToLoad = Arenas.BrownLevel;
            
            GameRoundManager.startRound(arenaToLoad);
        },
        update: function(time, delta) {
            GameRoundManager.updateLoop(time, delta);
        }
    };
}());
