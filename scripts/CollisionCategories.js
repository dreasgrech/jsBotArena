"use strict";

/**
 * @type {{
    RobotBody: number,
    RobotTurret: number,
    Arena: number,
    RobotProjectile: number,
    RobotProjectileSensor: number
}}
 */
const CollisionCategories = BitmaskableObjectOperations.populateBitmaskableObject({
    RobotBody: 0,
    RobotTurret: 0,
    Arena: 0,
    RobotProjectile: 0,
    RobotProjectileSensor: 0
});
