"use strict";

var GAME_WIDTH = 1024,
    GAME_HEIGHT = 1024;

var gameManager = (function() {

    var preload = function() {
        var gameContext = this;
        GameContextHolder.gameContext = gameContext;

        ImageDatabase.loadAllImages();

        gameContext.load.tilemapTiledJSON('arena_json', 'arena_map.json');

        gameContext.load.json('Hulls_CollisionData', './CollisionData/Hulls_CollisionData.json');
        gameContext.load.json('Projectiles_CollisionData', './CollisionData/Projectiles_CollisionData.json');
    };

    var create = function() {
        // Enable Matter physics
        this.matter.world.setBounds();

        var gameContext = GameContextHolder.gameContext;

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
        var matterBodies = PhysicsHelperFunctions.createMatterBodiesFromTilemapLayer({
            layer: wallsLayer,
            collisionCategory: PhysicsCategories.Walls,
            collidesWith: PhysicsCategories.RobotBody | PhysicsCategories.RobotProjectile
        });

        for (let i = 0; i < matterBodies.length; i++) {
            let body = matterBodies[i];
            RobotManager.matterBodyToObjectType[body.id] =
            {
                type: PhysicsObjectType.ArenaWall
            };

            // console.log(i, matterBodies[i]);
        }

        PhysicsBodies.addArenaBodies(matterBodies); // Add all the bodies from the arena to the arena bodies collection

        // PhysicsHelperFunctions.showDebugLayerCollisions(wallsLayer);

        RobotManager.addRobot(shredder);
        //setTimeout(() => { RobotManager.addRobot(circleBot); }, 1500);
        //setTimeout(() => { RobotManager.addRobot(doNothingBot); }, 2000);
        //setTimeout(() => { RobotManager.addRobot(doNothingBot); }, 2500);

        UIManager.initialCreate();

        gameContext.matter.world.on('collisionstart',
            function(event, bodyA, bodyB) {
                // console.log('collision', bodyA, bodyB);
                // var bodyA_ID = bodyA.id;
                var bodyA_ID = bodyA.parent.id;
                //var bodyA_ID = bodyA.gameObject.body.id;
                //var bodyB_ID = bodyB.id;
                // var bodyB_ID = bodyB.gameObject.body.id;
                var bodyB_ID = bodyB.parent.id;

                //console.log('a: ', bodyA_ID, ', b: ', bodyB_ID);

                var bodyA_objectType = RobotManager.matterBodyToObjectType[bodyA_ID];
                var bodyB_objectType = RobotManager.matterBodyToObjectType[bodyB_ID];

                console.log(`A (${bodyA_ID})`, bodyA_objectType, `B (${bodyB_ID})`, bodyB_objectType);
                // console.log(bodyA, bodyB);
            });

        /*************************/
        //var x = GAME_WIDTH*0.5, y = GAME_HEIGHT*0.5;
        //RobotMatterFactory.createRobot({
        //    currentRobotIndex: 0,
        //    scale: 0.4,
        //    x: x,
        //    y: y,
        //    robotHullColor: RobotHullColors.Brown
        //});
        /*************************/
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

var compoundBody;

