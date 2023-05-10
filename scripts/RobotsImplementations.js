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

const circleBot = function() {

    const forwardSpeed = 1; // Adjust this value to change the forward speed
    const rotationSpeed = 30; // Adjust this value to change the rotation speed

    const update = function(api, time_seconds, delta_seconds) {
        // Constantly move forward with a custom forward speed
        for (let i = 0; i < forwardSpeed; i++) {
            api.move();
        }

        // Constantly rotate with a custom rotation speed
        //for (let i = 0; i < rotationSpeed; i++) {
            api.rotateLeft();
        //}

        const turret = api.turret;
        turret.rotateLeft();

        const radar = api.radar;
        radar.radarFollowTurret = true;
        if (radar.scannedAliveRobots.length > 0) {
            api.fire(ProjectileTypes.Light);
        }
    };

    return {
        name: 'circles',
        create: function() {},
        update: update
    };
};

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
            hullSetup.hullType = RobotHullTypes.Six;
            //hullSetup.hullColor = RobotHullColors.Brown;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.Eight;
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

            const turret = api.turret;
            //turret.rotateLeft();

            const radar = api.radar;
            const scannedAliveRobots = radar.scannedAliveRobots;
            const totalScannedAliveRobots = scannedAliveRobots.length;
            if (totalScannedAliveRobots > 0) {
                //Logger.log(`KeyBot scannedAliveRobots: ${totalScannedAliveRobots}: `, scannedAliveRobots);
            }
        }
    };
};

const sittingBot = function() {
    let gameContext;

    return {
        name: 'Sitting Bot',
        create: function(robotSetup) {
            gameContext = GameContextHolder.gameContext;

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.Six;
            //hullSetup.hullColor = RobotHullColors.Blue;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.Six;
            // turretSetup.turretColor = RobotTurretColors.Brown;

            // const radarSetup = robotSetup.radar;
        },
        onSpawned: function(api, time_seconds) {
            const radar = api.radar;
            radar.radarFollowTurret = true;
            radar.setFOVAngle_degrees(1);
        },
        update: function(api, time_seconds, delta_seconds) {

            /*
            const turret = api.turret;
            turret.rotateLeft();

            const radar = api.radar;
            const scannedAliveRobots = radar.scannedAliveRobots;
            const totalScannedAliveRobots = scannedAliveRobots.length;
            if (totalScannedAliveRobots > 0) {
                api.fire(ProjectileTypes.Medium);
            }
            */

            const atRotation = api.rotateTowardsAngle_degrees(-148);
            if (atRotation) {
                //console.log("At hull rotation");
            }

            const turret = api.turret;
            const atTurretRotation = turret.rotateTowardsAngle_degrees(273);
        }
    };
};

const doNothingBot = function() {
    return {
        name: 'doNothing',
        create: function() {},
        onSpawned: function(api, time_seconds) {
            api.radar.radarEnabled = false;
        },
        update: function(api, time_seconds, delta_seconds) {
            api.rotateTowardsAngle_degrees(45);
        }
    };
};

const followBot_followAngle = function() {
    let gameContext;

    let foundFirstBot = false;
    let rotatingTowardsAngle_degrees = 0;
    let turretRotatingLeft = true;

    return {
        name: 'Follow Bot (Angle)',
        create: function(robotSetup) {
            gameContext = GameContextHolder.gameContext;

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.Four;
            //hullSetup.hullColor = RobotHullColors.Green;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.Four;
            // turretSetup.turretColor = RobotTurretColors.Aqua;

            // const radarSetup = robotSetup.radar;
        },
        onSpawned: function(api, time_seconds) {
            const radar = api.radar;
            radar.radarFollowTurret = true;
             //radar.setFOVAngle_degrees(45);
            radar.setFOVAngle_degrees(1);
             //radar.setFOVAngle_degrees(10);
        },
        update: function(api, time_seconds, delta_seconds) {

            const radar = api.radar;
            const scannedAliveRobots = radar.scannedAliveRobots;
            const totalScannedAliveRobots = scannedAliveRobots.length;
            if (totalScannedAliveRobots > 0) {
                const closestRobot = scannedAliveRobots[0];
                // const closestRobotAngle_degrees = closestRobot.angle_degrees;
                const closestRobotAngle_degrees = closestRobot.bearing_degrees;
                rotatingTowardsAngle_degrees = closestRobotAngle_degrees;
                turretRotatingLeft = !turretRotatingLeft;
                foundFirstBot = true;
            }

            const turret = api.turret;
            if (turretRotatingLeft) {
                turret.rotateLeft();
            } else {
                turret.rotateRight();
            }

            const facingAngle = api.rotateTowardsAngle_degrees(rotatingTowardsAngle_degrees);
            if (foundFirstBot && facingAngle) {
                //api.move();

                api.fire(ProjectileTypes.Medium);
            }

            // TODO: If total alive robots are 0, then don't do anything
        }
    };
};

