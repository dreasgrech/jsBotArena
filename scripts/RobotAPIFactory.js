"use strict";

const RobotAPIFactory = (function() {
    const createAPI = function(robotIndex) {
        // return (function(robotIndex) {
        return (function() {

            const api = {
                move: function() {
                    RobotManager.moveHull(robotIndex, 1);
                },
                reverse: function() {
                    RobotManager.moveHull(robotIndex, -1);
                },
                rotateLeft: function() {
                    RobotManager.rotateHull(robotIndex, -1);
                },
                rotateRight: function() {
                    RobotManager.rotateHull(robotIndex, 1);
                },
                rotateTo: function(angleDegrees) {

                },
                turret: {
                    turretFollowHull: false,
                    rotateLeft: function() {
                        RobotManager.rotateTurret(robotIndex, -1);
                    },
                    rotateRight: function() {
                        RobotManager.rotateTurret(robotIndex, 1);
                    }
                },
                radar: {
                    radarEnabled: true,
                    radarFollowTurret: true,
                    scannedRobots: [],
                    rotateLeft: function() {
                        RobotsRadar.rotateRadar(robotIndex, -1);
                    },
                    rotateRight: function() {
                        RobotsRadar.rotateRadar(robotIndex, 1);
                    },
                },
                fire: function(projectileType) {
                    ProjectileManager.fireRobotProjectile(robotIndex, projectileType);
                },
                collisions: {
                    otherRobots: [],
                    arena: [],
                },
                data: { 
                    positionX: 0,
                    positionY: 0,
                }
            };

            return api;
        }(robotIndex));
    };

    return {
        createAPI: createAPI
    };
}());
