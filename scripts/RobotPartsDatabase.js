"use strict";

const RobotPartsDatabase = (function() {

    const HULLS_DB_FILE_KEY = 'HullsDatabase',
        HULLS_DB_FILEPATH = './databases/hulls.json';

    const hulls = {
        phaserImageKeys: [],
        physicsEditorSpriteNames: [],
        filenames: [],
        TurretHoleOffsetsX: [],
        TurretHoleOffsetsY: [],
    };

    const robotPartsDatabase = {
        hulls: hulls,
        system_preload: function() {
            console.log('proj database', 'preload');

            JSONDatabaseReader.loadDatabase(HULLS_DB_FILE_KEY, HULLS_DB_FILEPATH,
                function(definitions) {

                    for (let i = 0; i < definitions.length; i++) {
                        const definition = definitions[i];

                        // Save the data from the definition loaded from the file
                        hulls.phaserImageKeys[i] = definition.PhaserImageKey;
                        hulls.physicsEditorSpriteNames[i] = definition.PhysicsEditor_SpriteName;
                        hulls.filenames[i] = definition.Filename;
                        hulls.TurretHoleOffsetsX[i] = definition.TurretHoleOffsetX;
                        hulls.TurretHoleOffsetsY[i] = definition.TurretHoleOffsetY;

                        // Logger.log(i, definition, hulls.TurretHoleOffsetsX, hulls.TurretHoleOffsetsY);

                        // Construct the enum
                        const enumKey = definition.EnumKey;
                        RobotHullTypes[enumKey] = i; // Ex: ProjectileTypes.Heavy = 3
                    }

                    // Load the projectiles images
                    ImageDatabase.loadHullImages(hulls.filenames, hulls.phaserImageKeys);
                });
        }
    };

    return robotPartsDatabase;
}());
