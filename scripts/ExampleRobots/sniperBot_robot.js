"use strict";

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
            gameContext = GameContextHolder.scene;

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
                        api.fire(ProjectileTypes.Medium);
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

