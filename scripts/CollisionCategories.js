"use strict";

const CollisionCategories = (function() {
    const categories = {
        RobotBody: 0,
        RobotTurret: 0,
        Arena: 0,
        RobotProjectile: 0
    };

    // Assign the correct 2^n value to each category
    var i = 0;
    for (let category in categories) {
        if (Object.prototype.hasOwnProperty.call(categories, category)) {
            categories[category] = Math.pow(2, i);
            i++;
        }
    }

    return categories;
}());
