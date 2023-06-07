"use strict";

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
            gameContext = GameContextHolder.scene;

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
