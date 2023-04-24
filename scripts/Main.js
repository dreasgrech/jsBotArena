"use strict";

const GAME_WIDTH = 1024,
    GAME_HEIGHT = 1024;

var gameRunning = true;

const FrameCounter = (function() {
    const obj = {
        current: 0
    };

    return obj;
}());

const gameManager = (function() {

    const preload = function() {
        const gameContext = this;
        GameContextHolder.gameContext = gameContext;

        ImageDatabase.loadAllImages();

        gameContext.load.tilemapTiledJSON('arena_json', 'arena_map.json');

        gameContext.load.json('Hulls_CollisionData', './CollisionData/Hulls_CollisionData.json');
        gameContext.load.json('Projectiles_CollisionData', './CollisionData/Projectiles_CollisionData.json');
    };

    const create = function() {
        // Enable Matter physics
        this.matter.world.setBounds();

        const gameContext = GameContextHolder.gameContext;

        /*
            const floorImage = this.textures.get('arena_floor').getSourceImage();
            const floorImageWidth = floorImage.width;
            const floorImageHeight = floorImage.height;
    
            console.log(floorImageWidth);
            console.log(floorImageHeight);
    
            var posX = 0, posY = 0;
            const floor = this.add.tileSprite(posX, posY, GAME_WIDTH, GAME_HEIGHT, "arena_floor");
            floor.setOrigin(0, 0);
        */

        //this.add.image(0, 0, 'floor');
        const map = this.make.tilemap({ key: 'arena_json' });

        const floorTilesetImage = map.addTilesetImage('Floor', 'floor_image');
        const wallTilesetImage = map.addTilesetImage('Walls', 'wall_image');

        const floorLayer = map.createStaticLayer('Floor Layer', floorTilesetImage);
        const wallsLayer = map.createStaticLayer('Walls Layer', wallTilesetImage);

        // Set collision on the walls
        // wallsLayer.setCollisionByProperty({ collides: true });
        const matterBodies = PhysicsHelperFunctions.createMatterBodiesFromTilemapLayer({
            layer: wallsLayer,
            collisionCategory: PhysicsCategories.Walls,
            collidesWith: PhysicsCategories.RobotBody | PhysicsCategories.RobotProjectile
        });

        PhysicsBodies.addArenaPhysicsBodies(PhysicsObjectType.ArenaWall, matterBodies); // Add all the bodies from the arena to the arena bodies collection

        // PhysicsHelperFunctions.showDebugLayerCollisions(wallsLayer);

        RobotManager.addRobot(keyBot);
        // RobotManager.addRobot(shredder);
        //setTimeout(() => { RobotManager.addRobot(circleBot); }, 1500);
        //setTimeout(() => { RobotManager.addRobot(doNothingBot); }, 2000);
        //setTimeout(() => { RobotManager.addRobot(doNothingBot); }, 2500);

        UIManager.initialCreate();

        gameContext.matter.world.on('collisionstart',
            function(event /* , bodyA, bodyB */) {
                CollisionManager.handleEvent_CollisionStart(event);
            });
    };

    const clearPerFrameData = function() {
        CollisionManager.clearPerFrameData();
    };

    const update = function(time, delta) {
        if (!gameRunning) {
            return;
        }
        RobotManager.update(time, delta);

        UIManager.update(time, delta);

        //if (RobotsData_CurrentData.totalCollisions > 0) {
        //    console.log(`<${FrameCounter.current}> Total Pairs: ${RobotsData_CurrentData.totalCollisions}`);
        //}

        // Since we're now at the end of frame, clear any per-frame data
        clearPerFrameData();

        // Increase the frame counter
        FrameCounter.current++;
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
