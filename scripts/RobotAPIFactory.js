"use strict";

/*
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
                    const operationType = RobotHull_ActionType.Move;
                    const operationsState = RobotsDataAPI_FrameOperations_Hull[robotIndex];
                    if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                        Logger.warn("Already called move() this frame");
                        return;
                    }

                    RobotOperations_Hull.moveHull(robotIndex, 1);

                    RobotsDataAPI_FrameOperations_Hull[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);
                },
                reverse: function() {
                    const operationType = RobotHull_ActionType.Reverse;
                    const operationsState = RobotsDataAPI_FrameOperations_Hull[robotIndex];
                    if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                        Logger.warn("Already called reverse() this frame");
                        return;
                    }

                    RobotOperations_Hull.moveHull(robotIndex, -1);

                    RobotsDataAPI_FrameOperations_Hull[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);
                },
                rotateLeft: function() {
                    const operationType = RobotHull_ActionType.RotateLeft;
                    const operationsState = RobotsDataAPI_FrameOperations_Hull[robotIndex];
                    if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                        Logger.warn("Already called rotateLeft() this frame");
                        return;
                    }

                    RobotOperations_Hull.rotateHull(robotIndex, -1);

                    RobotsDataAPI_FrameOperations_Hull[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);
                },
                rotateRight: function() {
                    const operationType = RobotHull_ActionType.RotateRight;
                    const operationsState = RobotsDataAPI_FrameOperations_Hull[robotIndex];
                    if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                        Logger.warn("Already called rotateRight() this frame");
                        return;
                    }

                    RobotOperations_Hull.rotateHull(robotIndex, 1);

                    RobotsDataAPI_FrameOperations_Hull[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);
                },
                // returns true if we're at the requested angle
                rotateTowardsAngle_degrees: function(angle_degrees) {
                    const operationType = RobotHull_ActionType.RotateTowardsAngle_degrees;
                    const operationsState = RobotsDataAPI_FrameOperations_Hull[robotIndex];
                    if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                        Logger.warn("Already called rotateTowardsAngle_degrees() this frame");
                        return null; // TODO: Should we store a cache of return values returned this frame so we return that instead of null?
                    }

                    RobotsDataAPI_FrameOperations_Hull[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);

                    return RobotOperations_Hull.rotateHullTowardsAngle_degrees(robotIndex, angle_degrees);
                },
                // returns true if we're at the requested angle
                rotateTowardsPosition: function(positionX, positionY) {
                    const operationType = RobotHull_ActionType.rotateTowardsPosition;
                    const operationsState = RobotsDataAPI_FrameOperations_Hull[robotIndex];
                    if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                        Logger.warn("Already called rotateTowardsPosition() this frame");
                        return null; // TODO: Should we store a cache of return values returned this frame so we return that instead of null?
                    }

                    RobotsDataAPI_FrameOperations_Hull[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);
                    return RobotOperations_Hull.rotateHullTowardsPosition(robotIndex, positionX, positionY);
                },
                turret: {
                    turretFollowHull: false,
                    rotateLeft: function() {
                        const operationType = RobotTurret_ActionType.RotateLeft;
                        const operationsState = RobotsDataAPI_FrameOperations_Turret[robotIndex];
                        if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                            Logger.warn("Already called rotateLeft() this frame");
                            return;
                        }

                        RobotOperations_Turret.rotateTurret(robotIndex, -1);

                        RobotsDataAPI_FrameOperations_Turret[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);
                    },
                    rotateRight: function() {
                        const operationType = RobotTurret_ActionType.RotateRight;
                        const operationsState = RobotsDataAPI_FrameOperations_Turret[robotIndex];
                        if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                            Logger.warn("Already called rotateRight() this frame");
                            return;
                        }

                        RobotOperations_Turret.rotateTurret(robotIndex, 1);

                        RobotsDataAPI_FrameOperations_Turret[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);
                    },
                    // returns true if we're at the requested angle
                    rotateTowardsAngle_degrees: function(angle_degrees) {
                        const operationType = RobotTurret_ActionType.RotateTowardsAngle_degrees;
                        const operationsState = RobotsDataAPI_FrameOperations_Turret[robotIndex];
                        if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                            Logger.warn("Already called rotateTowardsAngle_degrees() this frame");
                            return null; // TODO: Should we store a cache of return values returned this frame so we return that instead of null?
                        }

                        RobotsDataAPI_FrameOperations_Turret[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);

                        return RobotOperations_Turret.rotateTurretTowardsAngle_degrees(robotIndex, angle_degrees);
                    },
                    // returns true if we're at the requested angle
                    rotateTowardsPosition: function(positionX, positionY) {
                        const operationType = RobotTurret_ActionType.rotateTowardsPosition;
                        const operationsState = RobotsDataAPI_FrameOperations_Turret[robotIndex];
                        if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                            Logger.warn("Already called rotateTowardsPosition() this frame");
                            return null; // TODO: Should we store a cache of return values returned this frame so we return that instead of null?
                        }

                        RobotsDataAPI_FrameOperations_Turret[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);

                        return RobotOperations_Turret.rotateTurretTowardsPosition(robotIndex, positionX, positionY);
                    }
                },
                radar: {
                    // If set to false, then radar scanning is disabled
                    radarEnabled: true,
                    // If set to true, the radar will be locked to the turret and will rotate with it.
                    radarFollowTurret: false,
                    // The scanned robots that are alive
                    scannedAliveRobots: [], // RobotScannedInfo[]
                    // The FOV angle can be between 1 and 45
                    setFOVAngle_degrees: function(angle_degrees) {
                        return RobotsRadar.setRadarFOVAngle_degrees(robotIndex, angle_degrees);
                    },
                    rotateLeft: function() {
                        const operationType = RobotRadar_ActionType.RotateLeft;
                        const operationsState = RobotsDataAPI_FrameOperations_Radar[robotIndex];
                        if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                            Logger.warn("Already called rotateTowardsPosition() this frame");
                            return;
                        }

                        RobotsRadar.rotateRadar(robotIndex, -1);

                        RobotsDataAPI_FrameOperations_Radar[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);
                    },
                    rotateRight: function() {
                        const operationType = RobotRadar_ActionType.RotateRight;
                        const operationsState = RobotsDataAPI_FrameOperations_Radar[robotIndex];
                        if (BitmaskableObjectOperations.has(operationsState, operationType)) {
                            Logger.warn("Already called rotateTowardsPosition() this frame");
                            return;
                        }

                        RobotsRadar.rotateRadar(robotIndex, 1);

                        RobotsDataAPI_FrameOperations_Radar[robotIndex] = BitmaskableObjectOperations.add(operationsState, operationType);
                    }
                },
                // returns true if the projectile was fired
                fire: function(projectileType) {
                    return ProjectileManager.fireRobotProjectile(robotIndex, projectileType);
                },
                // Collisions this frame
                collisions: {
                    otherRobots: [], // type: RobotToRobotCollisionInfo[]
                    arena: [], // type: RobotToArenaCollisionInfo[]
                    projectiles: [] // type: RobotToProjectileCollisionInfo[]
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
    };
};

const RobotToProjectileCollisionInfo = function() {
    return {
        positionX: 0, // the x-position of the projectile
        positionY: 0, // the y-position of the projectile
        angle_degrees: 0, // the angle in degrees of the projectile
        bearing_degrees: 0, // the angle in degrees that the robot needs to rotate to to face the projectile
        damageApplied: 0 // the total damage applied
    };
};

const RobotScannedInfo = function() {
    return {
        index: 0, // the scanned robot's index
        distanceBetweenRobots: 0, // the distance between the scanning robot and the scanned robot
        positionX: 0, // the x-position of the scanned robot
        positionY: 0, // the y-position of the scanned robot
        angle_degrees: 0, // the angle in degrees of the scanned robot
        bearing_degrees: 0, // the angle in degrees that the scanning robot needs to rotate to to face the scanned robot
        turret_angle: 0, // the angle in degrees of the scanned robot's turret
        radar_angle: 0, // the angle in degrees of the scanned robot's radar
        alive: false // true if the scanned robot is not destroyed
    }
};
