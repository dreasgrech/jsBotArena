"use strict";

const ArenasDatabase = (function() {
    const ARENAS_DB_FILE_KEY = 'ArenasDatabase',
        ARENAS_DB_FILEPATH = './databases/arenas.json';

    const arenasDatabase = {
        // loadedDatabasesFromJSON: [],
        system_preload: function() {
            JSONDatabaseReader.loadDatabase(ARENAS_DB_FILE_KEY, ARENAS_DB_FILEPATH,
                function(arenaDefinitions) {
                    //console.log(arenaDefinitions);
                    // arenasDatabase.loadedDatabasesFromJSON = arenaDefinitions;
                    ArenaManager.onDatabaseLoaded(arenaDefinitions)
                });
        },
        // clearDatabases: function() {
        //     // Clear the loaded databases array so that the contents get released
        //     ArenasDatabase.loadedDatabasesFromJSON.length = 0;
        // }
    };

    return arenasDatabase;
})();
