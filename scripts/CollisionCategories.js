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
    Arena: 0,
    RobotProjectile: 0,
    RobotProjectileSensor: 0
});

/**
 * Holds the collision categories which each collision-category collides with
 */
const CollisionCategoriesCollidesWith = {};
CollisionCategoriesCollidesWith[CollisionCategories.RobotBody] = CollisionCategories.RobotBody | CollisionCategories.Arena;
CollisionCategoriesCollidesWith[CollisionCategories.Arena] = CollisionCategories.RobotBody | CollisionCategories.RobotProjectile;
CollisionCategoriesCollidesWith[CollisionCategories.RobotProjectile] = CollisionCategories.RobotProjectileSensor | CollisionCategories.Arena | CollisionCategories.RobotProjectile;
CollisionCategoriesCollidesWith[CollisionCategories.RobotProjectileSensor] = CollisionCategories.RobotProjectile;

console.log(CollisionCategoriesCollidesWith);
