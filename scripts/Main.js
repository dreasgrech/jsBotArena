"use strict";

let gameRunning = true;

//const GAME_DEBUG_MODE = true;
const GAME_DEBUG_MODE = false;

const gameManager = (function() {

    const objectsWith_preload = [
        RaycastManager,
        ImageDatabase,
        ProjectilesDatabase,
        AnimationSpritesDatabase,
        RobotPartsDatabase,
        AnimationManager
    ];

    const objectsWith_create = [
        AnimationSpritesDatabase,
        ProjectileManager,
        AnimationManager,
        //RobotMatterFactory,
        CollisionManager,
        UIManager,
        RobotsRadar,
        RobotManager
    ];

    const objectsWith_onEndOfFrame = [
        CollisionManager,
        ProjectileManager,
        DamageManager
    ];
    const totalObjectsWith_onEndOfFrame = objectsWith_onEndOfFrame.length;

    const objectsWith_update = [
        RobotManager,
        ObjectAnchorManager,
        UIManager
    ];
    const totalObjectsWith_update = objectsWith_update.length;


    const preload = function() {
        const gameContext = this;
        GameContextHolder.gameContext = gameContext;

        //gameContext.matter.set60Hz();

        // ImageDatabase.loadAllImages();

        gameContext.load.tilemapTiledJSON('arena_json', 'arena_map.json');

        gameContext.load.json('Hulls_CollisionData', './CollisionData/Hulls_CollisionData.json');
        gameContext.load.json('Projectiles_CollisionData', './CollisionData/Projectiles_CollisionData.json');
        //ProjectileManager.preload();

        for (let i = 0; i < objectsWith_preload.length; i++) {
            const toLoad = objectsWith_preload[i];
            toLoad.system_preload();
        }
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

        PhysicsBodies.addArenaPhysicsBodies(CollisionCategories.Arena, matterBodies, false); // Add all the bodies from the arena to the arena bodies collection

        // PhysicsHelperFunctions.showDebugLayerCollisions(wallsLayer);

        //RobotManager.addRobot(keyBot());
        //RobotManager.addRobot(doNothingBot());
        //RobotManager.addRobot(shredder());
        //RobotManager.addRobot(circleBot());
        //RobotManager.addRobot(sittingBot());
        //RobotManager.addRobot(followBot_followAngle());
        //RobotManager.addRobot(followBot_followPosition());
        //RobotManager.addRobot(CornerGuardBot());

        // setTimeout(() => { RobotManager.addRobot(circleBot()); }, 1500);
        //setTimeout(() => { RobotManager.addRobot(doNothingBot()); }, 2000);
        //setTimeout(() => { RobotManager.addRobot(doNothingBot()); }, 2500);

        gameContext.matter.world.on('collisionstart', CollisionManager.handleEvent_CollisionStart);
        //gameContext.anims.on('stop', function() { // doesnt work
        //    console.log('anim complete!');
        //});

        for (let i = 0; i < objectsWith_create.length; i++) {
            const toLoad = objectsWith_create[i];
            toLoad.system_create();
        }

        for (let i = 0; i < 1; i++) {
            RobotManager.addRobot(keyBot());
            RobotManager.addRobot(doNothingBot());
            RobotManager.addRobot(shredder());
            RobotManager.addRobot(circleBot());
            RobotManager.addRobot(sittingBot());
            RobotManager.addRobot(followBot_followAngle());
            RobotManager.addRobot(followBot_followPosition());
            RobotManager.addRobot(CornerGuardBot());
        }
    };

    const update = function(time, delta) {
        if (!gameRunning) {
            return;
        }

        GameContextHolder.gameTime = time*0.001;
        GameContextHolder.deltaTime = delta*0.001;

        for (let i = 0; i < totalObjectsWith_update; i++) {
            objectsWith_update[i].update();
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
            debug: GAME_DEBUG_MODE,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    },
    fps: {
        limit: 144
        //limit: 60
        //limit: 40
        //limit: 15
    }
});
