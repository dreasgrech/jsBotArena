"use script";

const astarBot = function() {
    let gameContext;
    
    let pathfinderGrid;
    
    const scannedArenaObstacles = {};
    
    let moving;
    let movingToX, movingToY;
    
    const pointerDown = function(pointer){
        movingToX = pointer.x;
        movingToY = pointer.y;
        moving = true;
        Logger.log(pointer.x, pointer.y);
    };

    return {
        name: 'astarBot',
        create: function(robotSetup, gameOptions) {
            gameContext = GameContextHolder.scene;

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.Eight;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.One;

            const hullColor = 0x454B1B;

            const hullColors = hullSetup.colors;
            hullColors.topLeft = hullColor;
            hullColors.topRight = hullColor;
            hullColors.bottomLeft = hullColor;
            hullColors.bottomRight = hullColor;

            const turretColor = 0xAFE1AF;
            const turretColors = turretSetup.colors;
            turretColors.topLeft = turretColor;
            turretColors.topRight = turretColor;
            turretColors.bottomLeft = turretColor;
            turretColors.bottomRight = turretColor;

            // const radarSetup = robotSetup.radar;
            
            GameContextHolder.scene.input.on('pointerdown', pointerDown);
            
            const gameWidth = gameOptions.width;
            const gameHeight = gameOptions.height;
            
            // const gridWidth = gameWidth;
            // const gridWidth = 800;
            pathfinderGrid = new PF.Grid(gameWidth, gameHeight);
            
            //new PF.AStarFinder();
        },
        onSpawned: function(api, time_seconds) {
            const radar = api.radar;
            //radar.radarFollowTurret = true;
            // radar.rotateLeft();
            radar.setFOVAngle_degrees(45);
        },
        update: function(api, time_seconds, delta_seconds) {
            //const x = api.rotateTowardsPosition( )
            
            if (moving){
                if (api.rotateTowardsPosition(movingToX, movingToY)){
                    api.move();
                }
            }

            //api.turretFollowHull = true;

            const data = api.data;
            const ourAngle_degrees = data.angle_degrees;
            //console.log(ourAngle_degrees);

            //const collisions = api.collisions;
            //const collisionsWithRobots = collisions.otherRobots;
            //if (collisionsWithRobots.length > 0) {
            //    // Logger.log(`KeyBot robot collisions: ${collisionsWithRobots.length}: `, collisionsWithRobots);
            //    for (let i = 0; i < collisionsWithRobots.length; i++) {
            //        const collisionWithRobot = collisionsWithRobots[i].data;
            //        //Logger.log(collisionWithRobot.positionX, collisionWithRobot.positionY);
            //        // api.fire(ProjectileTypes.Medium);

            //    }
            //}

            //const collisionsWithArena = collisions.arena;
            //if (collisionsWithArena.length > 0) {
            //    // Logger.log(`KeyBot arena collisions: ${collisionsWithArena.length}: `, collisionsWithArena);
            //    for (let i = 0; i < collisionsWithArena.length; i++) {
            //        const collisionWithArena = collisionsWithArena[i];
            //        //Logger.log('firing!');
            //        // api.fire(ProjectileTypes.Medium);
            //    }
            //}

            //const collisionsWithProjectiles = collisions.projectiles;
            //if (collisionsWithProjectiles.length > 0) {
            //    for (let i = 0; i < collisionsWithProjectiles.length; i++) {
            //        const collisionWithProjectile = collisionsWithProjectiles[i];
            //        //Logger.log("We've been hit by a projectile!", collisionWithProjectile);
            //        // api.fire(ProjectileTypes.Medium);
            //    }

            //}

            const turret = api.turret;
            //turret.rotateLeft();

            const radar = api.radar;
            radar.rotateLeft();
            //const scannedAliveRobots = radar.scannedAliveRobots;
            //const totalScannedAliveRobots = scannedAliveRobots.length;
            //if (totalScannedAliveRobots > 0) {
            //    //Logger.log(`KeyBot scannedAliveRobots: ${totalScannedAliveRobots}: `, scannedAliveRobots);
            //}

            const scannedArenaElements = radar.scannedArenaElements;
            if (scannedArenaElements.length > 0) {
                for (let i = 0; i < scannedArenaElements.length; i++) {
                    const scannedArenaElement = scannedArenaElements[i];
                    const scannedArenaElementIndex = scannedArenaElement.index;
                    if (scannedArenaObstacles[scannedArenaElementIndex]){
                        continue;
                    }
                    
                    pathfinderGrid.setWalkableAt(scannedArenaElement.positionX, scannedArenaElement.positionY, false);
                    scannedArenaObstacles[scannedArenaElementIndex] = true;
                    Logger.log(pathfinderGrid);
                }
                //Logger.log(scannedArenaElements.length, "scanned arena elements");
            }
        }
    };
};
