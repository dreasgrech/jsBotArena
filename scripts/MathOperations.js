"use strict";

const MathOperations = (function() {
    const mathOperations = {
        // If value<min, it will return the minimum allowed number
        // If value > max, it will return the maximum allowed number
        // If value > min and value < max, it will return the passed number
        clampBetween: function(num, min, max) {
            return Math.min(Math.max(num, min), max);
        },
        sqrMagnitude: function(x, y) {
            return x * x + y * y;
        }
    };
    return mathOperations;
}());
