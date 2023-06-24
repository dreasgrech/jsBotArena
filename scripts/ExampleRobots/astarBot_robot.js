"use script";

const astarBot = function() {
    let gameContext;
    
    const scannedArenaObstacles = {};
    
    let ourCurrentPositionX;
    let ourCurrentPositionY;
    
    let moving;
    let currentPath;
    let currentPathNodeIndex;
    
    const GRID_CELL_SIZE_PIXELS = 64;
    //const GRID_CELL_SIZE_PIXELS = 16;
    let pfGrid;
    let pfFinder;
    
    let currentPathVisualizationGraphics;
    
    let currentPathNodeGraphics;
    
    let pointerX, pointerY;
    
    //const isWorldPositionInCell
    const getGridCellIndex = function(worldPosition){
        return Math.floor(worldPosition / GRID_CELL_SIZE_PIXELS);
    };
    
    const pointerDown = function(pointer){
        // const pointerX = pointer.x;
        // const pointerY = pointer.y;
        pointerX = pointer.x;
        pointerY = pointer.y;
        moving = true;

        const pointerGridX = getGridCellIndex(pointerX);
        const pointerGridY = getGridCellIndex(pointerY);
        
        const currentPositionGridX = getGridCellIndex(ourCurrentPositionX);
        const currentPositionGridY = getGridCellIndex(ourCurrentPositionY);
        
        const pfGridClone = pfGrid.clone();
        currentPath = pfFinder.findPath(
            currentPositionGridX,
            currentPositionGridY,
            pointerGridX,
            pointerGridY,
            // Math.trunc(ourCurrentPositionX),
            // Math.trunc(ourCurrentPositionY),
            // Math.trunc(pointerX),
            // Math.trunc(pointerY),
            pfGridClone);
        //currentPath = PF.Util.smoothenPath(pfGridClone.clone(), currentPath);
        //currentPath = PF.Util.expandPath(pfGridClone, currentPath);
        // currentPathNodeIndex = 0; // Reset the index to 0 so that we continue from the start of this new path
        currentPathNodeIndex = 1; // Reset the index to 0 so that we continue from the start of this new path
        //Logger.log("New path", currentPath);

        // Draw a circle at each point in the path
        currentPathVisualizationGraphics.clear();
        currentPath.forEach(point => {
            currentPathVisualizationGraphics.fillCircle(
                point[0] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS*0.5), 
                point[1] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS*0.5), 
                10); // 5 is the radius of the circle
        });
        
        // Color the first node in the path
        currentPathNodeGraphics.clear();
        currentPathNodeGraphics.fillCircle(
            currentPath[currentPathNodeIndex][0] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS*0.5),
            currentPath[currentPathNodeIndex][1] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS*0.5),
            10); // 5 is the radius of the circle
        // Logger.log(pointer.x, pointer.y);
    };

    return {
        name: 'astarBot',
        create: function(robotSetup, gameOptions) {
            gameContext = GameContextHolder.scene;
            currentPathVisualizationGraphics = gameContext.add.graphics({ fillStyle: { color: 0xff0000 } }); // Red color
            currentPathNodeGraphics = gameContext.add.graphics({ fillStyle: { color: 0x00ff00 } }); // Red color

            const hullSetup = robotSetup.hull;
            //hullSetup.hullType = RobotHullTypes.Eight;
            hullSetup.hullType = EnumHelpers.getRandomValue(RobotHullTypes);

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
            
            const gridWidth = gameWidth / GRID_CELL_SIZE_PIXELS;
            const gridHeight = gameHeight / GRID_CELL_SIZE_PIXELS;
            pfGrid = new PF.Grid(gridWidth, gridHeight);
            Logger.log(pfGrid);
            
            pfFinder = new PF.BiAStarFinder({
            //pfFinder = new PF.AStarFinder({
                    allowDiagonal: true,
                    dontCrossCorners: true,
                    //heuristic: PF.Heuristic.chebyshev
                }
            );
        },
        onSpawned: function(api, time_seconds) {
            const radar = api.radar;
            //radar.radarFollowTurret = true;
            // radar.rotateLeft();
            radar.setFOVAngle_degrees(45);
        },
        update: function(api, time_seconds, delta_seconds) {
            //const x = api.rotateTowardsPosition( )
            const data = api.data;
            ourCurrentPositionX = data.positionX;
            ourCurrentPositionY = data.positionY;

/*
            if (moving) {
                const rotatedTowardsPosition = api.rotateTowardsPosition(pointerX, pointerY);
                if (!rotatedTowardsPosition){
                    Logger.log("rotating towards")
                } else {
                    api.move();
                }
            }
*/
            
            if (moving) {
                const currentPathNode = currentPath[currentPathNodeIndex];
                const currentPathNodeX = currentPathNode[0] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS * 0.5);
                const currentPathNodeY = currentPathNode[1] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS * 0.5);
                //Logger.log(currentPathNode);
                
                const currentPathNodeXCellIndex = getGridCellIndex(currentPathNodeX);
                const currentPathNodeYCellIndex = getGridCellIndex(currentPathNodeY);
                const ourCurrentPositionXCellIndex = getGridCellIndex(ourCurrentPositionX);
                const ourCurrentPositionYCellIndex = getGridCellIndex(ourCurrentPositionY);
                // console.log(currentPathNodeXCellIndex, currentPathNodeYCellIndex, ourCurrentPositionXCellIndex, ourCurrentPositionYCellIndex);

                const distanceBetweenCurrentPositionAndCurrentPathNodePosition = Phaser.Math.Distance.Between(
                    currentPathNodeX, currentPathNodeY,
                    ourCurrentPositionX, ourCurrentPositionY)
                // if (currentPathNodeX === truncCurrentPositionX && currentPathNodeY === truncCurrentPositionY) {
                //if (distanceBetweenCurrentPositionAndCurrentPathNodePosition < 5) {
                if (currentPathNodeXCellIndex === ourCurrentPositionXCellIndex && currentPathNodeYCellIndex === ourCurrentPositionYCellIndex) {
                //if (distanceBetweenCurrentPositionAndCurrentPathNodePosition < 0.5) {
                    if (currentPathNodeIndex < currentPath.length - 1) {
                        Logger.log("Moving to next node", currentPathNodeIndex);
                        currentPathNodeIndex++;
                        currentPathNodeGraphics.clear();
                        currentPathNodeGraphics.fillCircle(
                            currentPath[currentPathNodeIndex][0] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS*0.5),
                            currentPath[currentPathNodeIndex][1] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS*0.5),
                            10); // 5 is the radius of the circle
                    }
                } else {
                    // TODO: The problem here is that rotateTowardsPosition keeps rotating
                    const rotatedTowardsPosition = api.rotateTowardsPosition(currentPathNodeX, currentPathNodeY);
                    if (rotatedTowardsPosition) {
                        api.move();
                    }
                    // if (api.rotateTowardsPosition(pointerX, pointerY)){
                    //     api.move();
                    // }
                }
            }

            //api.turretFollowHull = true;

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
                    if (scannedArenaObstacles[scannedArenaElementIndex]) {
                        continue;
                    }

                    pfGrid.setWalkableAt(
                        Math.floor(scannedArenaElement.positionX / GRID_CELL_SIZE_PIXELS),
                        Math.floor(scannedArenaElement.positionY / GRID_CELL_SIZE_PIXELS)
                        , false);
                    scannedArenaObstacles[scannedArenaElementIndex] = true;
                    //Logger.log(pfGrid);
                }
                //Logger.log(scannedArenaElements.length, "scanned arena elements");
            }
        }
    };
};
