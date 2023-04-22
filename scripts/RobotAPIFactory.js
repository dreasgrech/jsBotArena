"use strict";

const RobotAPIFactory = (function() {
    const createAPI = function(robotIndex) {
        return (function(robotIndex) {

            const constantAngularVelocityForRotation = 0.05;

            const move = function(direction) {
                const tankBody = RobotsData_PhysicsBodies.robotBodyImages[robotIndex];
                const tankSpeed = RobotsData_Instance.robotSpeeds[robotIndex];

                const angle = tankBody.angle - 90; // The '- 90' is because of Phaser's coordinate system where angle 0 points to the right
                const angleRadians = Phaser.Math.DegToRad(angle);

                //console.log(angle);
                const force = new Phaser.Math.Vector2(Math.cos(angleRadians) * tankSpeed * direction, Math.sin(angleRadians) * tankSpeed * direction); // * tankSpeed;
                tankBody.applyForce(force);
                //console.log(tankBody.getCenter());
                // console.log(tankBody.getBounds());
                // tankBody.thrust(0.1);
            };

            const rotate = function(direction) {
                const tankBody = RobotsData_PhysicsBodies.robotBodyImages[robotIndex];
                const angularVelocity = constantAngularVelocityForRotation * direction;

                tankBody.setAngularVelocity(angularVelocity);
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
                collisionsThisFrame: []
            };

            return obj;
        }(robotIndex));
    };

    return {
        createAPI: createAPI
    };
}());
