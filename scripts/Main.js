"use strict";

var GAME_WIDTH = 1024,
    GAME_HEIGHT = 1024;

var gameManager = (function() {

    var preload = function() {
        // gameContext = this;
        GameContextHolder.gameContext = this;

        ImageDatabase.loadAllImages();

        this.load.tilemapTiledJSON('arena_json', 'arena_map.json');
    };

    var create = function() {
        // Enable Matter physics
        this.matter.world.setBounds();
        /*
            var floorImage = this.textures.get('arena_floor').getSourceImage();
            var floorImageWidth = floorImage.width;
            var floorImageHeight = floorImage.height;
    
            console.log(floorImageWidth);
            console.log(floorImageHeight);
    
            var posX = 0, posY = 0;
            var floor = this.add.tileSprite(posX, posY, GAME_WIDTH, GAME_HEIGHT, "arena_floor");
            floor.setOrigin(0, 0);
        */

        //this.add.image(0, 0, 'floor');
        var map = this.make.tilemap({ key: 'arena_json' });

        var floorTilesetImage = map.addTilesetImage('Floor', 'floor_image');
        var wallTilesetImage = map.addTilesetImage('Walls', 'wall_image');

        var floorLayer = map.createStaticLayer('Floor Layer', floorTilesetImage);
        var wallsLayer = map.createStaticLayer('Walls Layer', wallTilesetImage);

        // Set collision on the walls
        // wallsLayer.setCollisionByProperty({ collides: true });
        var matterBodies = PhysicsHelperFunctions.createMatterBodiesFromTilemapLayer({ layer: wallsLayer, collisionCategory: PhysicsCategories.Walls, collidesWith: PhysicsCategories.RobotBody });
        PhysicsBodies.addArenaBodies(matterBodies); // Add all the bodies from the arena to the arena bodies collection

        // helperFunctions.showDebugLayerCollisions(wallsLayer);

        robotManager.addRobot(shredder);
        robotManager.addRobot(circleBot);
    };

    var update = function(time, delta) {
        robotManager.update(time, delta);
    };

    return {
        preload: preload,
        create: create,
        update: update
    }
}());

var helperFunctions = (function() {

    // Shows collision on a layer with a different color for debugging.
    // TODO: move this function to PhysicsHelperFunctions
    var showDebugLayerCollisions = function(layer) {
        var debugGraphics = GameContextHolder.gameContext.add.graphics().setAlpha(0.75);
        layer.renderDebug(debugGraphics,
            {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
    };

    return {
        showDebugLayerCollisions: showDebugLayerCollisions
    };
}());

var game = new Phaser.Game({
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scene: {
        preload: gameManager.preload,
        create: gameManager.create,
        update: gameManager.update
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    }
});
