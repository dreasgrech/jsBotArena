"use strict";

// This bot tries to use as much of the API as possible to show what's available
const apiUsageExampleBot = function() {
    let gameContext;

    return {
        name: 'apiUsageExampleBot',
        create: function(robotSetup) {
            gameContext = GameContextHolder.scene;

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.Eight;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.One;

            const hullColor = 0xb83dba;

            const hullColors = hullSetup.colors;
            hullColors.topLeft = hullColor;
            hullColors.topRight = hullColor;
            hullColors.bottomLeft = hullColor;
            hullColors.bottomRight = hullColor;

            const turretColor = 0xb83dba;
            const turretColors = turretSetup.colors;
            turretColors.topLeft = turretColor;
            turretColors.topRight = turretColor;
            turretColors.bottomLeft = turretColor;
            turretColors.bottomRight = turretColor;

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
            //const x = api.rotateTowardsPosition( )

            //api.radar.scannedArenaElements

            //api.turretFollowHull = true;

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
