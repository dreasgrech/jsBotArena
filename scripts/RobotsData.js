"use strict";

// Physics bodies
const RobotsData_PhysicsBodies_robotHullGameObjects = [];
const RobotsData_PhysicsBodies_robotHullMatterBodies = [];
const RobotsData_PhysicsBodies_robotHullMatterBodyIDs = [];
const RobotsData_PhysicsBodies_robotTurretGameObjects = [];
const RobotsData_PhysicsBodies_robotProjectileSensorBodies = [];
const RobotsData_PhysicsBodies_robotProjectileSensorConstraints = [];

// Data that is updated per frame or on a frequent basis
const RobotsData_CurrentData_positionXs = [];
const RobotsData_CurrentData_positionYs = [];
const RobotsData_CurrentData_turretPositions = [];
const RobotsData_CurrentData_currentRobotAngles_degrees = [];
const RobotsData_CurrentData_currentRobotAngles_radians = [];
const RobotsData_CurrentData_currentRobotVelocities = [];
const RobotsData_CurrentData_currentRobotSpeedSqr = [];
const RobotsData_CurrentData_currentTurretAngles = [];
const RobotsData_CurrentData_currentRadarAngles_degrees = [];
const RobotsData_CurrentData_currentRadarAngles_radians = [];
const RobotsData_CurrentData_robotCollisions = []; // [[{,,}], [{,,}], [{,,}]]
const RobotsData_CurrentData_arenaCollisions = []; // [[{,,}], [{,,}], [{,,}]]
const RobotsData_CurrentData_projectileCollisions = []; // [[{,,}], [{,,}], [{,,}]]
const RobotsData_CurrentData_health = [];
const RobotsData_CurrentData_alive = [];
//const RobotsData_CurrentData_getPosition = function(index) {
//    return new Phaser.Math.Vector2(RobotsData_CurrentData_positionXs[index], RobotsData_CurrentData_positionYs[index]);
//};

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
const RobotsDataAPI_FrameOperations_Hull = [];
const RobotsDataAPI_FrameOperations_Turret = [];
const RobotsDataAPI_FrameOperations_Radar = [];
