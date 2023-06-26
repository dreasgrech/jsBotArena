"use script";

const Arenas = { };

const ArenaManager = (function() {
    let arenaDefinitions = {};
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
        loadArena: function(arenaEnumKey) {
            const scene = GameContextHolder.scene;
            const arenaDefinition = arenaDefinitions[arenaEnumKey];
            const tiledJSONFileKey = arenaDefinition.TiledJSONFileKey;
            
            const map = scene.make.tilemap({ key: tiledJSONFileKey });
            const mapWidthInPixels = map.widthInPixels;
            const mapHeightInPixels = map.heightInPixels;
            const mapTileHeightInPixels = map.tileHeight;
            const mapTileWidthInPixels = map.tileWidth;
            
            GameSetup.width = mapWidthInPixels;
            GameSetup.height = mapHeightInPixels;
            GameSetup.tileWidth = mapTileWidthInPixels;
            GameSetup.tileHeight = mapTileHeightInPixels;
            
            // Create the floors layers
            const floorsLayersDefinitions = arenaDefinition["Floors Layers"];
            for (let i = 0; i < floorsLayersDefinitions.length; i++) {
                const floorLayerDefinition = floorsLayersDefinitions[i];
                
                const tilesetName = floorLayerDefinition.TilesetName;
                const tilesetKey = floorLayerDefinition.TilesetKey;
                const tilesetLayerID = floorLayerDefinition.TilesetLayerID;
                
                const floorTilesetImage = map.addTilesetImage(tilesetName, tilesetKey);
                const floorLayer = map.createLayer(tilesetLayerID, floorTilesetImage);
            }
            
            // Create the solid-obstacles layers
            const allSolidObstaclesMatterBodies = [];
            const solidObstaclesLayersDefinitions = arenaDefinition["Solid-Obstacles Layers"];
            for (let i = 0; i < solidObstaclesLayersDefinitions.length; i++) {
                const solidObstaclesLayerDefinition = solidObstaclesLayersDefinitions[i];
                
                const tilesetName = solidObstaclesLayerDefinition.TilesetName;
                const tilesetKey = solidObstaclesLayerDefinition.TilesetKey;
                const tilesetLayerID = solidObstaclesLayerDefinition.TilesetLayerID;
                
                const solidObstaclesTilesetImage = map.addTilesetImage(tilesetName, tilesetKey);
                const solidObstaclesLayer = map.createLayer(tilesetLayerID, solidObstaclesTilesetImage);
                
                const matterBodies = PhysicsHelperFunctions.createMatterBodiesFromTilemapLayer({
                    layer: solidObstaclesLayer,
                    collisionCategory: CollisionCategories.Arena,
                    collidesWith: CollisionCategories.RobotBody | CollisionCategories.RobotProjectile
                });
                
                allSolidObstaclesMatterBodies.push(...matterBodies);
            }
            
            PhysicsBodiesManager.addArenaPhysicsBodies(CollisionCategories.Arena, allSolidObstaclesMatterBodies, false); // Add all the bodies from the arena to the arena bodies collection
        }
    };
    
    return arenaManager;
})();