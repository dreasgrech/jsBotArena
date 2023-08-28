"use strict";

// TODO: MOST OF THESE ARRAYS STILL NEED TO BE CLEARED ON LEVEL UNLOAD

// Physics bodies
/**
 *
 * @type {Phaser.Physics.Matter.Sprite[]}
 */
const RobotsData_PhysicsBodies_robotHullGameObjects = [];
/**
 * 
 * @type {Phaser.Physics.Matter.Matter.Body[]}
 */
const RobotsData_PhysicsBodies_robotHullMatterBodies = [];
/**
 * 
 * @type {number[]}
 */
const RobotsData_PhysicsBodies_robotHullMatterBodyIDs = [];
/**
 *
 * @type {Phaser.Physics.Matter.Sprite[]}
 */
const RobotsData_PhysicsBodies_robotTurretGameObjects = [];
// const RobotsData_PhysicsBodies_robotProjectileSensorBodies = [];
// const RobotsData_PhysicsBodies_robotProjectileSensorConstraints = [];

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

const RobotsDataManager = (function() {
    return {
        system_preloadOnce: function() {
            // Create the Tweak pane data
            const dataForTweakPane = {
                get PhysicsBodies_robotHullGameObjects() {
                    return RobotsData_PhysicsBodies_robotHullGameObjects.length;
                },
                get PhysicsBodies_robotHullMatterBodies() {
                    return RobotsData_PhysicsBodies_robotHullMatterBodies.length;
                },
                get PhysicsBodies_robotHullMatterBodyIDs() {
                    return RobotsData_PhysicsBodies_robotHullMatterBodyIDs.length;
                },
                get PhysicsBodies_robotTurretGameObjects() {
                    return RobotsData_PhysicsBodies_robotTurretGameObjects.length;
                },
                get CurrentData_positions() {
                    return RobotsData_CurrentData_positions.length;
                },
                get CurrentData_turretPositions() {
                    return RobotsData_CurrentData_turretPositions.length;
                },
                get CurrentData_currentRobotAngles_degrees() {
                    return RobotsData_CurrentData_currentRobotAngles_degrees.length;
                },
                get CurrentData_currentRobotAngles_radians() {
                    return RobotsData_CurrentData_currentRobotAngles_radians.length;
                },
                get CurrentData_currentRobotVelocities() {
                    return RobotsData_CurrentData_currentRobotVelocities.length;
                },
                get CurrentData_currentRobotSpeedSqr() {
                    return RobotsData_CurrentData_currentRobotSpeedSqr.length;
                },
                get CurrentData_currentTurretAngles_degrees() {
                    return RobotsData_CurrentData_currentTurretAngles_degrees.length;
                },
                get CurrentData_currentRadarAngles_degrees() {
                    return RobotsData_CurrentData_currentRadarAngles_degrees.length;
                },
                get CurrentData_currentRadarAngles_radians() {
                    return RobotsData_CurrentData_currentRadarAngles_radians.length;
                },
                get CurrentData_health() {
                    return RobotsData_CurrentData_health.length;
                },
                get CurrentData_alive() {
                    return RobotsData_CurrentData_alive.length;
                },
            };
            const tweakPaneFolderID = TweakPaneManager.createFolder("Robots Data", {expanded: true});
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'PhysicsBodies_robotHullGameObjects');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'PhysicsBodies_robotHullMatterBodies');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'PhysicsBodies_robotHullMatterBodyIDs');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'PhysicsBodies_robotTurretGameObjects');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_positions');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_turretPositions');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_currentRobotAngles_degrees');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_currentRobotAngles_radians');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_currentRobotVelocities');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_currentRobotSpeedSqr');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_currentTurretAngles_degrees');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_currentRadarAngles_degrees');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_currentRadarAngles_radians');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_health');
            TweakPaneManager.createMonitorInFolder(tweakPaneFolderID, dataForTweakPane, 'CurrentData_alive');
        },
    };
}());
