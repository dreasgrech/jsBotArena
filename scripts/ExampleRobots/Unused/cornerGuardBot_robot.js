/*
"use strict";

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
            gameContext = GameContextHolder.scene;

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
*/