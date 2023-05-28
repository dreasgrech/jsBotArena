"use strict";

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
