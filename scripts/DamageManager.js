"use strict";

const DamageManager = (function () {

    const damageManager = {
        applyProjectileToRobotDamage: function(projectileIndex, robotIndex) {
            Logger.log("projectileIndex", projectileIndex, "robotIndex", robotIndex);
            // TODO: continue here
            // TODO: continue here
            // TODO: continue here
            // TODO: continue here
            const projectileType = ProjectilesData_projectileType[projectileIndex];
            const projectileBaseDamage = ProjectilesDatabase.baseDamages[projectileType];

            // Calculate the new health for the hit robot and overwrite his current health with it
            const robotHealth = RobotsData_CurrentData_health[robotIndex];
            const newRobotHealth = robotHealth - projectileBaseDamage;
            RobotsData_CurrentData_health[robotIndex] = newRobotHealth;
            //    console.log("Base damage for", projectileType, "is", projectileBaseDamage);
            //    console.log("Robot Index:",robotIndex, "Robot health:", robotHealth, ".  New health:", newRobotHealth);
        }
    };

    return damageManager;

}());
