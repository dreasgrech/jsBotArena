"use strict";

const GameRoundManager = (function() {

    const objectsWith_update = [
        RobotManager,
        RobotsRadarManager,
        RobotFiringManager,
        ObjectAnchorManager,
        UIManager
    ];
    const totalObjectsWith_update = objectsWith_update.length;
    
    const objectsWith_onEndOfFrame = [
        CollisionManager,
        ProjectileManager,
        DamageManager
    ];
    const totalObjectsWith_onEndOfFrame = objectsWith_onEndOfFrame.length;

    /**
     * The system function that's called when unloading a level.
     * All of these scripts should be MANAGERS.
     */
    const objectsWith_unloadLevel = [
        RaycastManager,
        RobotManager,
        RobotsRadarManager,
        ProjectileManager,
        RobotFiringManager,
        AnimationManager,
        PhysicsBodiesManager,
        ArenaManager,
        TweakPaneManager,
        UIManager,
        CollisionManager,
        ObjectAnchorManager,
    ];
    
    const unloadLevel = function() {
        if (!gameRoundManager.roundRunning) {
            Logger.error("Round not running so not stopping");
            return;
        }

        Logger.log("Resetting round");
        for (let i = 0; i < objectsWith_unloadLevel.length; i++) {
            const toLoad = objectsWith_unloadLevel[i];
            toLoad.system_unloadLevel();
        }

        gameRoundManager.roundRunning = false;
    };
    
    // TODO: Create a statemachine to keep track of whether the round is happening
    const gameRoundManager = {
        roundRunning: false,
        queuedRoundReset: false,
        startRound: function(arenaToLoad) {
            if (gameRoundManager.roundRunning) {
                Logger.error("Round already running so not starting");
                return;
            }
            
            if (arenaToLoad === undefined) {
                Logger.error("No arena specified");
                return;
            }

            // Load the arena asynchronously
            Logger.log("Loading arena", arenaToLoad);
            ArenaManager.loadArena(arenaToLoad, function(){
                // Start the round
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
                
                UIManager.onArenaLoaded();
                
                // Allow robots to be added no the round is loaded
                RobotLoader.openLoaderForScripts();

                gameRoundManager.roundRunning = true;
            });
        },
        updateLoop: function(time, delta){
            
            // TODO: Bring code from PhaserGameManager here
            
            // TODO: check for queued round reset

            /*
            // TODO: This should probably not be commented but because 
            // TODO: the managers keep running, it might help with debugging    
            if (!gameRoundManager.roundRunning) {
                return;
            }
             */

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
            
            if (gameRoundManager.queuedRoundReset){
                gameRoundManager.queuedRoundReset = false;
                
                unloadLevel();
            }
        },
        queueLevelUnload: function() {
            gameRoundManager.queuedRoundReset = true;
        }
    };
    
    return gameRoundManager;
}());
        