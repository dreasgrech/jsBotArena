"use strict";

const ProjectilesDatabase = (function() {

    const PROJECTILE_DB_FILE_KEY = 'ProjectileDatabase',
        PROJECTILE_DB_FILEPATH = './databases/projectiles.json';

    const
        names = [],
        filenames = [],
        baseDamages = [];

    names[ProjectileTypes.Light] = 'Light_Shell';
    filenames[ProjectileTypes.Light] = 'Light_Shell';

    const projectileDatabase = {
        system_preload: function() {
            console.log('proj database', 'preload');
            const gameContext = GameContextHolder.gameContext;

            // Hook to the filecomplete of the db json file so that we can then save the data from it
            gameContext.load.on(`filecomplete-json-${PROJECTILE_DB_FILE_KEY}`, function (key, type, projectileDefinitions) {

                // Read the json's array and its projectile definitions
                for (let i = 0; i < projectileDefinitions.length; i++) {
                    const projectileDefinition = projectileDefinitions[i];
                    Logger.log(projectileDefinition);

                    names[i] = projectileDefinition.name;
                    filenames[i] = projectileDefinition.filename;
                    baseDamages[i] = projectileDefinition.baseDamage;
                }

                // Load the projectiles images
                ImageDatabase.loadProjectileImages(filenames);
            });
            gameContext.load.json(PROJECTILE_DB_FILE_KEY, PROJECTILE_DB_FILEPATH);
        },
        system_create: function() {
            console.log('proj database', 'create');
        }
    };

    return projectileDatabase;
}());
