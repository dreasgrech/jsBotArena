"use strict";

const RobotAPIFactory = (function() {
    const createAPI = function(robotIndex) {
        return (function(robotIndex) {

            const constantAngularVelocityForRotation = 0.01;

            const move = function(direction) {
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

            const rotate = function(direction) {
                const robotBody = RobotsData_PhysicsBodies.robotBodyImages[robotIndex];

                const angularVelocity = constantAngularVelocityForRotation * direction;
                robotBody.setAngularVelocity(angularVelocity);
            };

            const obj = {
                move: function() {
                    move(1);
                },
                reverse: function() {
                    move(-1);
                },
                rotateLeft: function() {
                    rotate(-1);
                },
                rotateRight: function() {
                    rotate(1);
                },
                fire: function(projectileType) {
                    ProjectileManager.fireRobotProjectile(robotIndex, projectileType);
                },
                radarEnabled: true,
                collisionsThisFrame: [],
                scannedRobots: []
            };

            return obj;
        }(robotIndex));
    };

    return {
        createAPI: createAPI
    };
}());
