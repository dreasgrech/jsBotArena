"use strict";

const CollisionCategories = (function() {
    const categories = {
        RobotBody: 0,
        RobotTurret: 0,
        Arena: 0,
        RobotProjectile: 0,
        RobotProjectileSensor: 0
    };

    // Assign the correct 2^n value to each category
    var i = 0;
    for (let category in categories) {
        if (Object.prototype.hasOwnProperty.call(categories, category)) {
            const value = Math.pow(2, i);
            // Logger.log(category, `value ${value} = pow(2, ${i})`);
            categories[category] = value;
            i++;
        }
    }

    return categories;
}());
