"use script";

const astarBot = function() {
    const DRAW_PATHFINDING_NODES = true;
    let gameContext;
    
    const scannedArenaObstacles = {};
    
    let ourCurrentPositionX;
    let ourCurrentPositionY;
    
    let pathCharted;
    let currentPath;
    let currentPathNodeIndex;
    
    let gridCellSizePixels_X;
    let gridCellSizePixels_Y;
    let pfGrid;
    // let pfFinder;
    
    let currentPathVisualizationGraphics;
    let currentPathNodeGraphics;
    
    let currentDestinationX;
    let currentDestinationY;
    
    let previousFrameOurPositionX;
    let previousFrameOurPositionY;
    
    let timeNotMoving_seconds = 0;
    
    let currentCornersGridCellIndex = 0;
    const cornersGridCellIndices = [];
    
    const getGridCellIndex_X = function(worldPosition){
        return Math.floor(worldPosition / gridCellSizePixels_X);
    };
    
    const getGridCellIndex_Y = function(worldPosition){
        return Math.floor(worldPosition / gridCellSizePixels_Y);
    };
    
    const chartNewPathTo = function(worldX, worldY){
        // Logger.log("Charting new path to", worldX, worldY);
        
        pathCharted = false;

        const worldXGridIndex = getGridCellIndex_X(worldX);
        const worldYGridIndex = getGridCellIndex_Y(worldY);

        const currentPositionGridX = getGridCellIndex_X(ourCurrentPositionX);
        const currentPositionGridY = getGridCellIndex_Y(ourCurrentPositionY);

        const pfGridClone = pfGrid.clone();
        const randomPathFinderIndex = Math.floor(Math.random()*pathFinders.length);
        console.log("Pathfinder index:", randomPathFinderIndex);
        const pfFinder = pathFinders[randomPathFinderIndex]; // Fetch a random path finder
        // currentPath = pfFinder.findPath(
        const newPath = pfFinder.findPath(
            currentPositionGridX,
            currentPositionGridY,
            worldXGridIndex,
            worldYGridIndex,
            pfGridClone);
        
        // Make sure that a path is found because this can happen if the destination is out of reach and a path is not possible to it
        if (newPath.length === 0) {
            // Logger.error("No path found");
            return false;
        }
        
        currentPath = newPath;
        
        //currentPath = PF.Util.smoothenPath(pfGridClone.clone(), currentPath);
        //currentPath = PF.Util.expandPath(pfGridClone, currentPath);
        
        // currentPathNodeIndex = 1; // Reset the index and skip the first node
        currentPathNodeIndex = Math.min(1, currentPath.length - 1); // Reset the index and skip the first node
        //Logger.log("New path", currentPath);

        // Draw a circle at each point in the path
        if (DRAW_PATHFINDING_NODES) {
            currentPathVisualizationGraphics.clear();
            currentPath.forEach(point => {
                currentPathVisualizationGraphics.fillCircle(
                    // point[0] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS * 0.5),
                    // point[1] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS * 0.5),
                    point[0] * gridCellSizePixels_X + (gridCellSizePixels_X * 0.5),
                    point[1] * gridCellSizePixels_Y + (gridCellSizePixels_Y * 0.5),
                    10); // 5 is the radius of the circle
            });

            // Color the first node in the path
            currentPathNodeGraphics.clear();
            currentPathNodeGraphics.fillCircle(
                // currentPath[currentPathNodeIndex][0] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS * 0.5),
                // currentPath[currentPathNodeIndex][1] * GRID_CELL_SIZE_PIXELS + (GRID_CELL_SIZE_PIXELS * 0.5),
                currentPath[currentPathNodeIndex][0] * gridCellSizePixels_X + (gridCellSizePixels_X * 0.5),
                currentPath[currentPathNodeIndex][1] * gridCellSizePixels_Y + (gridCellSizePixels_Y * 0.5),
                10); // 5 is the radius of the circle
            // Logger.log(pointer.x, pointer.y);       
        }
        
        currentDestinationX = worldX;
        currentDestinationY = worldY;
        
        pathCharted = true;
        
        return true;
    };
    
    const pointerDown = function(pointer){
        const pointerX = pointer.x;
        const pointerY = pointer.y;
        chartNewPathTo(pointerX, pointerY);
    };

    // TODO: Get this function outta here
    const getRandomIntInclusive = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
    };
    
    const chartPathToRandomPosition = function(){
        let randomGridCellIndexX;
        let randomGridCellIndexY;
        let isWalkableAtRandomGridCell;
        
        let currentTriesTotal = 0;
        
        do {
            randomGridCellIndexX = getRandomIntInclusive(1, 14);
            randomGridCellIndexY = getRandomIntInclusive(1, 14);
            
            isWalkableAtRandomGridCell = pfGrid.isWalkableAt(randomGridCellIndexX, randomGridCellIndexY);
            currentTriesTotal++;
        } while(!isWalkableAtRandomGridCell || currentTriesTotal >= 100);
        
        const worldPositionX = randomGridCellIndexX * gridCellSizePixels_X;
        const worldPositionY = randomGridCellIndexY * gridCellSizePixels_Y;
        
        chartNewPathTo(worldPositionX, worldPositionY);
    };
    
    const chartPathToNextCorner = function(){
        currentCornersGridCellIndex = (currentCornersGridCellIndex + 1) % cornersGridCellIndices.length;
        const nextCornerGridCellIndex = cornersGridCellIndices[currentCornersGridCellIndex];
        const nextCornerGridCellIndexX = nextCornerGridCellIndex[0];
        const nextCornerGridCellIndexY = nextCornerGridCellIndex[1];
        
        const worldPositionX = nextCornerGridCellIndexX * gridCellSizePixels_X;
        const worldPositionY = nextCornerGridCellIndexY * gridCellSizePixels_Y;
        
        chartNewPathTo(worldPositionX, worldPositionY);
    };
    
    const pathFinders = [];
    const createPathfinders = function(){
        pathFinders.push(
            new PF.AStarFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            }),
            new PF.BestFirstFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            }),
            new PF.BreadthFirstFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            }),
            new PF.DijkstraFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            }),
            // Andreas: The IDAStarFinder finder was sometimes hanging the entire game.
            // new PF.IDAStarFinder({
            //     allowDiagonal: true,
            //     dontCrossCorners: true,
            // }),
            // Andreas: The JumpPointFinder finder doesn't support dontCrossCorners so it's a bit problematic here
            // new PF.JumpPointFinder({
            //     allowDiagonal: true,
            //     // dontCrossCorners: true,
            // }),
            new PF.OrthogonalJumpPointFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            }),
            new PF.BiAStarFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            }),
            new PF.BiBestFirstFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            }),
            new PF.BiBreadthFirstFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            }),
            new PF.BiDijkstraFinder({
                allowDiagonal: true,
                dontCrossCorners: true,
            })
        );
    };
    
    let turretTurningLeft = true;
    
    return {
        name: 'astarBot',
        /**
         * 
         * @param robotSetup
         * @param gameOptions {GameSetup}
         */
        create: function(robotSetup, gameOptions) {
            gameContext = GameContextHolder.scene;
            
            if (DRAW_PATHFINDING_NODES) {
                currentPathVisualizationGraphics = gameContext.add.graphics({fillStyle: {color: 0xff0000}});
                currentPathNodeGraphics = gameContext.add.graphics({fillStyle: {color: 0x00ff00}});
            }

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
            gridCellSizePixels_X = gameOptions.tileWidth;
            gridCellSizePixels_Y = gameOptions.tileHeight;
            
            const gridWidth_numberOfCells = Math.floor(gameWidth / gridCellSizePixels_X);
            const gridHeight_numberOfCells = Math.floor(gameHeight / gridCellSizePixels_Y);
            pfGrid = new PF.Grid(gridWidth_numberOfCells, gridHeight_numberOfCells);
            Logger.log(pfGrid, gridCellSizePixels_X, gridCellSizePixels_Y, gridWidth_numberOfCells, gridHeight_numberOfCells);
            
            cornersGridCellIndices.push([1, 1]); // top-left
            cornersGridCellIndices.push([gridWidth_numberOfCells - 2, 1]); // top-right
            cornersGridCellIndices.push([gridWidth_numberOfCells - 2, gridHeight_numberOfCells - 2]); // bottom-right
            cornersGridCellIndices.push([1, gridHeight_numberOfCells - 2]); // bottom-left
            
            // pfFinder = new PF.BiAStarFinder({
            // //pfFinder = new PF.AStarFinder({
            //         allowDiagonal: true,
            //         dontCrossCorners: true,
            //         //heuristic: PF.Heuristic.chebyshev
            //     }
            // );
            createPathfinders();
        },
        onSpawned: function(api, time_seconds) {
            const radar = api.radar;
            radar.radarFollowTurret = true;
            radar.setFOVAngle_degrees(45);
            //radar.setFOVAngle_degrees(5);
        },
        update: function(api, time_seconds, delta_seconds) {
            ourCurrentPositionX = api.positionX;
            ourCurrentPositionY = api.positionY;

            if (pathCharted) {
                const deltaOurPositionX = ourCurrentPositionX - previousFrameOurPositionX;
                const deltaOurPositionY = ourCurrentPositionY - previousFrameOurPositionY;
                const currentlyMoving = Math.abs(deltaOurPositionX) > 0.01 && Math.abs(deltaOurPositionY) > 0.01;

                // Check if we're currently not moving
                if (!currentlyMoving) {
                    timeNotMoving_seconds += delta_seconds;

                    // If we've been stuck for some time, recalculate the path
                    if (timeNotMoving_seconds > 0.5) {
                        //console.log("stuck, so charting new path");
                        chartNewPathTo(currentDestinationX, currentDestinationY);
                        timeNotMoving_seconds = 0;
                    }
                } else {
                    timeNotMoving_seconds = 0;
                }

                const currentPathNode = currentPath[currentPathNodeIndex];
                const currentPathNodeX = currentPathNode[0] * gridCellSizePixels_X + (gridCellSizePixels_X * 0.5);
                const currentPathNodeY = currentPathNode[1] * gridCellSizePixels_Y + (gridCellSizePixels_Y * 0.5);

                const currentPathNodeXCellIndex = getGridCellIndex_X(currentPathNodeX);
                const currentPathNodeYCellIndex = getGridCellIndex_Y(currentPathNodeY);
                const ourCurrentPositionXCellIndex = getGridCellIndex_X(ourCurrentPositionX);
                const ourCurrentPositionYCellIndex = getGridCellIndex_Y(ourCurrentPositionY);
                // console.log(currentPathNodeXCellIndex, currentPathNodeYCellIndex, ourCurrentPositionXCellIndex, ourCurrentPositionYCellIndex);

                const areWeInsideCurrentPathNodeGridCell = currentPathNodeXCellIndex === ourCurrentPositionXCellIndex && currentPathNodeYCellIndex === ourCurrentPositionYCellIndex;
                if (areWeInsideCurrentPathNodeGridCell) {
                    const haveWeArrivedAtFinalNode = currentPathNodeIndex === currentPath.length - 1;
                    //console.log(haveWeArrived, currentPathNodeIndex, currentPath.length);
                    if (haveWeArrivedAtFinalNode) {
                        pathCharted = false;
                    } else {
                        if (currentPathNodeIndex < currentPath.length - 1) {
                            //Logger.log("Moving to next node", currentPathNodeIndex);
                            currentPathNodeIndex++;

                            // Recalculate the path to our current destination to get an improved path
                            chartNewPathTo(currentDestinationX, currentDestinationY);
                        }
                    }
                } else {
                    const rotatedTowardsPosition = api.rotateTowardsPosition(currentPathNodeX, currentPathNodeY);
                    if (rotatedTowardsPosition) {
                        api.move();
                    }
                }
            }

            //api.turretFollowHull = true;

            // const ourAngle_degrees = data.angle_degrees;
            //console.log(ourAngle_degrees);

            const collisions = api.collisions;
            const collisionsWithRobots = collisions.otherRobots;
            if (collisionsWithRobots.length > 0) {
                // Recalculate the path to our current destination to get an improved path
                if (pathCharted){
                    chartNewPathTo(currentDestinationX, currentDestinationY);
                }
               // Logger.log(`KeyBot robot collisions: ${collisionsWithRobots.length}: `, collisionsWithRobots);
               // for (let i = 0; i < collisionsWithRobots.length; i++) {
               //     const collisionWithRobot = collisionsWithRobots[i].data;
               //     //Logger.log(collisionWithRobot.positionX, collisionWithRobot.positionY);
               //     // api.fire(ProjectileTypes.Medium);
               //
               // }
            }

            // const collisionsWithArena = collisions.arena;
            // if (collisionsWithArena.length > 0) {
            //     // Recalculate the path to our current destination to get an improved path
            //     if (pathCharted) {
            //         chartNewPathTo(currentDestinationX, currentDestinationY);
            //     }
            //     // Logger.log(`KeyBot arena collisions: ${collisionsWithArena.length}: `, collisionsWithArena);
            //     // for (let i = 0; i < collisionsWithArena.length; i++) {
            //     //     const collisionWithArena = collisionsWithArena[i];
            //     //     //Logger.log('firing!');
            //     //     // api.fire(ProjectileTypes.Medium);
            //     // }
            // }

            //const collisionsWithProjectiles = collisions.projectiles;
            //if (collisionsWithProjectiles.length > 0) {
            //    for (let i = 0; i < collisionsWithProjectiles.length; i++) {
            //        const collisionWithProjectile = collisionsWithProjectiles[i];
            //        //Logger.log("We've been hit by a projectile!", collisionWithProjectile);
            //        // api.fire(ProjectileTypes.Medium);
            //    }

            //}

            const turret = api.turret;
            // const hullAngle = api.angle_degrees;
            // // const turretAngle = turret.angle_degrees;
            // const turretAngle = turret.angle_degrees - hullAngle;
            // const turretTurningRight = !turretTurningLeft;
            // if (turretTurningRight && turretAngle > 0){
            //     turretTurningLeft = true;
            // } else if (turretTurningLeft && turretAngle > 0) {
            //     turretTurningLeft = false;
            // }
            //    
            // if (turretTurningLeft){
            //     turret.rotateLeft();
            // } else {
            //     turret.rotateRight();
            // }
            // console.log(turretAngle);
            turret.rotateLeft();
            

            const radar = api.radar;
            //radar.rotateLeft();
            //const scannedAliveRobots = radar.scannedAliveRobots;
            //const totalScannedAliveRobots = scannedAliveRobots.length;
            //if (totalScannedAliveRobots > 0) {
            //    //Logger.log(`KeyBot scannedAliveRobots: ${totalScannedAliveRobots}: `, scannedAliveRobots);
            //}

            const scannedArenaElements = radar.scannedArenaElements;
            const scannedArenaElementsLength = scannedArenaElements.length;
            for (let i = 0; i < scannedArenaElementsLength; i++) {
                const scannedArenaElement = scannedArenaElements[i];
                const scannedArenaElementIndex = scannedArenaElement.index;
                
                // Skip this arena obstacle if we've already mapped it
                if (scannedArenaObstacles[scannedArenaElementIndex]) {
                    continue;
                }

                // Mark the grid cell where this arena obstacle resides in as non-walkable
                pfGrid.setWalkableAt(
                    getGridCellIndex_X(scannedArenaElement.positionX),
                    getGridCellIndex_Y(scannedArenaElement.positionY),
                    false);
                
                // Mark this obstacle as mapped so we don't process it again
                scannedArenaObstacles[scannedArenaElementIndex] = true;
            }
            //Logger.log(scannedArenaElements.length, "scanned arena elements");
            
            const scannedAliveRobots = radar.scannedAliveRobots;
            const scannedAliveRobotsLength = scannedAliveRobots.length;
            if (scannedAliveRobotsLength > 0) {
                api.fire(ProjectileTypes.Medium);
            }
            // for (let i = 0; i < scannedAliveRobotsLength; i++) {
            //     const scannedAliveRobot = scannedAliveRobots[i];
            // }
            
            previousFrameOurPositionX = ourCurrentPositionX;
            previousFrameOurPositionY = ourCurrentPositionY;
            
            // If we don't have a charted path atm, create a new one
            if (!pathCharted){
                // chartPathToRandomPosition();
                chartPathToNextCorner();
            }
        }
    };
};
