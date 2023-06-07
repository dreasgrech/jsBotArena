"use strict";

const keyBot = function() {
    let gameContext;
    let cursors, wasdKeys, qeKeys;
    let firingKeyPressedLastFrame = false;

    const handleInput = function(api) {
        const turret = api.turret;
        const radar = api.radar;

        // Hull Left/Right
        if (wasdKeys.A.isDown) {
            api.rotateLeft();
        } else if (wasdKeys.D.isDown) {
            api.rotateRight();
        }

        // Hull Forward/back
        if (wasdKeys.W.isDown) {
            api.move();
        } else if (wasdKeys.S.isDown) {
            api.reverse();
        }

        // Turret Left/Right
        if (qeKeys.Q.isDown) {
            turret.rotateLeft();
        } else if (qeKeys.E.isDown) {
            turret.rotateRight();
        }

        // Radar Left/Right
        if (cursors.left.isDown) {
            radar.rotateLeft();
        } else if (cursors.right.isDown) {
            radar.rotateRight();
        }

        // Fire
        const firingKeyDown = cursors.space.isDown;
        if (firingKeyDown && !firingKeyPressedLastFrame) {
            //api.fire(EnumHelpers.getRandomValue(ProjectileTypes));
        //    api.fire(ProjectileTypes.Light);
        //    api.fire(ProjectileTypes.Medium);
            api.fire(ProjectileTypes.Heavy);
        //    api.fire(ProjectileTypes.Granade);
        //    api.fire(ProjectileTypes.Shotgun);
        }

        firingKeyPressedLastFrame = firingKeyDown;;
    };

    return {
        name: 'keyBot',
        create: function(robotSetup) {
            gameContext = GameContextHolder.gameContext;
            cursors = gameContext.input.keyboard.createCursorKeys();
            wasdKeys = gameContext.input.keyboard.addKeys('W,S,A,D');
            qeKeys = gameContext.input.keyboard.addKeys('Q,E');

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.One;
            //hullSetup.hullColor = RobotHullColors.Brown;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.One;
            // turretSetup.turretColor = RobotTurretColors.Green;

            const hullColors = hullSetup.colors;
            hullColors.topLeft = 0xb83dba;
            hullColors.topRight = 0xb83dba;
            hullColors.bottomLeft = 0xb83dba;
            hullColors.bottomRight = 0xb83dba;


            // const radarSetup = robotSetup.radar;
        },
        onSpawned: function(api, time_seconds) {
            const radar = api.radar;
            //radar.radarFollowTurret = true;
            // radar.rotateLeft();
            radar.setFOVAngle_degrees(10);
            radar.setFOVAngle_degrees(45);
        },
        update: function(api, time_seconds, delta_seconds) {

            //api.turretFollowHull = true;

            handleInput(api);

            const data = api.data;
            const ourAngle_degrees = data.angle_degrees;
            //console.log(ourAngle_degrees);

            const collisions = api.collisions;
            const collisionsWithRobots = collisions.otherRobots;
            if (collisionsWithRobots.length > 0) {
                // Logger.log(`KeyBot robot collisions: ${collisionsWithRobots.length}: `, collisionsWithRobots);
                for (let i = 0; i < collisionsWithRobots.length; i++) {
                    const collisionWithRobot = collisionsWithRobots[i].data;
                    //Logger.log(collisionWithRobot.positionX, collisionWithRobot.positionY);
                    // api.fire(ProjectileTypes.Medium);

                }
            }

            const collisionsWithArena = collisions.arena;
            if (collisionsWithArena.length > 0) {
                // Logger.log(`KeyBot arena collisions: ${collisionsWithArena.length}: `, collisionsWithArena);
                for (let i = 0; i < collisionsWithArena.length; i++) {
                    const collisionWithArena = collisionsWithArena[i];
                    //Logger.log('firing!');
                    // api.fire(ProjectileTypes.Medium);
                }
            }
            const collisionsWithProjectiles = collisions.projectiles;
            if (collisionsWithProjectiles.length > 0) {
                for (let i = 0; i < collisionsWithProjectiles.length; i++) {
                    const collisionWithProjectile = collisionsWithProjectiles[i];
                    //Logger.log("We've been hit by a projectile!", collisionWithProjectile);
                    // api.fire(ProjectileTypes.Medium);
                }

            }

            const turret = api.turret;
            //turret.rotateLeft();

            const radar = api.radar;
            const scannedAliveRobots = radar.scannedAliveRobots;
            const totalScannedAliveRobots = scannedAliveRobots.length;
            if (totalScannedAliveRobots > 0) {
                //Logger.log(`KeyBot scannedAliveRobots: ${totalScannedAliveRobots}: `, scannedAliveRobots);
            }

            const scannedArenaElements = radar.scannedArenaElements;
            if (scannedArenaElements.length > 0) {
                //Logger.log(scannedArenaElements.length, "scanned arena elements");
            }
        }
    };
};
