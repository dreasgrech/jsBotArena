"use strict";

// Physics bodies
const RobotsData_PhysicsBodies_robotBodyImages = [];
const RobotsData_PhysicsBodies_robotTurretImages = [];

// Data that is updated per frame
const RobotsData_CurrentData_positionXs = [];
const RobotsData_CurrentData_positionYs = [];
const RobotsData_CurrentData_currentRobotAngles_degrees = [];
const RobotsData_CurrentData_currentRobotVelocities = [];
const RobotsData_CurrentData_currentTurretAngles = [];
const RobotsData_CurrentData_currentRadarAngles_degrees = [];
const RobotsData_CurrentData_robotCollisions = []; // [[{,,}], [{,,}], [{,,}]]
const RobotsData_CurrentData_arenaCollisions = []; // [[{,,}], [{,,}], [{,,}]]
const RobotsData_CurrentData_getPosition = function(index) {
    return new Phaser.Math.Vector2(RobotsData_CurrentData_positionXs[index], RobotsData_CurrentData_positionYs[index]);
};

// Robots instance data, doesn't change once created.
const RobotsData_Instance_ids = [];
const RobotsData_Instance_names = [];
const RobotsData_Instance_updateFunctions = [];
const RobotsData_Instance_robotAPIs = [];
const RobotsData_Instance_robotSpeeds = [];

// Radar data
const RobotsData_Radar_radarGraphics = [];
const RobotsData_Radar_radarFOVAngles_degrees = [];
const RobotsData_Radar_radarMaxScanDistance = [];
