"use strict";

const AngleOperations = (function() {
    const angleOperations = {
        // Normalizes an angle such that it's always between 0 and 360
        normalizeAngleDegrees: function(angleDegrees) {
            return ((angleDegrees % 360) + 360) % 360;
        }
    };

    return angleOperations;
}());
