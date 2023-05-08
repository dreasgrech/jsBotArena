"use strict";

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
    rotateTowardsPosition: 0
});

/**
 * @type {{
    RotateLeft: number,
    RotateRight: number,
    RotateTowardsAngle_degrees: number,
    rotateTowardsPosition: number,
}}
 */
const RobotTurret_ActionType = BitmaskableObjectOperations.populateBitmaskableObject({
    RotateLeft: 0,
    RotateRight: 0,
    RotateTowardsAngle_degrees: 0,
    rotateTowardsPosition: 0
});

/**
 * @type {{
    RotateLeft: number,
    RotateRight: number,
}}
 */
const RobotRadar_ActionType = BitmaskableObjectOperations.populateBitmaskableObject({
    RotateLeft: 0,
    RotateRight: 0
});
