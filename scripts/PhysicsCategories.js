"use strict";

const PhysicsCategories = (function() {
    var categories = [
        'RobotBody',
        'RobotTurret',
        'Walls'
    ];

    // Assign the correct 2^n value to each category
    var physicsCategories = {};
    for (var i = 0; i < categories.length; i++) {
        physicsCategories[categories[i]] = Math.pow(2, i);
    }

    return physicsCategories;
}());
