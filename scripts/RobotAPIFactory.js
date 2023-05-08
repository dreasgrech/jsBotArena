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

/**
 * @type {{
    Move: number,
    Reverse: number,
    RotateLeft: number,
    RotateRight: number,
    RotateTowardsAngle_degrees: number,
    rotateTowardsPosition: number,
}}
 */
const RobotHull_ActionType = BitmaskableObjectOperations.populateBitmaskableObject({
    Move: 0,
    Reverse: 0,
    RotateLeft: 0,
    RotateRight: 0,
    RotateTowardsAngle_degrees: 0,
    rotateTowardsPosition: 0,
});

const RobotsDataAPI_FrameOperations_Hull = [];

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
                        RobotOperations_Turret.rotateTurret(robotIndex, -1);
                    },
                    rotateRight: function() {
                        RobotOperations_Turret.rotateTurret(robotIndex, 1);
                    },
                    // returns true if we're at the requested angle
                    rotateTowardsAngle_degrees: function(angle_degrees) {
                        return RobotOperations_Turret.rotateTurretTowardsAngle_degrees(robotIndex, angle_degrees);
                    },
                    // returns true if we're at the requested angle
                    rotateTowardsPosition: function(positionX, positionY) {
                        return RobotOperations_Turret.rotateTurretTowardsPosition(robotIndex, positionX, positionY);
                    }
                },
                radar: {
                    // If set to false, then radar scanning is disabled
                    radarEnabled: true, 
                    // If set to true, the radar will be locked to the turret and will rotate with it.
                    radarFollowTurret: false, 
                    // All the robots that are scanned, including destroyed ones
                    scannedRobots: [], // type: RobotScannedInfo[]
                    // The scanned robots that are alive
                    scannedAliveRobots: [], // RobotScannedInfo[]
                    // The FOV angle can be between 1 and 45
                    setFOVAngle_degrees: function(angle_degrees) {
                        return RobotsRadar.setRadarFOVAngle_degrees(robotIndex, angle_degrees);
                    },
                    rotateLeft: function() {
                        RobotsRadar.rotateRadar(robotIndex, -1);
                    },
                    rotateRight: function() {
                        RobotsRadar.rotateRadar(robotIndex, 1);
                    }
                },
                // returns true if the projectile was fired
                fire: function(projectileType) {
                    return ProjectileManager.fireRobotProjectile(robotIndex, projectileType);
                },
                // Collisions this frame
                collisions: {
                    otherRobots: [], // type: RobotToRobotCollisionInfo[]
                    arena: [] // type: RobotToArenaCollisionInfo[]
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
