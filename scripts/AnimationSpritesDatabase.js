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
                    const gameContext = GameContextHolder.gameContext;

                    // Go through all the spritesheet definitions in the file
                    for (let i = 0; i < definitions.length; i++) {
                        const spriteDefinition = definitions[i];

                        const spritesheetTextureKey = spriteDefinition.Key;
                        //const spritesheetTextureFilename = spriteDefinition.SpritesheetTextureFilename;
                        const spritesheetTextureDirectory = spriteDefinition.SpritesheetTextureDirectory;
                        const spritesheetAtlasFilepath = spriteDefinition.SpritesheetAtlasFilepath;

                        // Load the spritesheet
                        gameContext.load.multiatlas(
                            spritesheetTextureKey,
                            spritesheetAtlasFilepath,
                            spritesheetTextureDirectory);


                        //    // Construct the ProjectileTypes enum
                        //    const enumKey = projectileDefinition.EnumKey;
                        //    ProjectileTypes[enumKey] = i; // Ex: ProjectileTypes.Heavy = 3
                    }

                    animationSpritesDatabase.loadedDatabasesFromJSON = definitions;
                });
        },
        system_create: function() {
            const gameContext = GameContextHolder.gameContext;


            // Load the projectiles images
            //ImageDatabase.loadProjectileImages(projectileDatabase.filenames, projectileDatabase.phaserImageKeys);

        }, 
        clearDatabases: function() {
            // Clear the loaded databases array so that the contents get released
            AnimationSpritesDatabase.loadedDatabasesFromJSON.length = 0;
        }
    };

    return animationSpritesDatabase;
}());