const followBot_followPosition = function() {
    let gameContext;

    let foundFirstBot = false;
    let rotatingTowardsPositionX = 0, rotatingTowardsPositionY = 0;
    let turretRotatingLeft = true;

    return {
        name: 'Follow Bot (Position)',
        create: function(robotSetup) {
            gameContext = GameContextHolder.gameContext;

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.Four;
            //hullSetup.hullColor = RobotHullColors.Green;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.Four;
            // turretSetup.turretColor = RobotTurretColors.Aqua;

            // const radarSetup = robotSetup.radar;
        },
        onSpawned: function(api, time_seconds) {
            const radar = api.radar;
            radar.radarFollowTurret = true;
            //radar.setFOVAngle_degrees(45);
            //radar.setFOVAngle_degrees(1);
            radar.setFOVAngle_degrees(10);
        },
        update: function(api, time_seconds, delta_seconds) {

            const radar = api.radar;
            const scannedAliveRobots = radar.scannedAliveRobots;
            const totalScannedAliveRobots = scannedAliveRobots.length;
            if (totalScannedAliveRobots > 0) {
                const closestRobot = scannedAliveRobots[0];
                const closestRobot_positionX = closestRobot.positionX;
                const closestRobot_positionY = closestRobot.positionY;
                rotatingTowardsPositionX = closestRobot_positionX;
                rotatingTowardsPositionY = closestRobot_positionY;

                turretRotatingLeft = !turretRotatingLeft;
                foundFirstBot = true;
            }

            const turret = api.turret;
            if (turretRotatingLeft) {
                turret.rotateLeft();
            } else {
                turret.rotateRight();
            }

            if (foundFirstBot) {
                const facingPosition = api.rotateTowardsPosition(rotatingTowardsPositionX, rotatingTowardsPositionY);
                if (facingPosition) {
                    api.move();

                    api.fire(ProjectileTypes.Medium);
                }
            }

            // TODO: If total alive robots are 0, then don't do anything
        }
    };
};

// chat-gpt
const SniperBot = function () {
    let gameContext;

    const preferredDistance = 300;
    const fireDelaySeconds = 1;
    let lastFiredTimeSeconds = 0;
    let targetPositionX = 0;
    let targetPositionY = 0;
    let hasTarget = false;

    return {
        name: 'Sniper Bot',
        create: function (robotSetup) {
            gameContext = GameContextHolder.gameContext;

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.Two;
            //hullSetup.hullColor = RobotHullColors.Brown;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.Three;
            // turretSetup.turretColor = RobotTurretColors.Blue;
        },
        onSpawned: function (api, time_seconds) {
            const radar = api.radar;
            radar.radarFollowTurret = true;
            radar.setFOVAngle_degrees(15);
        },
        update: function (api, time_seconds, delta_seconds) {
            const radar = api.radar;
            const scannedAliveRobots = radar.scannedAliveRobots;

            if (scannedAliveRobots.length > 0) {
                const closestRobot = scannedAliveRobots[0];
                targetPositionX = closestRobot.positionX;
                targetPositionY = closestRobot.positionY;
                hasTarget = true;
            } else {
                hasTarget = false;
            }

            const turret = api.turret;
            if (hasTarget) {
                turret.rotateTowardsPosition(targetPositionX, targetPositionY);

                const currentPosition = new Phaser.Math.Vector2(api.data.positionX, api.data.positionY);
                const targetPosition = new Phaser.Math.Vector2(targetPositionX, targetPositionY);
                const distanceToTarget = currentPosition.distance(targetPosition);

                if (distanceToTarget > preferredDistance) {
                    api.move();
                } else if (distanceToTarget < preferredDistance) {
                    api.reverse();
                }

                if (time_seconds - lastFiredTimeSeconds > fireDelaySeconds) {
                    if (turret.rotateTowardsPosition(targetPositionX, targetPositionY)) {
                        api.fire(ProjectileTypes.Light);
                        lastFiredTimeSeconds = time_seconds;
                    }
                }
            } else {
                api.rotateRight();
                turret.rotateRight();
            }
        }
    };
};


