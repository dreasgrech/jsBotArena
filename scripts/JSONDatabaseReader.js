"use strict";

const JSONDatabaseReader = (function() {

    const jsonDatabaseReader = {
        loadDatabase: function(fileKey, filePath, onFileLoadedCallback) {
            const gameContext = GameContextHolder.scene;

            gameContext.load.on(`filecomplete-json-${fileKey}`, function (key, type, data) {
                onFileLoadedCallback(data);
            });

            // Start loading the db json file
            gameContext.load.json(fileKey, filePath);
        }
    };

    return jsonDatabaseReader;
}());
