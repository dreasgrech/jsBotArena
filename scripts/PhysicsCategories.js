"use strict";

const PhysicsCategories = (function() {
    //var categories = [
    //    'RobotBody',
    //    'RobotTurret',
    //    'Walls',
    //    'RobotProjectile'
    //];

    //// Assign the correct 2^n value to each category
    //var physicsCategories = {};
    //for (var i = 0; i < categories.length; i++) {
    //    physicsCategories[categories[i]] = Math.pow(2, i);
    //}

    // return physicsCategories;

    var categories = {
        RobotBody: 0,
        RobotTurret: 0,
        Walls: 0,
        RobotProjectile: 0
    };

    var i = 0;
    for (let category in categories) {
        if (Object.prototype.hasOwnProperty.call(categories, category)) {
            categories[category] = Math.pow(2, i);
            i++;
        }
    }

    return categories;
}());
