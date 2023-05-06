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
                rotateTowards: function(angle_degrees) {
                    return RobotManager.rotateHullTowards(robotIndex, angle_degrees);
                },
                turret: {
                    turretFollowHull: false,
                    rotateLeft: function() {
                        RobotManager.rotateTurret(robotIndex, -1);
                    },
                    rotateRight: function() {
                        RobotManager.rotateTurret(robotIndex, 1);
                    },
                    rotateTowards: function(angle_degrees) {
                        return RobotManager.rotateTurretTowards(robotIndex, angle_degrees);
                    },
                },
                radar: {
                    radarEnabled: true,
                    radarFollowTurret: false,
                    scannedRobots: [], // All the robots that are scanned, including destroyed ones
                    scannedAliveRobots: [], // The scanned robots that are alive
                    setFOVAngle_degrees: function(angleDegrees) {
                        return RobotsRadar.setRadarFOVAngle_degrees(robotIndex, angleDegrees);
                    },
                    rotateLeft: function() {
                        RobotsRadar.rotateRadar(robotIndex, -1);
                    },
                    rotateRight: function() {
                        RobotsRadar.rotateRadar(robotIndex, 1);
                    },
                },
                fire: function(projectileType) {
                    RobotManager.fire(robotIndex, projectileType);
                },
                collisions: {
                    otherRobots: [],
                    arena: [],
                },
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

