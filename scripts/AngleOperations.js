"use strict";

const AngleOperations = (function() {
    function lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    const angleOperations = {
        incrementAngle_degrees: function(angle_degrees, increment_degrees) {
            return angleOperations.normalizeAngleDegrees(angle_degrees + increment_degrees);
        },
        lerp_incrementAngle_degrees: function(angle_degrees, increment_degrees) {
            const normalizedAngle_degrees = angleOperations.normalizeAngleDegrees(
                lerp(angle_degrees, angle_degrees + increment_degrees, GameContextHolder.deltaTime * 10));
            return normalizedAngle_degrees;
        },
        // Normalizes an angle such that it's always between 0 and 360
        normalizeAngleDegrees: function(angleDegrees) {
            return ((angleDegrees % 360) + 360) % 360;
        }
    };

    return angleOperations;
}());

// todo: try lerping the angle of radar outside not here