// chat-gpt
const CornerGuardBot = function() {
    let gameContext;

    const cornerOffset = 50;
    const corners = [
        { x: cornerOffset, y: cornerOffset }, // Top-left corner
        { x: 1024 - cornerOffset, y: cornerOffset }, // Top-right corner
        { x: cornerOffset, y: 1024 - cornerOffset }, // Bottom-left corner
        { x: 1024 - cornerOffset, y: 1024 - cornerOffset } // Bottom-right corner
    ];
    const cornerPosition = corners[Math.floor(Math.random() * corners.length)];
    let targetPositionX = 0;
    let targetPositionY = 0;
    let hasTarget = false;

    let lastPositionX = 0;
    let lastPositionY = 0;
    let stuckCheckIntervalSeconds = 1;
    let lastStuckCheckTimeSeconds = 0;
    let isStuck = false;
    let stuckRotationTimeSeconds = 0.5;
    let unstuckStartTimeSeconds = 0;

    function moveToCorner(api) {
        const isNearCorner = Math.abs(api.data.positionX - cornerPosition.x) < 10 && Math.abs(api.data.positionY - cornerPosition.y) < 10;
        if (!isNearCorner) {
            // Calculate angle between bot and corner position
            let targetAngle = Math.atan2(cornerPosition.y - api.data.positionY, cornerPosition.x - api.data.positionX) * (180 / Math.PI);
            if (targetAngle < 0) targetAngle += 360; // Normalizing to 0-360

            // Calculate the difference between current and target angle
            let currentAngle = api.data.angle_degrees;
            let angleDiff = targetAngle - currentAngle;
            if (angleDiff < 0) angleDiff += 360; // Normalizing to 0-360

            // Rotate bot towards the corner based on the difference
            if (angleDiff < 180) {
                api.rotateRight();
            } else {
                api.rotateLeft();
            }

            api.move();
        } 
    }
    function checkIfStuck(api, time_seconds) {
        if (time_seconds - lastStuckCheckTimeSeconds > stuckCheckIntervalSeconds) {
            const distanceMoved = Math.sqrt(Math.pow(api.data.positionX - lastPositionX, 2) + Math.pow(api.data.positionY - lastPositionY, 2));
            isStuck = distanceMoved < 5;

            lastPositionX = api.data.positionX;
            lastPositionY = api.data.positionY;
            lastStuckCheckTimeSeconds = time_seconds;
        }
    }

    function getUnstuck(api, time_seconds) {
        if (time_seconds - unstuckStartTimeSeconds < stuckRotationTimeSeconds) {
            api.rotateRight();
            api.move();
        } else {
            isStuck = false;
        }
    }

function sweepRadar(api) {
    const radar = api.radar;
    const turret = api.turret;

    if (radar.radarFollowTurret) {

        // Calculate the angle for the turret to rotate
        let minAngle = Math.atan2(cornerPosition.y - api.data.positionY, cornerPosition.x - api.data.positionX) * (180 / Math.PI);
        minAngle = (minAngle + 90) % 360;
        const maxAngle = (minAngle + 90) % 360; // The turret should rotate within a 90 degree angle
        const currentTurretAngle = turret.angle_degrees;

        // Make sure the turret rotation stays within the 90 degree angle
        if ((minAngle <= maxAngle && currentTurretAngle >= minAngle && currentTurretAngle <= maxAngle) || 
            (minAngle > maxAngle && (currentTurretAngle >= minAngle || currentTurretAngle <= maxAngle))) {
            turret.rotateRight();
        } else {
            turret.rotateLeft();
        }
    }
}

    return {
        name: 'Corner Guard Bot',
        create: function(robotSetup) {
            gameContext = GameContextHolder.gameContext;

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.Four;
            //hullSetup.hullColor = RobotHullColors.Green;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.Six;
            // turretSetup.turretColor = RobotTurretColors.Blue;
        },
        onSpawned: function(api, time_seconds) {
            const radar = api.radar;
            radar.radarFollowTurret = true;
            // radar.setFOVAngle_degrees(45);
            radar.setFOVAngle_degrees(5);
        },
        update: function(api, time_seconds, delta_seconds) {
            checkIfStuck(api, time_seconds);
            if (isStuck) {
                getUnstuck(api, time_seconds);
            } else {
                moveToCorner(api);
            }

            sweepRadar(api);

            const radar = api.radar;
            const scannedAliveRobots = radar.scannedAliveRobots;

            if (scannedAliveRobots.length > 0) {
                const closestRobot = scannedAliveRobots[0];
                targetPositionX = closestRobot.positionX;
                targetPositionY = closestRobot.positionY;
                hasTarget = true;
            } else {
                hasTarget = false;
            }

            const turret = api.turret;
            if (hasTarget) {
                if (turret.rotateTowardsPosition(targetPositionX, targetPositionY)) {
                    api.fire(ProjectileTypes.Medium);
                }
            } else {
                //turret.rotateLeft();
            }
        }
    };
};

