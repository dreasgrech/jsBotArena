"use strict";

const DamageManager = (function () {

    const robotsIndexesHitThisFrame = new Set();

    const damageManager = {
        applyProjectileToRobotDamage: function(projectileIndex, robotIndex) {
            console.assert(projectileIndex != null);
            console.assert(robotIndex != null);

            // Don't let the robot get hit multiple times by projectiles per frame
            if (robotsIndexesHitThisFrame.has(robotIndex)) {
                // Logger.log("Not applying damage to robot because already damaged with projectile this frame.  RobotIndex:", robotIndex);
                return;
            }

            // Logger.log("projectileIndex", projectileIndex, "robotIndex", robotIndex);
            const projectileType = ProjectilesData_projectileType[projectileIndex];
            const projectileBaseDamage = ProjectilesDatabase.baseDamages[projectileType];

            // Calculate the new health for the hit robot and overwrite his current health with it
            const robotHealth = RobotsData_CurrentData_health[robotIndex];
            const newRobotHealth = robotHealth - projectileBaseDamage;
            RobotsData_CurrentData_health[robotIndex] = newRobotHealth;
            //    console.log("Base damage for", projectileType, "is", projectileBaseDamage);
            //    console.log("Robot Index:",robotIndex, "Robot health:", robotHealth, ".  New health:", newRobotHealth);

            // Save the robot's index so that we don't let the robot take multiple projectile damage in the same frame
            robotsIndexesHitThisFrame.add(robotIndex);
        },
        onEndOfFrame: function() {
            robotsIndexesHitThisFrame.clear();
        },
    };

    return damageManager;

}());
