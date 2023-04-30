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
                turret: {
                    rotateLeft: function() {
                        RobotManager.rotateTurret(robotIndex, -1);
                    },
                    rotateRight: function() {
                        RobotManager.rotateTurret(robotIndex, 1);
                    }
                },
                radar: {
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
                turretFollowHull: false,
                radarEnabled: true,
                /*
                 * TODO:
                 *      Add scannedArena:[] contains info about scanned arena walls and obstacles
                 */
            };

            return api;
        }(robotIndex));
    };

    return {
        createAPI: createAPI
    };
}());
