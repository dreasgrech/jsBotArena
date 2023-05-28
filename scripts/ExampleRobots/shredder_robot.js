"use strict";

const shredder = function() {
    let timeElapsed = 0;
    const interval = 3; // Move for one second, then stop for two seconds

    let rotateTimer = 0;
    const rotateInterval = 1; // Rotate every one second

    let turretRotatingLeft = true;

    let timeLastHitRobot = 0;
    let timeLastHitArena = 0;

    let movingForward = true;
    let rotatingLeft = true;

    const update = function(api, time_seconds, delta_seconds) {
        timeElapsed += delta_seconds;
        rotateTimer += delta_seconds;

        // ROTATION
        if (rotateTimer >= rotateInterval) {
            //console.log("rotating");
            if (Math.random() > 0.5) {
                rotatingLeft = true;
            } else {
                rotatingLeft = false;
            }
            rotateTimer = 0;
        }

        if (rotatingLeft) {
            api.rotateLeft();
        } else {
            api.rotateRight();
        }

        // MOVEMENT
        /*
        if (timeElapsed < 1) { // move
            movingForward = true;
            movingThisFrame = true;
        } else if (timeElapsed < interval) { // stop
            movingForward = false;
            movingThisFrame = true;
        } else {
            timeElapsed = 0;
            movingThisFrame = false;
        }
        */

        const collisions = api.collisions;
        const collisionsWithOtherRobots = collisions.otherRobots;
        if (collisionsWithOtherRobots.length > 0) {
            //Logger.log(`Shredder collisions: ${collisionsThisFrame.length}: `, collisionsThisFrame);
            for (let i = 0; i < collisionsWithOtherRobots.length; i++) {
                const collisionWithOtherRobots = collisionsWithOtherRobots[i];
                if (collisionWithOtherRobots.type === CollisionCategories.RobotBody) {
                    //Logger.log('firing!');
                    //api.fire(ProjectileTypes.Heavy);
                    movingForward = !movingForward;
                }

            }
        }

        const collisionsWithArena = collisions.arena;
        if (collisionsWithArena.length > 0) {
            //console.log("shredder hit arena", time_seconds, timeLastHitArena, time_seconds - timeLastHitArena);
            if (time_seconds - timeLastHitArena > 0.5) {
                //console.log("changing", movingForward, "to", !movingForward);
                movingForward = !movingForward;
                //console.log("movingForward after changer", movingForward);
                timeLastHitArena = time_seconds;
            }
        }

        if (movingForward) {
            api.move();
        } else {
            api.reverse();
        }

        const turret = api.turret;
        if (turretRotatingLeft) {
            turret.rotateLeft();
        } else {
            turret.rotateRight();
        }

        const radar = api.radar;
        radar.setFOVAngle_degrees(1);
        radar.radarFollowTurret = true;
        const scannedAliveRobots = radar.scannedAliveRobots;
        const totalScannedAliveRobots = scannedAliveRobots.length;
        if (totalScannedAliveRobots > 0) {
            //Logger.log(`Shredder scannedAliveRobots: ${totalScannedAliveRobots}: `, scannedAliveRobots);
            api.fire(ProjectileTypes.Light);
            turretRotatingLeft = !turretRotatingLeft;
        }
    };

    return {
        name: 'shredder',
        create: function(robotSetup) {
            const hullSetup = robotSetup.hull;
            const hullColors = hullSetup.colors;
            hullColors.topLeft = 0xff0000;
            hullColors.topRight = 0xff0000;
            hullColors.bottomLeft = 0xff0000;
            hullColors.bottomRight = 0xff0000;

        },
        update: update
    };
};
