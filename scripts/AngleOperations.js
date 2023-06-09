"use strict";

const AngleOperations = (function() {
    const angleOperations = {
        incrementAngle_degrees: function(angle_degrees, increment_degrees) {
            return angleOperations.normalizeAngle_degrees(angle_degrees + increment_degrees);
        },
        incrementAngle_radians: function(angle_radians, increment_radians) {
            return angleOperations.normalizeAngle_radians(angle_radians + increment_radians);
        },
        lerp_incrementAngle_degrees: function(angle_degrees, increment_degrees) {
            const normalizedAngle_degrees = angleOperations.normalizeAngle_degrees(
                NumberOperations.lerp(angle_degrees, angle_degrees + increment_degrees, GameContextHolder.deltaTime * 10));
            return normalizedAngle_degrees;
        },
        // Normalizes an angle such that it's always between 0 and 360
        normalizeAngle_degrees: function(angleDegrees) {
            return ((angleDegrees % 360) + 360) % 360;
        },
        normalizeAngle_radians: function(angleRadians) {
            return ((angleRadians % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        },
        getBearing_degrees: function(position1X, position1Y, position2X, position2Y) {
            const bearingRadians = Phaser.Math.Angle.Between(position1X, position1Y, position2X, position2Y);
            const bearingDegrees = Phaser.Math.RadToDeg(bearingRadians);
            const bearing_degrees = AngleOperations.normalizeAngle_degrees(bearingDegrees);
            return bearing_degrees;
        },
        getOppositeAngle_degrees: angle_degrees => {
            return (angle_degrees + 180) % 360;
        }
    };

    return angleOperations;
}());
