"use strict";

/**
 * Holds a bunch of math related operations.
 * 
 * Note: Try and use the native Math functions directly in hot-paths instead of calling the functions in this object
 */
const MathOperations = (function() {
    const mathOperations = {
        /**
         * Clamps the number between a minimum and a maximum.
         * If value<min, it will return the minimum allowed number.
         * If value > max, it will return the maximum allowed number.
         * If value > min and value < max, it will return the passed number.
         * @param num The number to be clamp
         * @param min The minimum number to clamp to
         * @param max The maximum number to clamp to
         * @returns {number}
         */
        clampBetween: function(num, min, max) {
            return Math.min(Math.max(num, min), max);
        },
        sqrMagnitude: function(x, y) {
            return x * x + y * y;
        },
        /**
         * Calculates the angle between two points.
         * Note: Use the Math.atan2() function directly in hot-paths instead of calling of this indirection.
         * @param point1x
         * @param point1y
         * @param point2x
         * @param point2y
         * @returns {number}
         */
        angleBetweenPoints: function(point1x, point1y, point2x, point2y){
            return Math.atan2(point2y - point1y, point2x - point1x);
        }
    };
    return mathOperations;
}());
