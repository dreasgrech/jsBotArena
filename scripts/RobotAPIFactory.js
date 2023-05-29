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
                /**
                 * Moves the robot forward in the direction it's currently facing.
                 */
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
                /**
                 * Moves the robot backwards in the direction it's currently facing.
                 */
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
                /**
                 * Rotates the robot to the left.
                 */
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
                /**
                 * Rotates the robot to the right.
                 */
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
                /**
                 * Rotates the robot towards the specified angle (degrees).
                 * Returns true if we're at the requested angle.
                 * @param {number} angle_degrees
                 * @returns {boolean}
                 */
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
                /**
                 * Returns true if we're at the requested angle.
                 * @param {number} positionX
                 * @param {number} positionY
                 * @returns {boolean}
                 */
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
                /**
                 * Operations involving the hull.
                 */
                turret: {
                    /**
                     * If set to true, the turret's rotation will be locked to the rotation of the hull.
                     */
                    turretFollowHull: false,
                    /**
                     * Rotates the turret to the left.
                     */
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
                    /**
                     * Rotates the turret to the right.
                     */
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
                    /**
                     * Rotates the turret towards the specified angle.
                     * Returns true if we're at the requested angle.
                     * @param {number} angle_degrees
                     * @returns {boolean}
                     */
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
                    // 
                    /**
                     * Rotates the turret towards the specified absolute world position.
                     * Returns true if we're at the requested angle.
                     * @param {number} positionX
                     * @param {number} positionY
                     * @returns {boolean}
                     */
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
                /**
                 * Data and Operations involving the radar
                 */
                radar: {
                    /**
                     * If set to false, then radar scanning is disabled.
                     */
                    radarEnabled: true,
                    /**
                     * If set to true, the radar will be locked to the turret and will rotate with it.
                     */
                    radarFollowTurret: false,
                    /**
                     * The scanned robots that are alive.
                     * @type {RobotScannedInfo[]}
                     */
                    scannedAliveRobots: [], 
                    /**
                     * The scanned arena obstacles.
                     * @type {ArenaObstacleScannedInfo[]}
                     */
                    scannedArenaElements: [], 
                    // 
                    /**
                     * The FOV angle can be between 1 and 45.
                     * @param {number} angle_degrees
                     * @returns {number}
                     */
                    setFOVAngle_degrees: function(angle_degrees) {
                        return RobotsRadar.setRadarFOVAngle_degrees(robotIndex, angle_degrees);
                    },
                    /**
                     * Rotates the radar to the left
                     */
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
                    /**
                     * Rotates the radar to the right
                     */
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
                /**
                 * Fires a projectile.
                 * Returns true if the projectile was fired.
                 * @param {ProjectileTypes} projectileType
                 * @returns {boolean}
                 */
                fire: function(projectileType) {
                    return ProjectileManager.fireRobotProjectile(robotIndex, projectileType);
                },
                /**
                 * Data about the collisions that have occurred this frame
                 */
                collisions: {
                    /**
                     * Data about the robots that we collided with this frame
                     * @type {RobotToRobotCollisionInfo[]}
                     */
                    otherRobots: [],
                    /**
                     * Data about the arena obstacles that we collided with this frame
                     * @type {RobotToArenaCollisionInfo[]}
                     */
                    arena: [],
                    /**
                     * Data about the projectiles that we collided with this frame
                     * @type {RobotToProjectileCollisionInfo[]}
                     */
                    projectiles: []
                },
                /**
                 * Data about our own robot
                 */
                data: {
                    /**
                     * The robot's current absolute world x-position
                     */
                    positionX: 0,
                    /**
                     * The robot's current absolute world y-position
                     */
                    positionY: 0,
                    /**
                     * The robot's current angle (degrees)
                     */
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

/**
 * Data about a Robot to Arena Obstacle collision
 */
const RobotToRobotCollisionInfo = function () {
    return {
        /** The type of collision */
        type: 0,
        data: {
            /** The index of the other robot involved in the collision */
            robotIndex: 0,
            /** The name of the other robot involved in the collision */
            name: 0,
            /** The angle of the other robot involved in the collision */
            angle: 0,
            /** The velocity of the other robot involved in the collision */
            velocity: 0,
            /** The x-position of the other robot involved in the collision */
            positionX: 0,
            /** The y-position of the other robot involved in the collision */
            positionY: 0
        }
    };
};
/**
 * Data about a Robot to Arena Obstacle collision
 */
const RobotToArenaCollisionInfo = function() {
    return {
        type: 0,
    };
};

/**
 * Data about a Robot to Projectile collision
 */
const RobotToProjectileCollisionInfo = function() {
    return {
        /** The x-position of the projectile */
        positionX: 0,
        /** The y-position of the projectile */
        positionY: 0, 
        /** The angle in degrees of the projectile */
        angle_degrees: 0, 
        /** The angle in degrees that the robot needs to rotate to to face the projectile */
        bearing_degrees: 0,
        /** The total damage applied */
        damageApplied: 0 
    };
};

/**
 * Data about a robot scanned by the radar
 */
const RobotScannedInfo = function () {
    return {
        /** The scanned robot's index */
        index: 0,
        /** The distance between the scanning robot and the scanned robot */
        distance: 0,
        /** The x-position of the scanned robot */
        positionX: 0,
        /** The y-position of the scanned robot */
        positionY: 0,
        /** The angle in degrees of the scanned robot */
        angle_degrees: 0,
        /** The angle in degrees that the scanning robot needs to rotate to face the scanned robot */
        bearing_degrees: 0,
        /** The angle in degrees of the scanned robot's turret */
        turret_angle: 0,
        /** The angle in degrees of the scanned robot's radar */
        radar_angle: 0
    }
};

/**
 * Data about an arena obstacle scanned by the radar
 */
const ArenaObstacleScannedInfo = function () {
    return {
        /** The scanned obstacle's index */
        index: 0,
        /** The distance between the scanning robot and the scanned arena obstacle */
        distance: 0,
        /** The x-position of the scanned arena obstacle */
        positionX: 0,
        /** The y-position of the scanned arena obstacle */
        positionY: 0,
        /** The angle in degrees that the scanning robot needs to rotate to face the scanned arena obstacle */
        bearing_degrees: 0
    }
};