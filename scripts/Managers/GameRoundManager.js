"use strict";

const GameRoundManager = (function() {
    // TODO: Create a statemachine to keep track of whether the round is happening
    const gameRoundManager = {
        roundRunning: false,
        startRound: function() {
            if (gameRoundManager.roundRunning) {
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

            gameRoundManager.roundRunning = true;
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
        