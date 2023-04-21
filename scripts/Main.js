"use strict";

var GAME_WIDTH = 1024,
    GAME_HEIGHT = 1024;

var gameManager = (function() {

    var preload = function() {
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

        // PhysicsHelperFunctions.showDebugLayerCollisions(wallsLayer);

        RobotManager.addRobot(shredder);
        RobotManager.addRobot(circleBot);
        RobotManager.addRobot(doNothingBot);
        RobotManager.addRobot(doNothingBot);

        UIManager.initialCreate();
    };

    var update = function(time, delta) {
        RobotManager.update(time, delta);

        UIManager.update(time, delta);
    };

    return {
        preload: preload,
        create: create,
        update: update
    }
}());

GameContextHolder.game = new Phaser.Game({
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

