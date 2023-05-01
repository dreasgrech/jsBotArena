"use strict";

const ProjectilesDatabase = (function() {

    const PROJECTILE_DB_FILE_KEY = 'ProjectileDatabase',
        PROJECTILE_DB_FILEPATH = './databases/projectiles.json';

    const projectileDatabase = {
        names : [],
        filenames : [],
        baseDamages : [],
        system_preload: function() {
            console.log('proj database', 'preload');
            const gameContext = GameContextHolder.gameContext;

            // Hook to the filecomplete of the db json file so that we can then save the data from it
            gameContext.load.on(`filecomplete-json-${PROJECTILE_DB_FILE_KEY}`, function (key, type, projectileDefinitions) {

                // Read the json's array and its projectile definitions
                for (let i = 0; i < projectileDefinitions.length; i++) {
                    const projectileDefinition = projectileDefinitions[i];
                    Logger.log(projectileDefinition);

                    // Save the data from the projectile definition loaded from the file
                    projectileDatabase.names[i] = projectileDefinition.Name;
                    projectileDatabase.filenames[i] = projectileDefinition.Filename;
                    projectileDatabase.baseDamages[i] = projectileDefinition.BaseDamage;

                    // Construct the ProjectileTypes enum
                    const enumKey = projectileDefinition.EnumKey;
                    ProjectileTypes[enumKey] = i;
                }

                // Load the projectiles images
                ImageDatabase.loadProjectileImages(projectileDatabase.filenames);
            });

            // Start loading the projectiles db json file
            gameContext.load.json(PROJECTILE_DB_FILE_KEY, PROJECTILE_DB_FILEPATH);
        },
        system_create: function() {
            // console.log('proj database', 'create');
        }
    };

    return projectileDatabase;
}());
