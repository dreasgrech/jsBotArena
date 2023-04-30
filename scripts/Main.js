"use strict";

var gameRunning = true;

const gameManager = (function() {

    const preload = function() {
        const gameContext = this;
        GameContextHolder.gameContext = gameContext;

        ImageDatabase.loadAllImages();

        gameContext.load.tilemapTiledJSON('arena_json', 'arena_map.json');

        gameContext.load.json('Hulls_CollisionData', './CollisionData/Hulls_CollisionData.json');
        gameContext.load.json('Projectiles_CollisionData', './CollisionData/Projectiles_CollisionData.json');
        //ProjectileManager.preload();
    };

    const create = function() {
        const gameContext = GameContextHolder.gameContext;

        // Enable Matter physics
        // TODO: Check about this https://newdocs.phaser.io/docs/3.55.2/Phaser.Physics.Matter.World#setBounds
        //gameContext.matter.world.setBounds();

        const map = gameContext.make.tilemap({ key: 'arena_json' });

        const floorTilesetImage = map.addTilesetImage('Floor', 'floor_image');
        const wallTilesetImage = map.addTilesetImage('Walls', 'wall_image');

        const floorLayer = map.createLayer('Floor Layer', floorTilesetImage);
        const wallsLayer = map.createLayer('Walls Layer', wallTilesetImage);

        // Set collision on the walls
        // wallsLayer.setCollisionByProperty({ collides: true });
        const matterBodies = PhysicsHelperFunctions.createMatterBodiesFromTilemapLayer({
            layer: wallsLayer,
            collisionCategory: CollisionCategories.Arena,
            collidesWith: CollisionCategories.RobotBody | CollisionCategories.RobotProjectile
        });

        PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.Arena, matterBodies); // Add all the bodies from the arena to the arena bodies collection

        // PhysicsHelperFunctions.showDebugLayerCollisions(wallsLayer);

        RobotManager.addRobot(keyBot);
        //RobotManager.addRobot(shredder);
        RobotManager.addRobot(doNothingBot);
        //RobotManager.addRobot(doNothingBot);
        //setTimeout(() => { RobotManager.addRobot(circleBot); }, 1500);
        //setTimeout(() => { RobotManager.addRobot(doNothingBot); }, 2000);
        //setTimeout(() => { RobotManager.addRobot(doNothingBot); }, 2500);

        UIManager.initialCreate();
        CollisionManager.initialCreate();

        gameContext.matter.world.on('collisionstart', CollisionManager.handleEvent_CollisionStart);

        var classesToOnCreate = [ProjectileManager];
        for (let i = 0; i < classesToOnCreate.length; i++) {
            const toLoad = classesToOnCreate[i];
            toLoad.onCreate();
        }
    };

    const objectsWith_onEndOfFrame = [
        CollisionManager,
        ProjectileManager
    ];
    const totalObjectsWith_onEndOfFrame = objectsWith_onEndOfFrame.length;

    const objectsWith_update = [
        RobotManager,
        UIManager
    ];
    const totalObjectsWith_update = objectsWith_update.length;

    const update = function(time, delta) {
        if (!gameRunning) {
            return;
        }

        for (let i = 0; i < totalObjectsWith_update; i++) {
            objectsWith_update[i].update(time, delta);
        }

        // Since we're now at the end of frame, clear any per-frame data
        for (let i = 0; i < totalObjectsWith_onEndOfFrame; i++) {
            objectsWith_onEndOfFrame[i].onEndOfFrame();
        }

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
    width: GameSetup.Width,
    height: GameSetup.Height,
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
