"use strict";

const followBot_followPosition = function() {
    let gameContext;

    let foundFirstBot = false;
    let rotatingTowardsPositionX = 0, rotatingTowardsPositionY = 0;
    let turretRotatingLeft = true;

    return {
        name: 'Follow Bot (Position)',
        create: function(robotSetup) {
            gameContext = GameContextHolder.scene;

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
