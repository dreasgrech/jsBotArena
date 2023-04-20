"use strict";

var RobotAPIFactory = (function() {
    var createAPI = function(robotIndex) {
        return (function(robotIndex) {

            var constantAngularVelocityForRotation = 0.05;

            var radar = {
                angle: 45,
                maxRotation: 45, // 45 degrees per tick
                maxScanDistance: 1200
            };

            var game = GameContextHolder.game;

            // Add radar visualization
            var radarGraphics = new Phaser.GameObjects.Graphics(game.scene.scenes[0]);
            game.scene.scenes[0].add.existing(radarGraphics);

            var drawRadarArc = function () {
                var tankBody = RobotsData.robotBodyImages[robotIndex];
                var tankPosition = tankBody.getCenter();

                radarGraphics.clear();
                radarGraphics.lineStyle(1, 0x00ff00, 0.5);
                radarGraphics.fillStyle(0x00ff00, 0.2);

                radarGraphics.beginPath();
                radarGraphics.moveTo(tankPosition.x, tankPosition.y);
                radarGraphics.arc(tankPosition.x, tankPosition.y, radar.maxScanDistance, Phaser.Math.DegToRad(radar.angle - radar.maxRotation / 2), Phaser.Math.DegToRad(radar.angle + radar.maxRotation / 2));
                radarGraphics.closePath();
                radarGraphics.fillPath();
                radarGraphics.strokePath();

                /******************************/
                radar.angle += 1;
                /******************************/
            };

            var move = function(direction) {
                var tankBody = RobotsData.robotBodyImages[robotIndex];
                var tankSpeed = RobotsData.robotSpeeds[robotIndex];

                var angle = tankBody.angle -
                    90; // The '- 90' is because of Phaser's coordinate system where angle 0 points to the right
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
                var tankBody = RobotsData.robotBodyImages[robotIndex];
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
                drawRadarArc: drawRadarArc
            };
        }(robotIndex));
    };

    return {
        createAPI: createAPI
    };
}());
