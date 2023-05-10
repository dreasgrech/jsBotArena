"use strict";

const RobotPartsDatabase = (function() {

    const DATABASES_FILEPATH = './databases';

    const HULLS_DB_FILE_KEY = 'HullsDatabase',
        HULLS_DB_FILEPATH = `${DATABASES_FILEPATH}/hulls.json`;

    const TURRETS_DB_FILE_KEY = 'TurretsDatabase',
        TURRETS_DB_FILEPATH = `${DATABASES_FILEPATH}/turrets.json`;

    const hulls = {
        phaserImageKeys: [],
        physicsEditorSpriteNames: [],
        filenames: [],
        TurretHoleOffsetsX: [],
        TurretHoleOffsetsY: [],
    };

    const turrets = {
        phaserImageKeys: [],
        filenames: [],
        originsX: [],
        originsY: [],
    };

    const loadHullsDatabase = function() {
        // Load the hulls database
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

                // Load the images
                ImageDatabase.loadHullImages(hulls.filenames, hulls.phaserImageKeys);
            });
    };
    const loadTurretsDatabase = function() {
        // Load the turrets database
        JSONDatabaseReader.loadDatabase(TURRETS_DB_FILE_KEY, TURRETS_DB_FILEPATH,
            function(definitions) {

                for (let i = 0; i < definitions.length; i++) {
                    const definition = definitions[i];

                    // Save the data from the definition loaded from the file
                    turrets.phaserImageKeys[i] = definition.PhaserImageKey;
                    turrets.filenames[i] = definition.Filename;
                    turrets.originsX[i] = definition.originX;
                    turrets.originsY[i] = definition.originY;

                    // Construct the enum
                    const enumKey = definition.EnumKey;
                    RobotTurretTypes[enumKey] = i; // Ex: ProjectileTypes.Heavy = 3
                }

                // Load the images
                ImageDatabase.loadTurretImages(turrets.filenames, turrets.phaserImageKeys);
            });

    };

    const robotPartsDatabase = {
        hulls: hulls,
        turrets: turrets,
        system_preload: function() {
            // Load the databases and the images
            loadHullsDatabase();
            loadTurretsDatabase();
        }
    };

    return robotPartsDatabase;
}());
