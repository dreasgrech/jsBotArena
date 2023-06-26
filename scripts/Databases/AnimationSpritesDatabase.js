"use strict";

const AnimationSpritesDatabase = (function() {

    const ANIMATIONS_DEFINITIONS_DB_FILE_KEY = 'AnimationDefinitionsDatabase',
        ANIMATIONS_DEFINITIONS_DB_FILEPATH = './databases/animation/AnimationDefinitions.json';

    const animationSpritesDatabase = {
        loadedDatabasesFromJSON: [],
        system_preload: function() {
            JSONDatabaseReader.loadDatabase(ANIMATIONS_DEFINITIONS_DB_FILE_KEY,
                ANIMATIONS_DEFINITIONS_DB_FILEPATH,
                function(definitions) {
                    animationSpritesDatabase.loadedDatabasesFromJSON = definitions;
                });
        },
        clearDatabases: function() {
            // Clear the loaded databases array so that the contents get released
            AnimationSpritesDatabase.loadedDatabasesFromJSON.length = 0;
        }
    };

    return animationSpritesDatabase;
}());
