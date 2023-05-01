"use strict";

const MathOperations = (function() {
    const mathOperations = {
        // If value<min, it will return the minimum allowed number
        // If value > max, it will return the maximum allowed number
        // If value > min and value < max, it will return the passed number
        clampBetween(num, min, max) {
            return Math.min(Math.max(num, min), max);
        }
    };
    return mathOperations;
}());
