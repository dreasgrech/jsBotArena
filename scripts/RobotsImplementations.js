"use strict";

const shredder = (function() {
    //return {
    //    build: function() {
    //return (function() {
    let timeElapsed = 0;
    const interval = 3; // Move for one second, then stop for two seconds

    let rotateTimer = 0;
    const rotateInterval = 1; // Rotate every one second

    let turretRotatingLeft = true;

    let timeLastHitRobot = 0;
    let timeLastHitArena = 0;

    let movingForward = true;
    let rotatingLeft = true;

    const update = function(api, time, delta) {
        timeElapsed += delta;
        rotateTimer += delta;

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
                    api.fire(ProjectileTypes.Heavy);
                    movingForward = !movingForward;
                }

            }
        }

        const collisionsWithArena = collisions.arena;
        if (collisionsWithArena.length > 0) {
            //console.log("shredder hit arena", time, timeLastHitArena, time - timeLastHitArena);
            if (time - timeLastHitArena > 0.5) {
                //console.log("changing", movingForward, "to", !movingForward);
                movingForward = !movingForward;
                //console.log("movingForward after changer", movingForward);
                timeLastHitArena = time;
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
        const scannedRobots = radar.scannedRobots;
        const totalScannedRobots = scannedRobots.length;
        if (totalScannedRobots > 0) {
            //Logger.log(`Shredder scannedRobots: ${totalScannedRobots}: `, scannedRobots);
            api.fire(ProjectileTypes.Light);
            turretRotatingLeft = !turretRotatingLeft;
        }
    };

    return {
        name: 'shredder',
        create: function() {},
        update: update
    };
    // }());
//        }
//    };
}());

const circleBot = (function() {

    const forwardSpeed = 1; // Adjust this value to change the forward speed
    const rotationSpeed = 30; // Adjust this value to change the rotation speed

    const update = function(api, time, delta) {
        // Constantly move forward with a custom forward speed
        for (let i = 0; i < forwardSpeed; i++) {
            api.move();
        }

        // Constantly rotate with a custom rotation speed
        for (let i = 0; i < rotationSpeed; i++) {
            api.rotateLeft();
        }

        const turret = api.turret;
        turret.rotateLeft();

        const radar = api.radar;
        radar.radarFollowTurret = true;
        if (radar.scannedRobots.length > 0) {
            api.fire(ProjectileTypes.Light);
        }
    };

    return {
        name: 'circles',
        create: function(){},
        update: update
    };
}());

const keyBot = (function() {
    let gameContext;
    let cursors, wasdKeys, qeKeys;
    let firingKeyPressedLastFrame = false;

    const handleInput = function(api) {
        const turret = api.turret;
        const radar = api.radar;

        if (wasdKeys.A.isDown) {
            api.rotateLeft();
        } else if (wasdKeys.D.isDown) {
            api.rotateRight();
        }

        if (wasdKeys.W.isDown) {
            api.move();
        } else if (wasdKeys.S.isDown) {
            api.reverse();
        }

        // Turret
        if (qeKeys.Q.isDown) {
            turret.rotateLeft();
        }

        if (qeKeys.E.isDown) {
            turret.rotateRight();
        }

        // Radar
        if (cursors.left.isDown) {
            radar.rotateLeft();
        }

        if (cursors.right.isDown) {
            radar.rotateRight();
        }

        const firingKeyDown = cursors.space.isDown;
        if (firingKeyDown && !firingKeyPressedLastFrame) {
            // api.fire(EnumHelpers.getRandomValue(ProjectileTypes));
            api.fire(ProjectileTypes.Light);
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
            hullSetup.hullType = RobotHullTypes.Two;
            hullSetup.hullColor = RobotHullColors.Green;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.Two;
            turretSetup.turretColor = RobotTurretColors.Green;

            // const radarSetup = robotSetup.radar;
        },
        update: function(api, time, delta) {

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

            const turret = api.turret;
            //turret.rotateLeft();

            const radar = api.radar;
            //radar.radarFollowTurret = true;
            // radar.rotateLeft();
            radar.setFOVAngle_degrees(10);
            const scannedRobots = radar.scannedRobots;
            const totalScannedRobots = scannedRobots.length;
            if (totalScannedRobots > 0) {
                //Logger.log(`KeyBot scannedRobots: ${totalScannedRobots}: `, scannedRobots);
            }
        }
    };
}());

const sittingBot = (function() {
    let gameContext;

    return {
        name: 'Sitting Bot',
        create: function(robotSetup) {
            gameContext = GameContextHolder.gameContext;

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.Six;
            hullSetup.hullColor = RobotHullColors.Blue;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.Six;
            turretSetup.turretColor = RobotTurretColors.Brown;

            // const radarSetup = robotSetup.radar;
        },
        update: function(api, time, delta) {

            const radar = api.radar;
            radar.radarFollowTurret = true;
            radar.setFOVAngle_degrees(1);

            const turret = api.turret;
            turret.rotateLeft();

            const scannedRobots = radar.scannedRobots;
            const totalScannedRobots = scannedRobots.length;
            if (totalScannedRobots > 0) {
                api.fire(ProjectileTypes.Medium);
            }
        }
    };
}());

const doNothingBot = (function() {
    return {
        name: 'doNothing',
        create: function() {},
        update: function(api, time, delta) {}
    };
}());
