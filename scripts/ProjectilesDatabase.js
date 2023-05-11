"use strict";

const ProjectilesDatabase = (function() {

    const PROJECTILE_DB_FILE_KEY = 'ProjectileDatabase',
        PROJECTILE_DB_FILEPATH = './databases/projectiles.json';

    const projectileDatabase = {
        phaserImageKeys : [],
        filenames : [],
        physicsEditorSpriteNames : [],
        baseDamages : [],
        speeds : [],
        system_preload: function() {
            JSONDatabaseReader.loadDatabase(PROJECTILE_DB_FILE_KEY, PROJECTILE_DB_FILEPATH,
                function(projectileDefinitions) {

                    // Read the json's array and its projectile definitions
                    for (let i = 0; i < projectileDefinitions.length; i++) {
                        const projectileDefinition = projectileDefinitions[i];
                        // Logger.log(projectileDefinition);

                        // Save the data from the projectile definition loaded from the file
                        projectileDatabase.phaserImageKeys[i] = projectileDefinition.PhaserImageKey;
                        projectileDatabase.physicsEditorSpriteNames[i] = projectileDefinition.PhysicsEditor_SpriteName;
                        projectileDatabase.filenames[i] = projectileDefinition.Filename;
                        projectileDatabase.baseDamages[i] = projectileDefinition.BaseDamage;
                        projectileDatabase.speeds[i] = projectileDefinition.Speed;

                        // Construct the ProjectileTypes enum
                        const enumKey = projectileDefinition.EnumKey;
                        ProjectileTypes[enumKey] = i; // Ex: ProjectileTypes.Heavy = 3
                    }

                    // Load the projectiles images
                    ImageDatabase.loadProjectileImages(projectileDatabase.filenames, projectileDatabase.phaserImageKeys);

                });
        }
    };

    return projectileDatabase;
}());

