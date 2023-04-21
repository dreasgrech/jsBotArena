"use strict";

var RobotAPIFactory = (function() {
    var createAPI = function(robotIndex) {
        return (function(robotIndex) {

            var constantAngularVelocityForRotation = 0.05;

            var move = function(direction) {
                var tankBody = RobotsData_PhysicsBodies.robotBodyImages[robotIndex];
                var tankSpeed = RobotsData_Instance.robotSpeeds[robotIndex];

                var angle = tankBody.angle - 90; // The '- 90' is because of Phaser's coordinate system where angle 0 points to the right
                var angleRadians = Phaser.Math.DegToRad(angle);

                //console.log(angle);
                var force = new Phaser.Math.Vector2(Math.cos(angleRadians) * tankSpeed * direction, Math.sin(angleRadians) * tankSpeed * direction); // * tankSpeed;
                tankBody.applyForce(force);
                //console.log(tankBody.getCenter());
                // console.log(tankBody.getBounds());
                // tankBody.thrust(0.1);
            };

            var moveForward = function() {
                move(1);
            };

            var moveReverse = function() {
                move(-1);
            };

            var rotate = function(direction) {
                var tankBody = RobotsData_PhysicsBodies.robotBodyImages[robotIndex];
                var angularVelocity = constantAngularVelocityForRotation * direction;

                tankBody.setAngularVelocity(angularVelocity);
            };

            var rotateLeft = function() {
                rotate(1);
            };

            var rotateRight = function() {
                rotate(-1);
            };

            return {
                move: moveForward,
                reverse: moveReverse,
                rotateLeft: rotateLeft,
                rotateRight: rotateRight,
            };
        }(robotIndex));
    };

    return {
        createAPI: createAPI
    };
}());
