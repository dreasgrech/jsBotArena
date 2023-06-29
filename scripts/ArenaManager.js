"use script";

const Arenas = { };

const ArenaManager = (function() {
    let arenaDefinitionsFromDB = {};

    /**
     * Creates a Tilemap layer from the provided layer definition (from JSON database)
     * @param layerDefinition {Object}
     * @param loadedTilesets {Object}
     * @param tilemap {Phaser.Tilemaps.Tilemap}
     * @return {Phaser.Tilemaps.TilemapLayer}
     */
    //const createTiledLayer = function(layerDefinition, loadedTilesets, tilemap) {
    const createTiledLayer = function(tiledLayerName, usedTilesetsNames, loadedTilesets, tilemap) {
        const usedTilesets = [];
        for (let j = 0; j < usedTilesetsNames.length; j++) {
            const usedTilesetName = usedTilesetsNames[j];
            const tilesetData = loadedTilesets[usedTilesetName];
            if (tilesetData == null){
                Logger.error(`Tileset "${usedTilesetName}" not found in loaded tilesets`, loadedTilesets);
                throw "Please fix the tileset problem";
            }
            
            const tilesetImage = tilesetData.tilesetImage;
            usedTilesets.push(tilesetImage);
        }

        // const tilemapLayer = tilemap.createLayer(tilesetName, usedTilesets);
        const tilemapLayer = tilemap.createLayer(tiledLayerName, usedTilesets);
        return tilemapLayer;
    };

    // const getLayersWithUsedTilesetsNamesFromTiledJSONData = function(mapDataFromJSONFile) {
    //     // Sort the tilesets by firstgid
    //     let tilesets = mapDataFromJSONFile.tilesets.sort((a, b) => a.firstgid - b.firstgid);
    //
    //     // Calculate the maximum tile ID once
    //     let maxTileId = Math.max(...mapDataFromJSONFile.layers.flatMap(layer => layer.data));
    //
    //     // Create a lookup table that maps each tile ID to its tileset
    //     let tilesetLookup = {};
    //     const tilesetsLengthMinusOne = tilesets.length - 1;
    //     for (let i = 0; i < tilesetsLengthMinusOne; i++) {
    //         for (let j = tilesets[i].firstgid; j < tilesets[i+1].firstgid; j++) {
    //             tilesetLookup[j] = tilesets[i].name;
    //         }
    //     }
    //     // The last tileset goes up to the maximum tile ID
    //     for (let j = tilesets[tilesetsLengthMinusOne].firstgid; j <= maxTileId; j++) {
    //         tilesetLookup[j] = tilesets[tilesetsLengthMinusOne].name;
    //     }
    //
    //     /**
    //      * An object mapping each layer's name to an array of its used tileset names.
    //      * @type {Object.<string, string[]>}
    //      */
    //     const layersWithTilesets = {};
    //     const layersWithTilesets_flat = [];
    //     /** @type {Set<string>} */ 
    //     const layerTilesetNamesSet = new Set();
    //     const mapDataLayers = mapDataFromJSONFile.layers;
    //     const mapDataLayersLength = mapDataLayers.length;
    //     console.log(mapDataLayers);
    //     for (let i = 0; i < mapDataLayersLength; i++) {
    //         const layer = mapDataLayers[i];
    //        
    //         // Go through each tile in the layer
    //         layerTilesetNamesSet.clear();
    //         for (/** @type {number} */ let tileId of layer.data) {
    //             // Ignore empty tiles (ID 0)
    //             if (tileId === 0) {
    //                 continue;
    //             }
    //
    //             // Find the tileset this tile belongs to using the lookup table
    //             layerTilesetNamesSet.add(tilesetLookup[tileId]);
    //         }
    //
    //         const layerTilesetNames = Array.from(layerTilesetNamesSet);
    //         layersWithTilesets[layer.name] = layerTilesetNames;
    //     }
    //    
    //     return layersWithTilesets;
    // };
    
    const arenaManager = {
        system_preload: function() {
        },
        onDatabaseLoaded: function(definitionsFromDB) {
            
            for (let i = 0; i < definitionsFromDB.length; i++) {
                const arenaDefinition = definitionsFromDB[i];
                
                // Create the enum value
                const enumKey = arenaDefinition.EnumKey;
                Arenas[enumKey] = i;
                
                // Save the definition so that it can be used when loading the level
                arenaDefinitionsFromDB[i] = arenaDefinition;
            }
        },
        loadArena: function(arenaEnumKey, arenaFinishedLoadingCallback) {
            const scene = GameContextHolder.scene;
            
            const arenaDefinitionFromDB = arenaDefinitionsFromDB[arenaEnumKey];
            const tiledJSONFile = arenaDefinitionFromDB.TiledJSONFile;
            const tiledJSONFileKey = tiledJSONFile;
            
            scene.load.once(
                `${Phaser.Loader.Events.FILE_COMPLETE}-tilemapJSON-${tiledJSONFileKey}`, 
                function(key, type, dataFromJSONFile) {
                // Create the tilemap
                const map = scene.make.tilemap({ key: tiledJSONFileKey });
                
                // TODO: Remove these from here
                GameSetup.width = map.widthInPixels;
                GameSetup.height = map.heightInPixels;
                GameSetup.tileWidth = map.tileWidth;
                GameSetup.tileHeight = map.tileHeight;
                
                // Queue up all the images for all the tilesets needed for this arena's tilemap
                const tilesetDefinitionsFromJSONFile = dataFromJSONFile.tilesets;
                const tilesetDefinitionsFromJSONFileLength = tilesetDefinitionsFromJSONFile.length;
                for (let i = 0; i < tilesetDefinitionsFromJSONFileLength; i++) {
                    const tilesetDefinitionFromJSONFile = tilesetDefinitionsFromJSONFile[i];
                    const tilesetName = tilesetDefinitionFromJSONFile.name;
                    const tilesetImageRelativeUrl = tilesetDefinitionFromJSONFile.image;
                    
                    // Queue up the loading of the tileset image
                    scene.load.image(tilesetName, tilesetImageRelativeUrl);
                }
                
                /**
                 * Callback for when all the tilesets images have finished loading
                 */
                const onAllTilesetsImagesFinishedLoading = function() {
                    // Remove the listener since we're done with it now
                    scene.load.removeListener(Phaser.Loader.Events.COMPLETE, onAllTilesetsImagesFinishedLoading);
                    
                    // First create the tileset images so that they can be used by the layers
                    const loadedTilesets = {};
                    for (let i = 0; i < tilesetDefinitionsFromJSONFileLength; i++) {
                        const tilesetDefinition = tilesetDefinitionsFromJSONFile[i];
                        const tilesetName = tilesetDefinition.name;

                        // Create the tileset image
                        const tilesetImage = map.addTilesetImage(tilesetName);

                        // Save a reference to the tileset image so that it can be used by the layers
                        loadedTilesets[tilesetName] = {
                            tilesetImage: tilesetImage
                        };
                    }
                    
                    // console.log("All loaded tilesets:", loadedTilesets);
                        
                    // TODO: Need to make sure that the layers are iterated in the correct order
                    // Sort the tilesets by firstgid
                    let tilesets = dataFromJSONFile.tilesets.sort((a, b) => a.firstgid - b.firstgid);

                    // Calculate the maximum tile ID once
                    let maxTileId = Math.max(...dataFromJSONFile.layers.flatMap(layer => layer.data));

                    // Create a lookup table that maps each tile ID to its tileset
                    let tilesetLookup = {};
                    const tilesetsLengthMinusOne = tilesets.length - 1;
                    for (let i = 0; i < tilesetsLengthMinusOne; i++) {
                        for (let j = tilesets[i].firstgid; j < tilesets[i+1].firstgid; j++) {
                            tilesetLookup[j] = tilesets[i].name;
                        }
                    }
                    // The last tileset goes up to the maximum tile ID
                    for (let j = tilesets[tilesetsLengthMinusOne].firstgid; j <= maxTileId; j++) {
                        tilesetLookup[j] = tilesets[tilesetsLengthMinusOne].name;
                    }
                    
                    const allArenaObstaclesMatterBodies = [];

                    /** @type {Set<string>} */
                    const layerTilesetNamesSet = new Set();
                    const layersDefinitionsFromJSONFile = dataFromJSONFile.layers;
                    const layersDefinitionsFromJSONFileLength = layersDefinitionsFromJSONFile.length;
                    // console.log(layersDefinitionsFromJSONFile);
                    for (let i = 0; i < layersDefinitionsFromJSONFileLength; i++) {
                        const layerDefinitionFromJSONFile = layersDefinitionsFromJSONFile[i];

                        // Go through each tile in the layer
                        layerTilesetNamesSet.clear();
                        /** @type {number[]} */
                        const layerDefinitionFromJSONFileData = layerDefinitionFromJSONFile.data;
                        const layerDefinitionFromJSONFileDataLength = layerDefinitionFromJSONFileData.length;
                        for (let j = 0; j < layerDefinitionFromJSONFileDataLength; j++) {
                            const tileId = layerDefinitionFromJSONFileData[j];
                            
                            // Ignore empty tiles (ID 0)
                            if (tileId === 0) {
                                continue;
                            }

                            // Find the tileset this tile belongs to using the lookup table
                            layerTilesetNamesSet.add(tilesetLookup[tileId]);
                        }

                        const layerName = layerDefinitionFromJSONFile.name;
                        const layerTilesetNames = Array.from(layerTilesetNamesSet);
                        const tiledLayer = createTiledLayer(layerName, layerTilesetNames, loadedTilesets, map);
                        // console.log(tiledLayer);

                        // Create matter bodies for any collidable tiles
                        const matterBodies = PhysicsHelperFunctions.createMatterBodiesFromTilemapLayer({
                            layer: tiledLayer,
                            collisionCategory: CollisionCategories.Arena,
                            collidesWith: CollisionCategories.RobotBody | CollisionCategories.RobotProjectile
                        });

                        allArenaObstaclesMatterBodies.push(...matterBodies);
                    }

                    // Add all the arena obstacles bodies to the arena bodies collection
                    PhysicsBodiesManager.addArenaPhysicsBodies(
                        CollisionCategories.Arena, 
                        allArenaObstaclesMatterBodies, 
                        false);
                    
                    // We're now completely done loading the arena
                    arenaFinishedLoadingCallback();
                };

                // Hook up the callback for when all the tilesets images have finished loading
                scene.load.on(Phaser.Loader.Events.COMPLETE, onAllTilesetsImagesFinishedLoading);
                
                // Start the loader so that it loads the tileset images
                scene.load.start();
            });
            
            // Queue the loading of the Tiled JSON file
            scene.load.tilemapTiledJSON(tiledJSONFileKey, tiledJSONFile);
            
            // Start the loader so that it loads the Tiled JSON file
            scene.load.start();
        }
    };
    
    return arenaManager;
})();