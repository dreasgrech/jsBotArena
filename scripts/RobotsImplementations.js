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

        const collisionsThisFrame = api.collisionsThisFrame;
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

        var scannedRobots = api.scannedRobots;
        var totalScannedRobots = scannedRobots.length;
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
    let cursors, wasdKeys;
    let firingKeyPressedLastFrame = false;

    var handleInput = function(api) {
        if (cursors.left.isDown) {
            api.rotateLeft();
        } else if (cursors.right.isDown) {
            api.rotateRight();
        }

        if (cursors.up.isDown) {
            api.move();
        } else if (cursors.down.isDown) {
            api.reverse();
        }

        const firingKeyDown = cursors.space.isDown;
        if (firingKeyDown && !firingKeyPressedLastFrame) {
            api.fire(ProjectileTypes.Heavy);
        }

        if (wasdKeys.A.isDown) {
            api.rotateTurretLeft();
        }

        if (wasdKeys.D.isDown) {
            api.rotateTurretRight();
        }

        firingKeyPressedLastFrame = firingKeyDown;;
    };

    return {
        name: 'keyBot',
        create: function() {
            gameContext = GameContextHolder.gameContext;

            cursors = gameContext.input.keyboard.createCursorKeys();
            wasdKeys = gameContext.input.keyboard.addKeys('W,S,A,D');
        },
        update: function(api, time, delta) {

            api.turretFollowHull = true;

            handleInput(api);

            const collisionsThisFrame = api.collisionsThisFrame;
            if (collisionsThisFrame.length > 0) {
                Logger.log(`KeyBot collisions: ${collisionsThisFrame.length}: `, collisionsThisFrame);
                for (let i = 0; i < collisionsThisFrame.length; i++) {
                    const collisionThisFrame = collisionsThisFrame[i];
                    if (collisionThisFrame.type === CollisionCategories.RobotBody) {
                        Logger.log('firing!');
                        // api.fire(ProjectileTypes.Medium);
                    }

                }
            }

            var scannedRobots = api.scannedRobots;
            var totalScannedRobots = scannedRobots.length;
            if (totalScannedRobots > 0) {
                // Logger.log(`KeyBot scannedRobots: ${totalScannedRobots}: `, scannedRobots);
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
