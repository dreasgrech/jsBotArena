"use script";

const Arenas = { };

const ArenaManager = (function() {
    let arenaDefinitions = {};

    /**
     * 
     * @param layerDefinition {Object}
     * @param loadedTilesets {Object}
     * @param tilemap {Phaser.Tilemaps.Tilemap}
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
        onDatabaseLoaded: function(definitions) {
            const scene = GameContextHolder.scene;
            
            // TODO: fix these
            // TODO: fix these
            // TODO: fix these
            scene.load.image('floor_image', 'images/Arena/TopDownDungeonPack/Floors/Floor - Dirt 2 64x64.png');
            scene.load.image('wall_image', 'images/Arena/TopDownDungeonPack/Walls/Wall - Brick 2 64x64.png');
            
            for (let i = 0; i < definitions.length; i++) {
                const arenaDefinition = definitions[i];
                const tiledJSONFileKey = arenaDefinition.TiledJSONFileKey;
                const tiledJSONFile = arenaDefinition.TiledJSONFile;
                
                scene.load.tilemapTiledJSON(tiledJSONFileKey, tiledJSONFile);
                
                // Create the enum value
                const enumKey = arenaDefinition.EnumKey;
                Arenas[enumKey] = i;
                
                // Save the definition so that it can be used when loading the level
                arenaDefinitions[i] = arenaDefinition;
            }
            
            Logger.log(arenaDefinitions);
        },
        loadArena: function(arenaEnumKey, arenaFinishedLoadingCallback) {
            const scene = GameContextHolder.scene;
            const arenaDefinition = arenaDefinitions[arenaEnumKey];
            const tiledJSONFileKey = arenaDefinition.TiledJSONFileKey;
            
            const map = scene.make.tilemap({ key: tiledJSONFileKey });
            const mapWidthInPixels = map.widthInPixels;
            const mapHeightInPixels = map.heightInPixels;
            const mapTileHeightInPixels = map.tileHeight;
            const mapTileWidthInPixels = map.tileWidth;
            
            // TODO: Remove these from here
            GameSetup.width = mapWidthInPixels;
            GameSetup.height = mapHeightInPixels;
            GameSetup.tileWidth = mapTileWidthInPixels;
            GameSetup.tileHeight = mapTileHeightInPixels;
            
            const tilesetDefinitions = arenaDefinition.Tilesets;
            const loadedTilesets = {};
            for (let i = 0; i < tilesetDefinitions.length; i++) {
                const tilesetDefinition = tilesetDefinitions[i];
                const tilesetName = tilesetDefinition.TilesetName;
                const tilesetKey = tilesetDefinition.TilesetKey;

                // Load the tileset image in the scene
                const tilesetImage = map.addTilesetImage(tilesetName, tilesetKey);

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
                const solidObstaclesLayerDefinition = solidObstaclesLayersDefinitions[i];
                const solidObstaclesLayer = createTiledLayer(solidObstaclesLayerDefinition, loadedTilesets, map);
                
                // Create matter bodies from the solid-obstacles layer
                const matterBodies = PhysicsHelperFunctions.createMatterBodiesFromTilemapLayer({
                    layer: solidObstaclesLayer,
                    collisionCategory: CollisionCategories.Arena,
                    collidesWith: CollisionCategories.RobotBody | CollisionCategories.RobotProjectile
                });
                
                allSolidObstaclesMatterBodies.push(...matterBodies);
            }
            
            // Add all the solid-obstacles bodies to the arena bodies collection
            PhysicsBodiesManager.addArenaPhysicsBodies(CollisionCategories.Arena, allSolidObstaclesMatterBodies, false); // Add all the bodies from the arena to the arena bodies collection
        }
    };
    
    return arenaManager;
})();