"use script";

/**
 * @type {{
 BrownLevel: number,
 BridgeLevel: number,
 GreenLevel: number,
 MetalLevel: number,
 }}
 */
const Arenas = { };

// const TileTypes = {
//     Nothing: 0,
//     Wall: 1,
//     Water: 2,
// };

const ArenaManager = (function() {
    const arenaDefinitionsFromDB = {};
    
    let currentlyLoadedTilemap;

    /**
     * Creates a Tilemap layer from the provided layer definition (from JSON database)
     * @param tiledLayerName {string}
     * @param usedTilesetsNames {string[]}
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

        // Create the TilemapLayer
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
                currentlyLoadedTilemap = map;
                
                const gameWidth = map.widthInPixels;
                const gameHeight = map.heightInPixels;
                
                // TODO: These should probably be set from somewhere else
                GameSetup.width = gameWidth;
                GameSetup.height = gameHeight;
                GameSetup.tileWidth = map.tileWidth;
                GameSetup.tileHeight = map.tileHeight;
                
                const game = GameContextHolder.game;
                // Resize the game to fit the arena
                // First set the maximum size of the display to match the new arena's size
                // This will set the maximum size that the game can be resized to determined by the style element of the canvas
                game.scale.displaySize.setMax(gameWidth, gameHeight);
                // Then set the actual size of the game to match the new arena's size
                game.scale.setGameSize(gameWidth, gameHeight);
                
                // Queue up all the images for all the tilesets needed for this arena's tilemap
                const tilesetDefinitionsFromJSONFile = dataFromJSONFile.tilesets;
                const tilesetDefinitionsFromJSONFileLength = tilesetDefinitionsFromJSONFile.length;
                for (let i = 0; i < tilesetDefinitionsFromJSONFileLength; i++) {
                    const tilesetDefinitionFromJSONFile = tilesetDefinitionsFromJSONFile[i];
                    const tilesetName = tilesetDefinitionFromJSONFile.name;
                    let tilesetImageRelativeUrl = tilesetDefinitionFromJSONFile.image;
                    
                    // If the relative URL starts with "..", remove the first dot so that it becomes relative to the current directory.
                    const tilesetImageRelativeUrlStartsWithDotDot = tilesetImageRelativeUrl.startsWith("..");
                    if (tilesetImageRelativeUrlStartsWithDotDot){
                        tilesetImageRelativeUrl = tilesetImageRelativeUrl.substring(1);
                    }

                    // Queue up the loading of the tileset image
                    // Logger.log("Loading tileset image", tilesetName, tilesetImageRelativeUrl, tilesetImageRelativeUrlStartsWithDotDot);
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
                        
                    // Sort the tilesets by firstgid
                    const sortedTilesetDefinitionsFromJSONFile = tilesetDefinitionsFromJSONFile.sort((a, b) => a.firstgid - b.firstgid);

                    const layersDefinitionsFromJSONFile = dataFromJSONFile.layers;
                    
                    // Calculate the maximum tile ID once
                    const maxTileId = Math.max(...layersDefinitionsFromJSONFile.flatMap(layer => layer.data));

                    // Create a lookup table that maps each tile ID to its tileset
                    const tilesetLookup = {};
                    const tilesetsLengthMinusOne = sortedTilesetDefinitionsFromJSONFile.length - 1;
                    for (let i = 0; i < tilesetsLengthMinusOne; i++) {
                        for (let j = sortedTilesetDefinitionsFromJSONFile[i].firstgid; j < sortedTilesetDefinitionsFromJSONFile[i+1].firstgid; j++) {
                            tilesetLookup[j] = sortedTilesetDefinitionsFromJSONFile[i].name;
                        }
                    }
                    // The last tileset goes up to the maximum tile ID
                    for (let j = sortedTilesetDefinitionsFromJSONFile[tilesetsLengthMinusOne].firstgid; j <= maxTileId; j++) {
                        tilesetLookup[j] = sortedTilesetDefinitionsFromJSONFile[tilesetsLengthMinusOne].name;
                    }

                    /** @type {MatterJS.BodyType[]} */
                    const allArenaObstaclesMatterBodies = [];

                    /** @type {Set<string>} */
                    const layerTilesetNamesSet = new Set();
                    const layersDefinitionsFromJSONFileLength = layersDefinitionsFromJSONFile.length;
                    // console.log(layersDefinitionsFromJSONFile);
                    for (let i = 0; i < layersDefinitionsFromJSONFileLength; i++) {
                        const layerDefinitionFromJSONFile = layersDefinitionsFromJSONFile[i];

                        layerTilesetNamesSet.clear();
                        
                        // Go through each tile in the layer
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
                        // const matterBodies = PhysicsHelperFunctions.createMatterBodiesFromTilemapLayer({
                        //     layer: tiledLayer,
                        //     collisionCategory: CollisionCategories.Arena,
                        //     collidesWith: CollisionCategories.RobotBody | CollisionCategories.RobotProjectile
                        // });
                        let totalTilesMissingTileTypes = 0;

                        // Logger.log("Layer", tiledLayer);
                        tiledLayer.forEachTile(tile => {
                            
                            // Skip tiles which don't have a tile assigned to them
                            const tileIndex = tile.index;
                            if (tileIndex < 0){
                                return;
                            }
                            
                            const tileProperties = tile.properties;
                            const tileType = tileProperties.tiletype;
                            
                            // Don't do anything if the tile doesn't have a tile type
                            if (tileType == null || tileType === TileTypes.Nothing) {
                                totalTilesMissingTileTypes++;
                                // Logger.warn("Tile missing tile type:", tileType, tile);
                                
                                // Make sure we didn't spell the tile type property name wrong in the Tiled application
                                if (tileProperties["tileType"] || tileProperties["TileType"]) {
                                    Logger.error("WARNING: The correct case is 'tiletype' (NO CAPITAL LETTERS)");
                                }
                                
                                return;
                            }

                            // let tileCollisionTypeName = "";
                            // if (tileType === TileTypes.GenericWall) {
                            //     tileCollisionTypeName = "Wall";
                            // } else if (tileType === TileTypes.Water) {
                            //     tileCollisionTypeName = "Water";
                            // }
                            // console.log("Tile collision type:", tileType, tileCollisionTypeName);
                            
                            // const tileRequiresCollision = tile.properties.collides;
                            // if (!tileRequiresCollision) {
                            //     return;
                            // }
                            
                            // Resolve the Matter collision category for this tile type
                            const collisionCategory = TileTypesCollisionCategories[tileType];
                            
                            // Logger.log(tile, tileType, collisionCategory);
                            
                            // Skip tiles which have a 0 assigned as a collision category because that means that they don't collide with anything
                            if (collisionCategory === 0){
                                return;
                            }
                            
                            const x = tile.getCenterX();
                            const y = tile.getCenterY();
                            const w = tile.width;
                            const h = tile.height;
                            const body = scene.matter.add.rectangle(x, y, w, h, {isStatic: true});
                            PhysicsHelperFunctions.setCollisionProperties({
                                physicsObject: body,
                                group: 0,
                                category: collisionCategory,
                                collidesWithCategories: CollisionCategoriesCollidesWith[collisionCategory]
                            });
                            
                            allArenaObstaclesMatterBodies.push(body);
                        });
                        
                        if (totalTilesMissingTileTypes > 0){
                            Logger.warn("Total tiles missing tile types in layer", layerName, ":", totalTilesMissingTileTypes);
                        }
                    }

                    // Add all the arena obstacles bodies to the arena bodies collection
                    PhysicsBodiesManager.addStaticArenaPhysicsBodies(allArenaObstaclesMatterBodies);
                    
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
        },
        system_unloadLevel: function(){
            // Destroy the tilemap so that the images are removed from the game
            currentlyLoadedTilemap.removeAllLayers();
            currentlyLoadedTilemap.destroy(); // TODO: I think destroy() already calls removeAllLayers() so check.
            currentlyLoadedTilemap = null;
        }
    };
    
    return arenaManager;
})();