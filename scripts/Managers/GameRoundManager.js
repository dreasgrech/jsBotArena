"use strict";

const GameRoundManager = (function() {
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
        TweakPaneManager,
        UIManager,
        CollisionManager,
        ObjectAnchorManager,
    ];
    
    // TODO: Create a statemachine to keep track of whether the round is happening
    const gameRoundManager = {
        roundRunning: false,
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
                // Allow robots to be added no the round is loaded
                RobotLoader.openLoaderForScripts();

                gameRoundManager.roundRunning = true;
            });
        },
        resetRound: function() {
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
        }
    };
    
    return gameRoundManager;
}());
        