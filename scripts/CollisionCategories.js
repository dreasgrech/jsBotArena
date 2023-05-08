"use strict";

/**
 * @type {{
    RobotBody: 0,
    RobotTurret: 0,
    Arena: 0,
    RobotProjectile: 0,
    RobotProjectileSensor: 0
}}
 */
const CollisionCategories = JSObjectOperations.populateBitmaskableObject({
    RobotBody: 0,
    RobotTurret: 0,
    Arena: 0,
    RobotProjectile: 0,
    RobotProjectileSensor: 0
});