const StealthBot = function() {
    let gameContext;

    const fireDelaySeconds = 0.5;
    let lastFiredTimeSeconds = 0;
    let targetPositionX = 0;
    let targetPositionY = 0;
    let hasTarget = false;

    const movePatternChangeIntervalSeconds = 0.3;
    const movePatternDurationSeconds = 1;
    let currentMovePatternTimeSeconds = 0;
    let currentMovePattern = 0; // 0: Move forward, 1: Move backward, 2: Rotate left, 3: Rotate right, 4: Zigzag

    let zigzagDirection = true;

    function updateMovePattern(delta_seconds) {
        if (currentMovePatternTimeSeconds <= 0) {
            currentMovePattern = Math.floor(Math.random() * 5);
            currentMovePatternTimeSeconds = movePatternChangeIntervalSeconds;
        } else {
            currentMovePatternTimeSeconds -= delta_seconds;
        }
    }

    function moveTowardsPosition(api, positionX, positionY) {
        const dx = positionX - api.data.positionX;
        const dy = positionY - api.data.positionY;
        const angleToTarget = Math.atan2(dy, dx) * 180 / Math.PI;
        api.rotateTowardsAngle_degrees(angleToTarget);
        api.move();
    }

    function moveStealthily(api) {
        if (hasTarget) {
            moveTowardsPosition(api, targetPositionX, targetPositionY);
            return;
        }

        switch (currentMovePattern) {
            case 0:
                api.move();
                break;
            case 1:
                api.reverse();
                break;
            case 2:
                api.rotateLeft();
                break;
            case 3:
                api.rotateRight();
                break;
            case 4:
                zigzag(api);
                break;
        }
    }

    function zigzag(api) {
        if (zigzagDirection) {
            api.rotateLeft();
        } else {
            api.rotateRight();
        }

        api.move();

        if (Math.random() < 0.1) {
            zigzagDirection = !zigzagDirection;
        }
    }

    function isTargetInRange(api) {
        const distanceToTarget = Math.sqrt(Math.pow(targetPositionX - api.data.positionX, 2) + Math.pow(targetPositionY - api.data.positionY, 2));
        return distanceToTarget <= 300;
    }

    return {
        name: 'Stealth Bot',
        create: function(robotSetup) {
            gameContext = GameContextHolder.gameContext;

            const hullSetup = robotSetup.hull;
            hullSetup.hullType = RobotHullTypes.Two;
            //hullSetup.hullColor = RobotHullColors.Green;

            const turretSetup = robotSetup.turret;
            turretSetup.turretType = RobotTurretTypes.Four;
            // turretSetup.turretColor = RobotTurretColors.Blue;
        },
        onSpawned: function(api, time_seconds) {
            const radar = api.radar;
            radar.radarFollowTurret = true;
            radar.setFOVAngle_degrees(90);
        },
        update: function(api, time_seconds, delta_seconds) {
            updateMovePattern(delta_seconds);
            moveStealthily(api);

            const radar = api.radar;
            const scannedAliveRobots = radar.scannedAliveRobots;

            if (scannedAliveRobots.length > 0) {
                const closestRobot = scannedAliveRobots[0];
                targetPositionX = closestRobot.positionX;
                targetPositionY = closestRobot.positionY;
                hasTarget = true;
            } else {
                hasTarget = false;
            }

            const turret = api.turret;
            if (hasTarget) {
                turret.rotateTowardsPosition(targetPositionX, targetPositionY);

                if (isTargetInRange(api) && time_seconds - lastFiredTimeSeconds > fireDelaySeconds) {
                    if (turret.rotateTowardsPosition(targetPositionX, targetPositionY)) {
                        api.fire(ProjectileTypes.Medium);
                        lastFiredTimeSeconds = time_seconds;
                    }
                }
            } else {
                turret.rotateLeft();
            }
        }
    };
};
