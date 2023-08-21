"use strict";

$(function(){
    // Enable the syntax highlighting for the code snippets
    hljs.highlightAll();

    $("#addRobots").click(function() {
        // Open the file dialog so that the user can select robots scripts to load.
        LocalFileLoader.openFileDialog(function(filename, fileSize, text){
            // Create a function around the robot script so that it has it's own scope.
            const robotDefinitionClosureFunction = new Function(text);

            // Execute this function so that the robot script is evaluated.
            // The robot script should add it's type definition function to the RobotLoader.
            robotDefinitionClosureFunction();

            // The robot script should have added it's type definition function to the RobotLoader.
            // So check if it's there.
            const robotDefinitionFunction = RobotLoader.lastAddedRobotDefinitionFunction;
            if (robotDefinitionFunction === undefined) {
                Logger.error(`Script did not add its type definition function to the RobotLoader: ${filename}`);
                return;
            }

            // Reset the loader so that it can be used again since now we have a reference to the robot type definition function.
            RobotLoader.resetLoader();

            try {
                // Create an instance of the robot so that we make sure that it's a valid robot type
                const robotInstance = robotDefinitionFunction();
                const robotName = robotInstance.name;
                if (!robotName){
                    Logger.error(`Robot instance must have a .name field defined: ${filename}`);
                    return;
                }

                // Add the robot to the game
                RobotManager.addRobot(robotInstance);

                Logger.log("Successfully created robot instance", robotInstance);
            } catch (err){
                Logger.error(`Script did not return a valid robot instance: ${filename} (Exception: ${err})`);
                return;
            }
        });
    });
    
    $("#resetRound").click(function() {
        PhaserGameManager.resetRound();
    });
});
