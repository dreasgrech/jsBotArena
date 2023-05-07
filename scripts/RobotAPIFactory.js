"use strict";

/*
 * INFORMATION TO WRITE BOTS
 *
 * Game Width: 1024
 * Game Height: 1024
 *
 * RobotHullTypes:
 *  One
 *  Two
 *  Three
 *  Four
 *  Five
 *  Six
 *  Seven
 *  Eight
 *
 * RobotHullColors:
 *  Brown
 *  Green
 *  Aqua
 *  Blue
 *
 * RobotTurretTypes:
 *  One
 *  Two
 *  Three
 *  Four
 *  Five
 *  Six
 *  Seven
 *  Eight
 *
 * RobotTurretColors:
 *  Brown
 *  Green
 *  Aqua
 *  Blue
 *
 * ProjectileTypes:
 *  Light
 *  Medium
 *  Heavy
 *  Granade
 *  Shotgun
 *
 * The robots spawn at angle 0 (degrees) facing the right.
 * (0,0) is the top-left of the screen.
 * Increasing position x goes right.
 * Increasing position y goes down.
 *
 */

const RobotAPIFactory = (function() {
    const createAPI = function(robotIndex) {
        return (function() {

            const api = {
                move: function() {
                    RobotOperations_Hull.moveHull(robotIndex, 1);
                },
                reverse: function() {
                    RobotOperations_Hull.moveHull(robotIndex, -1);
                },
                rotateLeft: function() {
                    RobotOperations_Hull.rotateHull(robotIndex, -1);
                },
                rotateRight: function() {
                    RobotOperations_Hull.rotateHull(robotIndex, 1);
                },
                rotateTowardsAngle_degrees: function(angle_degrees) {
                    return RobotOperations_Hull.rotateHullTowardsAngle_degrees(robotIndex, angle_degrees);
                },
                rotateTowardsPosition: function(positionX, positionY) {
                    return RobotOperations_Hull.rotateHullTowardsPosition(robotIndex, positionX, positionY);
                },
                turret: {
                    turretFollowHull: false,
                    rotateLeft: function() {
                        RobotOperations_Turret.rotateTurret(robotIndex, -1);
                    },
                    rotateRight: function() {
                        RobotOperations_Turret.rotateTurret(robotIndex, 1);
                    },
                    rotateTowardsAngle_degrees: function(angle_degrees) {
                        return RobotOperations_Turret.rotateTurretTowardsAngle_degrees(robotIndex, angle_degrees);
                    },
                    rotateTowardsPosition: function(positionX, positionY) {
                        return RobotOperations_Turret.rotateTurretTowardsPosition(robotIndex, positionX, positionY);
                    },
                },
                radar: {
                    radarEnabled: true,
                    radarFollowTurret: false,
                    scannedRobots: [], // All the robots that are scanned, including destroyed ones
                    scannedAliveRobots: [], // The scanned robots that are alive
                    setFOVAngle_degrees: function(angle_degrees) {
                        return RobotsRadar.setRadarFOVAngle_degrees(robotIndex, angle_degrees);
                    },
                    rotateLeft: function() {
                        RobotsRadar.rotateRadar(robotIndex, -1);
                    },
                    rotateRight: function() {
                        RobotsRadar.rotateRadar(robotIndex, 1);
                    },
                },
                fire: function(projectileType) {
                    return ProjectileManager.fireRobotProjectile(robotIndex, projectileType);
                },
                // Collisions this frame
                collisions: {
                    otherRobots: [], // type: RobotToRobotCollisionInfo[]
                    arena: [], // type: RobotToArenaCollisionInfo[]
                },
                // Own robot's data
                data: { 
                    positionX: 0,
                    positionY: 0,
                    angle_degrees: 0
                }
            };

            return api;
        }(robotIndex));
    };

    return {
        createAPI: createAPI
    };
}());

const RobotToRobotCollisionInfo = function() {
    return {
        type: 0,
        data: {
            robotIndex: 0,
            name: 0,
            angle: 0,
            velocity: 0,
            positionX: 0,
            positionY: 0,
        }
    };
};

const RobotToArenaCollisionInfo = function() {
    return {
        type: 0,
        data: { }
    };
}
