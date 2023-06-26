"use script";

const Arenas = { };

const ArenaManager = (function() {
    let arenaDefinitions = {};

    /**
     * Creates a Tilemap layer from the provided layer definition (from JSON database)
     * @param layerDefinition {Object}
     * @param loadedTilesets {Object}
     * @param tilemap {Phaser.Tilemaps.Tilemap}
     * @return {Phaser.Tilemaps.TilemapLayer}
     */
    const createTiledLayer = function(layerDefinition, loadedTilesets, tilemap) {
        const tilesetName = layerDefinition.TiledLayerName;
        const usedTilesetsNames = layerDefinition.UsedTilesets;
        const usedTilesets = [];
        for (let j = 0; j < usedTilesetsNames.length; j++) {
            const usedTilesetName = usedTilesetsNames[j];
            const tilesetData = loadedTilesets[usedTilesetName];
            const tilesetImage = tilesetData.tilesetImage;
            usedTilesets.push(tilesetImage);
        }

        const tilemapLayer = tilemap.createLayer(tilesetName, usedTilesets);
        return tilemapLayer;
    }
    
    const arenaManager = {
        system_preload: function() {
        },
        onDatabaseLoaded: function(arenasDefinitions) {
            // const scene = GameContextHolder.scene;
            
            // scene.load.image('floor_image', 'images/Arena/TopDownDungeonPack/Floors/Floor - Dirt 2 64x64.png');
            // scene.load.image('wall_image', 'images/Arena/TopDownDungeonPack/Walls/Wall - Brick 2 64x64.png');
            
            for (let i = 0; i < arenasDefinitions.length; i++) {
                const arenaDefinition = arenasDefinitions[i];
                // const tiledJSONFileKey = arenaDefinition.TiledJSONFileKey;
                // const tiledJSONFile = arenaDefinition.TiledJSONFile;
                // scene.load.tilemapTiledJSON(tiledJSONFileKey, tiledJSONFile);
                
                // Create the enum value
                const enumKey = arenaDefinition.EnumKey;
                Arenas[enumKey] = i;
                
                // Save the definition so that it can be used when loading the level
                arenaDefinitions[i] = arenaDefinition;
            }
            
            //Logger.log(arenaDefinitions);
        },
        loadArena: function(arenaEnumKey, arenaFinishedLoadingCallback) {
            const scene = GameContextHolder.scene;
            
            const arenaDefinition = arenaDefinitions[arenaEnumKey];
            // const tiledJSONFileKey = arenaDefinition.TiledJSONFileKey;
            const tiledJSONFile = arenaDefinition.TiledJSONFile;
            const tiledJSONFileKey = tiledJSONFile;
            
            scene.load.once(`filecomplete-tilemapJSON-${tiledJSONFileKey}`, function(key, type, data) {
                
                // const tilesetsDefinitionFromCache = scene.cache.tilemap.get(tiledJSONFileKey).data.tilesets;
                // console.log(tilesetsDefinitionFromCache);

                const map = scene.make.tilemap({ key: tiledJSONFileKey });
                //console.log(map);
                const mapWidthInPixels = map.widthInPixels;
                const mapHeightInPixels = map.heightInPixels;
                const mapTileHeightInPixels = map.tileHeight;
                const mapTileWidthInPixels = map.tileWidth;

                // TODO: Remove these from here
                GameSetup.width = mapWidthInPixels;
                GameSetup.height = mapHeightInPixels;
                GameSetup.tileWidth = mapTileWidthInPixels;
                GameSetup.tileHeight = mapTileHeightInPixels;

                
                const tilesetDefinitions = data.tilesets;
                const tilesetDefinitionsLength = tilesetDefinitions.length;
                for (let i = 0; i < tilesetDefinitionsLength; i++) {
                    const tilesetDefinition = tilesetDefinitions[i];
                    const tilesetName = tilesetDefinition.name;
                    const tilesetImageRelativeUrl = tilesetDefinition.image;
                    
                    // Queue up the loading of the tileset image
                    scene.load.image(tilesetName, tilesetImageRelativeUrl);
                }
                
                /**
                 * Callback for when all the tilesets images have finished loading
                 */
                const onAllTilesetsImagesFinishedLoading = function() {
                    // Remove the listener since we're done with it now
                    scene.load.removeListener('complete', onAllTilesetsImagesFinishedLoading);
                    
                    // Create the tileset images so that they can be used by the layers
                    const loadedTilesets = {};
                    for (let i = 0; i < tilesetDefinitionsLength; i++) {
                        const tilesetDefinition = tilesetDefinitions[i];
                        const tilesetName = tilesetDefinition.name;

                        // Create the tileset image
                        const tilesetImage = map.addTilesetImage(tilesetName);

                        // Save a reference to the tileset image so that it can be used by the layers
                        loadedTilesets[tilesetName] = {
                            tilesetImage: tilesetImage
                        };
                    }

                    // Create the floors layers
                    const floorsLayersDefinitions = arenaDefinition["Floors Layers"];
                    for (let i = 0; i < floorsLayersDefinitions.length; i++) {
                        const layerDefinition = floorsLayersDefinitions[i];
                        createTiledLayer(layerDefinition, loadedTilesets, map);
                    }

                    // Create the solid-obstacles layers
                    const allSolidObstaclesMatterBodies = [];
                    const solidObstaclesLayersDefinitions = arenaDefinition["Solid-Obstacles Layers"];
                    for (let i = 0; i < solidObstaclesLayersDefinitions.length; i++) {
                        const layerDefinition = solidObstaclesLayersDefinitions[i];
                        const solidObstaclesLayer = createTiledLayer(layerDefinition, loadedTilesets, map);

                        // Create matter bodies from the solid-obstacles layer
                        const matterBodies = PhysicsHelperFunctions.createMatterBodiesFromTilemapLayer({
                            layer: solidObstaclesLayer,
                            collisionCategory: CollisionCategories.Arena,
                            collidesWith: CollisionCategories.RobotBody | CollisionCategories.RobotProjectile
                        });

                        allSolidObstaclesMatterBodies.push(...matterBodies);
                        console.log(matterBodies);
                    }

                    // Add all the solid-obstacles bodies to the arena bodies collection
                    PhysicsBodiesManager.addArenaPhysicsBodies(CollisionCategories.Arena, allSolidObstaclesMatterBodies, false); // Add all the bodies from the arena to the arena bodies collection
                    
                    arenaFinishedLoadingCallback();
                };

                // Hook up the callback for when all the tilesets images have finished loading
                scene.load.on('complete', onAllTilesetsImagesFinishedLoading);
                
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