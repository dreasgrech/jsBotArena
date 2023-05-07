"use strict";

const RobotOperations_Hull = (function() {
    const constantAngularVelocityForHullRotation = 1;

    const operations = {
        moveHull: function(robotIndex, direction) {
            const robotBody = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];
            const robotSpeed = RobotsData_Instance_robotSpeeds[robotIndex];

            const angle_degrees = RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex];
            const angle_radians = Phaser.Math.DegToRad(angle_degrees);

            //const force = new Phaser.Math.Vector2(Math.cos(angle_radians) * robotSpeed * direction, Math.sin(angle_radians) * robotSpeed * direction);
            const multiplier = robotSpeed * direction * GameContextHolder.deltaTime;
            const force = new Phaser.Math.Vector2(
                Math.cos(angle_radians) * multiplier,
                Math.sin(angle_radians) * multiplier);
            robotBody.applyForce(force);
        },
        rotateHull: function(robotIndex, direction) {
            const angularVelocity = constantAngularVelocityForHullRotation * direction * GameContextHolder.deltaTime;
            //const angularVelocity = constantAngularVelocityForHullRotation * direction;

            const robotBody = RobotsData_PhysicsBodies_robotBodyImages[robotIndex];
            robotBody.setAngularVelocity(angularVelocity);
            return angularVelocity;
        },
        rotateHullTowardsAngle_degrees: function(robotIndex, angle_degrees) {
            const currentAngle_degrees = RobotsData_CurrentData_currentRobotAngles_degrees[robotIndex];
            const angleDifference_degrees = Phaser.Math.Angle.WrapDegrees(angle_degrees - currentAngle_degrees);

            // Determine the direction of rotation
            let direction;
            if (angleDifference_degrees > 0) {
                direction = 1;
            } else if (angleDifference_degrees < 0) {
                direction = -1;
            } else {
                direction = 0;
            }

            // Rotate towards that direction
            const angularVelocity = RobotOperations_Hull.rotateHull(robotIndex, direction);

            // Calculate the angle change without including deltaTime
            const angleChange_degrees = constantAngularVelocityForHullRotation * direction;

            // Check if the robot has reached the target angle
            const angleAfterRotation_degrees = Phaser.Math.Angle.WrapDegrees(currentAngle_degrees + angleChange_degrees);
            const newAngleDifference_degrees = Phaser.Math.Angle.WrapDegrees(angle_degrees - angleAfterRotation_degrees);
            const reachedTargetAngle = (direction === 1 && newAngleDifference_degrees <= 0) ||
                (direction === -1 && newAngleDifference_degrees >= 0) ||
                (direction === 0);

            // return boolean indicating whether we're there
            return reachedTargetAngle;
        },
    };
    return operations;
}());

const RobotOperations_Turret = (function() {
    // const turretRotationPerFrameSpeed = 50;
    const turretRotationPerFrameSpeed = 130;

    const operations = {
        rotateTurret: function(robotIndex, direction) {
            const multiplier = turretRotationPerFrameSpeed * direction * GameContextHolder.deltaTime;
            operations.incrementTurretAngle_degrees(robotIndex, multiplier);
        },
        rotateTurretTowardsAngle_degrees: function(robotIndex, angle_degrees) {
            const currentAngle_degrees = RobotsData_PhysicsBodies_robotTurretImages[robotIndex].angle;
            const angleDifference_degrees = Phaser.Math.Angle.WrapDegrees(angle_degrees - currentAngle_degrees);

            // Determine the direction of rotation
            let direction;
            if (angleDifference_degrees > 0) {
                direction = 1;
            } else if (angleDifference_degrees < 0) {
                direction = -1;
            } else {
                direction = 0;
            }

            // Rotate towards that direction
            const angleChange_degrees = turretRotationPerFrameSpeed * direction * GameContextHolder.deltaTime;
            operations.incrementTurretAngle_degrees(robotIndex, angleChange_degrees);

            // Check if the turret has reached the target angle
            const angleAfterRotation_degrees = Phaser.Math.Angle.WrapDegrees(currentAngle_degrees + angleChange_degrees);
            const newAngleDifference_degrees = Phaser.Math.Angle.WrapDegrees(angle_degrees - angleAfterRotation_degrees);

            // Add a threshold to account for small fluctuations
            const threshold = 0.5;
            const reachedTargetAngle = (direction === 1 && newAngleDifference_degrees <= threshold) ||
                (direction === -1 && newAngleDifference_degrees >= -threshold) ||
                (direction === 0);

            if (reachedTargetAngle) {
                // Set the turret angle directly to the target angle
                operations.setTurretAngle_degrees(robotIndex, angle_degrees);
            }

            // return boolean indicating whether we're there
            return reachedTargetAngle;
        },
        setTurretAngle_degrees: function(robotIndex, angle_degrees) {
            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            turretImage.angle = angle_degrees;
        },
        incrementTurretAngle_degrees: function(robotIndex, angle_degrees) {
            const turretImage = RobotsData_PhysicsBodies_robotTurretImages[robotIndex];
            // const currentTurretImageAngle_degrees = turretImage.angle;
            // todo: here i was working on trying to reduce the jitter when the turret is changing rotation direction very fast (every frame)
            const currentTurretImageAngle_degrees = AngleOperations.normalizeAngleDegrees(turretImage.angle);
            const newTurretImageAngle_degrees = AngleOperations.incrementAngle_degrees(currentTurretImageAngle_degrees, angle_degrees);
            //const newTurretImageAngle_degrees = AngleOperations.lerp_incrementAngle_degrees(currentTurretImageAngle_degrees, angle_degrees);
            if (robotIndex === 1) {
                // todo: currently working here
                // const angleDifference_degrees = Math.abs(newTurretImageAngle_degrees - currentTurretImageAngle_degrees);
                // TODO: if angle diff is less than 0, then we're turning left, otherwise we're turning right
                // TODO: maybe with this we can reduce the jitter when the turret keeps going left and right consecutively
                const angleDifference_degrees = newTurretImageAngle_degrees - currentTurretImageAngle_degrees;
                //console.log(currentTurretImageAngle_degrees, newTurretImageAngle_degrees, angleDifference_degrees);
            }
            turretImage.angle = newTurretImageAngle_degrees;
        },
    };

    return operations;
}());

