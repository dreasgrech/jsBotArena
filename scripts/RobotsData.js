"use strict";

// Physics bodies
const RobotsData_PhysicsBodies_robotHullGameObjects = [];
const RobotsData_PhysicsBodies_robotHullMatterBodies = [];
const RobotsData_PhysicsBodies_robotHullMatterBodyIDs = [];
const RobotsData_PhysicsBodies_robotTurretGameObjects = [];
const RobotsData_PhysicsBodies_robotProjectileSensorBodies = [];
const RobotsData_PhysicsBodies_robotProjectileSensorConstraints = [];

// Data that is updated per frame or on a frequent basis
const RobotsData_CurrentData_positions = [];
const RobotsData_CurrentData_turretPositions = [];
const RobotsData_CurrentData_currentRobotAngles_degrees = [];
const RobotsData_CurrentData_currentRobotAngles_radians = [];
const RobotsData_CurrentData_currentRobotVelocities = [];
const RobotsData_CurrentData_currentRobotSpeedSqr = [];
const RobotsData_CurrentData_currentTurretAngles_degrees = [];
const RobotsData_CurrentData_currentRadarAngles_degrees = [];
const RobotsData_CurrentData_currentRadarAngles_radians = [];
const RobotsData_CurrentData_health = [];
const RobotsData_CurrentData_alive = [];

// Collisions data
const RobotsData_CollisionsThisFrame_robot = []; // [[{,,}], [{,,}], [{,,}]]
const RobotsData_CollisionsThisFrame_arena = []; // [[{,,}], [{,,}], [{,,}]]
const RobotsData_CollisionsThisFrame_projectile = []; // [[{,,}], [{,,}], [{,,}]]

// Robots instance data, doesn't change once created or changes infrequently
const RobotsData_Instance_ids = [];
const RobotsData_Instance_names = [];
const RobotsData_Instance_updateFunctions = [];
const RobotsData_Instance_robotAPIs = [];
const RobotsData_Instance_robotSpeeds = [];
const RobotsData_Instance_hullTurretHoleOffset = [];
const RobotsData_Instance_hullTurretAnchorageIndex = [];
const RobotsData_Instance_hullMatterGroup = [];

// Projectiles data
const ProjectilesData_projectileType = [];

// API-specific data
/**
 * Used to make sure that some of the hull's operations are not used more than once per frame
 * @type {number[]}
 */
const RobotsDataAPI_FrameOperations_Hull = [];
/**
 * Used to make sure that some of the turret's operations are not used more than once per frame
 * @type {number[]}
 */
const RobotsDataAPI_FrameOperations_Turret = [];
/**
 * Used to make sure that some of the radar's operations are not used more than once per frame
 * @type {number[]}
 */
const RobotsDataAPI_FrameOperations_Radar = [];
