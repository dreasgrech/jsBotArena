"use strict";

const shredder = (function() {

    let timeElapsed = 0;
    const interval = 3000; // Move for one second, then stop for two seconds

    let rotateTimer = 0;
    const rotateInterval = 1000; // Rotate every one second

    const update = function(api, time, delta) {
        timeElapsed += delta;
        rotateTimer += delta;

        if (rotateTimer >= rotateInterval)
        {
            if (Math.random() > 0.5) {
                api.rotateLeft();
            } else {
                api.rotateRight();
            }
            rotateTimer = 0;
        }

        if (timeElapsed < 1000) { // move
            api.move();
        } else if (timeElapsed < interval) { // stop
            // Do nothing
            api.reverse();
        } else { // Move for one second
            timeElapsed = 0;
        }
        //api.move();

        const collisions = api.collisions;
        // const collisionsThisFrame = api.collisionsThisFrame;
        const collisionsThisFrame = collisions.otherRobots;
        if (collisionsThisFrame.length > 0) {
            Logger.log(`Shredder collisions: ${collisionsThisFrame.length}: `, collisionsThisFrame);
            for (let i = 0; i < collisionsThisFrame.length; i++) {
                const collisionThisFrame = collisionsThisFrame[i];
                if (collisionThisFrame.type === CollisionCategories.RobotBody) {
                    Logger.log('firing!');
                    // api.fire(ProjectileTypes.Medium);
                }

            }
        }

        const radar = api.radar;
        const scannedRobots = radar.scannedRobots;
        const totalScannedRobots = scannedRobots.length;
        if (totalScannedRobots > 0) {
            Logger.log(`Shredder scannedRobots: ${totalScannedRobots}: `, scannedRobots);
            api.fire(ProjectileTypes.Medium);
        }
    };

    return {
        name: 'shredder',
        create: function(){},
        update: update
    };
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
            api.fire(EnumHelpers.getRandomValue(ProjectileTypes));
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

            robotSetup.hullType = RobotHullTypes.Two;
            robotSetup.turretType = RobotTurretTypes.Two;

            robotSetup.hullColor = RobotHullColors.Green;
            robotSetup.turretColor = RobotTurretColors.Green;
        },
        update: function(api, time, delta) {

            //api.turretFollowHull = true;

            handleInput(api);

            const collisions = api.collisions;
            const collisionsWithRobots = collisions.otherRobots;
            if (collisionsWithRobots.length > 0) {
                // Logger.log(`KeyBot robot collisions: ${collisionsWithRobots.length}: `, collisionsWithRobots);
                for (let i = 0; i < collisionsWithRobots.length; i++) {
                    const collisionWithRobot = collisionsWithRobots[i].data;
                    Logger.log(collisionWithRobot.positionX, collisionWithRobot.positionY);
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
            turret.rotateLeft();

            const radar = api.radar;
            radar.radarFollowTurret = true;
            // radar.rotateLeft();
            const scannedRobots = radar.scannedRobots;
            const totalScannedRobots = scannedRobots.length;
            if (totalScannedRobots > 0) {
                Logger.log(`KeyBot scannedRobots: ${totalScannedRobots}: `, scannedRobots);
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
