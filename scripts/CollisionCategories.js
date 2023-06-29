"use strict";

/**
 * @type {{
    RobotBody: number,
    Arena: number,
    ArenaWater: number,
    RobotProjectile: number,
    RobotProjectileSensor: number
}}
 */
const CollisionCategories = BitmaskableObjectOperations.populateBitmaskableObject({
    RobotBody: 0,
    Arena: 0,
    ArenaWater: 0,
    RobotProjectile: 0,
    RobotProjectileSensor: 0
});

/**
 * Holds the collision categories which each collision-category collides with
 */
const CollisionCategoriesCollidesWith = {};
CollisionCategoriesCollidesWith[CollisionCategories.RobotBody] = CollisionCategories.RobotBody | CollisionCategories.Arena | CollisionCategories.ArenaWater;
CollisionCategoriesCollidesWith[CollisionCategories.Arena] = CollisionCategories.RobotBody | CollisionCategories.RobotProjectile;
CollisionCategoriesCollidesWith[CollisionCategories.ArenaWater] = CollisionCategories.RobotBody;
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
TileTypesCollisionCategories[TileTypes.GenericFloor] = 0; // GenericFloor doesn't require a collision category because it doesn't collide with anything
TileTypesCollisionCategories[TileTypes.Water] = CollisionCategories.ArenaWater;

// todo: need a new object for mapping which collision categories robots can see through with the radar