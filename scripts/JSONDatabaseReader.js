"use strict";

const JSONDatabaseReader = (function() {
    return {
        loadDatabase: function(fileKey, filePath, onFileLoadedCallback) {
            const scene = GameContextHolder.scene;

            scene.load.on(`filecomplete-json-${fileKey}`, function (key, type, data) {
                onFileLoadedCallback(data);
            });

            // Start loading the db json file
            scene.load.json(fileKey, filePath);
        }
    };
}());
