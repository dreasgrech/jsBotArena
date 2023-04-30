"use strict";

const AngleOperations = (function() {
    const angleOperations = {
        incrementAngle_degrees: function(angle_degrees, increment_degrees) {
            return angleOperations.normalizeAngleDegrees(angle_degrees + increment_degrees);
        },
        // Normalizes an angle such that it's always between 0 and 360
        normalizeAngleDegrees: function(angleDegrees) {
            return ((angleDegrees % 360) + 360) % 360;
        }
    };

    return angleOperations;
}());
