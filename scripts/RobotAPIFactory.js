"use strict";

var RobotAPIFactory = (function() {
    var createAPI = function(robotIndex) {
        return (function(robotIndex) {

            var constantAngularVelocityForRotation = 0.05;

            var createBullet = function (startX, startY, angle) {
                var bullet = GameContextHolder.gameContext.add.image(startX, startY, "Light_Shell");
                bullet.setAngle(angle);

                var velocity = {
                    x: Math.cos(Phaser.Math.DegToRad(angle)) * 10, // Adjust bullet speed (multiplier) as needed
                    y: Math.sin(Phaser.Math.DegToRad(angle)) * 10, // Adjust bullet speed (multiplier) as needed
                };

                GameContextHolder.gameContext.matter.add.gameObject(bullet);
                bullet.setVelocity(velocity.x, velocity.y);
                bullet.setFrictionAir(0);
                bullet.setBounce(1);
                PhysicsHelperFunctions.setCollisionProperties({
                    physicsObject: bullet.body,
                    group: 0,
                    category: PhysicsCategories.RobotProjectile,
                    collidesWithCategories: PhysicsCategories.RobotBody | PhysicsCategories.Walls | PhysicsCategories.RobotProjectile
                });

                bullet.body.onCollideCallback = function () {
                    console.log('collided');
                    bullet.destroy();
                };

                return bullet;
            };

            var fire = function () {
                var turret = RobotsData_PhysicsBodies.robotTurretImages[robotIndex];
                var angle = turret.angle - 90;

                var turretTipPosition = new Phaser.Math.Vector2();
                turret.getTopLeft(turretTipPosition); // Get the turret's top-left position
                turretTipPosition.x += turret.width * Math.cos(Phaser.Math.DegToRad(angle)); // Calculate the tip's x position
                turretTipPosition.y += turret.width * Math.sin(Phaser.Math.DegToRad(angle)); // Calculate the tip's y position

                createBullet(turretTipPosition.x, turretTipPosition.y, angle);
            };

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
                fire: fire
            };
        }(robotIndex));
    };

    return {
        createAPI: createAPI
    };
}());
