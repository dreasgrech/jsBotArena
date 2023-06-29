"use strict";

/**
 * @type {{
    RobotBody: number,
    Arena: number,
    Arena_Water: number,
    RobotProjectile: number,
    RobotProjectileSensor: number
}}
 */
const CollisionCategories = BitmaskableObjectOperations.populateBitmaskableObject({
    RobotBody: 0,
    Arena: 0,
    Arena_Water: 0,
    RobotProjectile: 0,
    RobotProjectileSensor: 0
});

/**
 * Holds the collision categories which each collision-category collides with
 */
const CollisionCategoriesCollidesWith = {};
CollisionCategoriesCollidesWith[CollisionCategories.RobotBody] = CollisionCategories.RobotBody | CollisionCategories.Arena | CollisionCategories.Arena_Water;
CollisionCategoriesCollidesWith[CollisionCategories.Arena] = CollisionCategories.RobotBody | CollisionCategories.RobotProjectile;
CollisionCategoriesCollidesWith[CollisionCategories.Arena_Water] = CollisionCategories.RobotBody;
CollisionCategoriesCollidesWith[CollisionCategories.RobotProjectile] = CollisionCategories.RobotProjectileSensor | CollisionCategories.Arena | CollisionCategories.RobotProjectile;
CollisionCategoriesCollidesWith[CollisionCategories.RobotProjectileSensor] = CollisionCategories.RobotProjectile;

/**
 * These fields must match the Enum custom property defined in the Tiled project
 * @type {{
 * Nothing: number,
 * GenericWall: number, 
 * GenericFloor: number,
 * Water: number
 * }}
 */
const TileTypes = EnumHelpers.createEnumWithNumberValues([
    'Nothing',
    'GenericWall',
    'GenericFloor',
    'Water'
]);

/**
 * Holds the collision categories for each tile type
 */
const TileTypesCollisionCategories = {};
TileTypesCollisionCategories[TileTypes.GenericWall] = CollisionCategories.Arena;
TileTypesCollisionCategories[TileTypes.GenericFloor] = 0;
TileTypesCollisionCategories[TileTypes.Water] = CollisionCategories.Arena_Water;
