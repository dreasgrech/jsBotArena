"use strict";

/**
 * Used by the robot scripts to include themselves into the game.
 */
const RobotLoader = (function () {
    let lastAddedRobotDefinitionFunction;
    let robotCurrentlyAdded;
    
    return {
        /**
         * Used by the game to access the last robot that was added through the loader
         */
        get lastAddedRobotDefinitionFunction () {
            return lastAddedRobotDefinitionFunction;
        },
        /**
         * Queues the robot to be loaded into the game.
         * @param robotDefinitionFunction
         * @return {boolean}
         */
        loadMyRobot: function(robotDefinitionFunction){
            if (robotCurrentlyAdded) {
                Logger.error("A robot definition function has already been added but not yet processed so we're not adding the new function", robotDefinitionFunction);
                return false;
            }
            
            // Store a reference to the robot definition function so that it can be accessed by the game
            lastAddedRobotDefinitionFunction = robotDefinitionFunction;
            robotCurrentlyAdded = true;
            
            // Logger.log("Loading robot definition function", robotDefinitionFunction);
            return true;
        },
        resetLoader: function(){
            lastAddedRobotDefinitionFunction = null;
            robotCurrentlyAdded = false;
        }
    };
}());