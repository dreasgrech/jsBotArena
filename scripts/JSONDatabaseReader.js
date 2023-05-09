"use strict";

const JSONDatabaseReader = (function() {

    const jsonDatabaseReader = {
        loadDatabase: function(fileKey, filePath, onFileLoadedCallback) {
            const gameContext = GameContextHolder.gameContext;

            gameContext.load.on(`filecomplete-json-${fileKey}`, function (key, type, projectileDefinitions) {
                onFileLoadedCallback(projectileDefinitions);
            });

            // Start loading the db json file
            gameContext.load.json(fileKey, filePath);
        }
    };

    return jsonDatabaseReader;
}());
