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
                    rotateRight: function() {
                        RobotManager.rotateTurret(robotIndex, 1);
                    },
                    rotateLeft: function() {
                        RobotManager.rotateTurret(robotIndex, -1);
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
                scannedRobots: []
                /*
                 * TODO:
                 *      Rename collisionsThisFrame to collisionsWithRobots
                 *      Add collisionsWithArena:[] contains info about collisions with arena walls and obstacles
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
