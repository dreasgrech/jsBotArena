"use strict";

const RobotAPIFactory = (function() {
    const createAPI = function(robotIndex) {
        return (function(robotIndex) {

            const constantAngularVelocityForHullRotation = 0.01;
            const constantAngularVelocityForTurretRotation = 10;

            const moveHull = function(direction) {
                const robotBody = RobotsData_PhysicsBodies.robotBodyImages[robotIndex];
                const robotSpeed = RobotsData_Instance.robotSpeeds[robotIndex];

                // const angle = robotBody.angle - 90; // The '- 90' is because of Phaser's coordinate system where angle 0 points to the right
                const angle = RobotsData_CurrentData.currentRobotAngles[robotIndex] - 90; // The '- 90' is because of Phaser's coordinate system where angle 0 points to the right
                const angleRadians = Phaser.Math.DegToRad(angle);

                //console.log(angle);
                const force = new Phaser.Math.Vector2(Math.cos(angleRadians) * robotSpeed * direction, Math.sin(angleRadians) * robotSpeed * direction);
                robotBody.applyForce(force);
                //console.log(robotBody.getCenter());
                // console.log(robotBody.getBounds());
                // robotBody.thrust(0.1);
            };

            const rotateHull = function(direction) {
                const robotBody = RobotsData_PhysicsBodies.robotBodyImages[robotIndex];

                const angularVelocity = constantAngularVelocityForHullRotation * direction;
                robotBody.setAngularVelocity(angularVelocity);
            };

            const rotateTurret = function(direction) {
                const turretImage = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
                turretImage.angle += constantAngularVelocityForTurretRotation * direction;
                Logger.log("new angle", turretImage.angle);
            };

            const obj = {
                move: function() {
                    moveHull(1);
                },
                reverse: function() {
                    moveHull(-1);
                },
                rotateLeft: function() {
                    rotateHull(-1);
                },
                rotateRight: function() {
                    rotateHull(1);
                },
                rotateTurretRight: function() {
                    rotateTurret(1);
                },
                rotateTurretLeft: function() {
                    rotateTurret(-1);
                },
                fire: function(projectileType) {
                    ProjectileManager.fireRobotProjectile(robotIndex, projectileType);
                },
                radarEnabled: true,
                collisionsThisFrame: [],
                scannedRobots: []
                /*
                 * TODO:
                 *      Rename collisionsThisFrame to collisionsWithRobots
                 *      Add collisionsWithArena:[] contains info about collisions with arena walls and obstacles
                 *      Add scannedArena:[] contains info about scanned arena walls and obstacles
                 */
            };

            return obj;
        }(robotIndex));
    };

    return {
        createAPI: createAPI
    };
}());
