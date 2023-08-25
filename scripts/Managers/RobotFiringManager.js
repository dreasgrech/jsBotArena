"use script";

/**
 * In charge of initiating a robot's firing of projectiles
 */
const RobotFiringManager = (function() {
    /**
     * The minimum time between firing projectiles
     * @type {number}
     */
    const BASE_PROJECTILE_INTERVAL_DELAY_SECONDS = 1;

    /**
     * The time that each robot last fired a projectile
     * @type {number[]}
     */
    const robotsLastFiredTime = [];

    /**
     * A map between the muzzle flash animation sprite index and the robot index that fired it
     * @type {{}}
     */
    const robotMuzzleFlashAnimationSpriteIndex_to_robotIndex = {};

    /**
     * Used to clean up the robot muzzle flash animation mapping
     * @param spriteIndex
     */
    const handleRobotFiringProjectileAnimationComplete = function(spriteIndex) {
        const totalRobotFiringProjectilesActiveAnimationSpritesBeforeDelete = Object.getOwnPropertyNames(robotMuzzleFlashAnimationSpriteIndex_to_robotIndex).length;
        delete robotMuzzleFlashAnimationSpriteIndex_to_robotIndex[spriteIndex];
        Logger.assert(Object.getOwnPropertyNames(robotMuzzleFlashAnimationSpriteIndex_to_robotIndex).length === totalRobotFiringProjectilesActiveAnimationSpritesBeforeDelete - 1, "robotFiringProjectilesActiveAnimationSprites.length should be 1 less than before: " + Object.getOwnPropertyNames(robotMuzzleFlashAnimationSpriteIndex_to_robotIndex).length + " vs " + totalRobotFiringProjectilesActiveAnimationSpritesBeforeDelete);
    };

    // Hook to the animation complete callback so that we can remove the muzzle flash animation mapping
    AnimationManager.registerAnimationCompleteCallback(function(spriteIndex) {
        const robotIndex = robotMuzzleFlashAnimationSpriteIndex_to_robotIndex[spriteIndex];
        if (robotIndex >= 0) {
            console.log("firing animation complete", robotIndex);
            handleRobotFiringProjectileAnimationComplete(spriteIndex);
        }
    });
    
    /**
     * Returns a value indicating whether the specified robot can currently fire
     * @param {number} robotIndex
     * @returns {boolean}
     */
    const robotAllowedToFireNow = function(robotIndex) {
        const now = GameContextHolder.gameTime;
        const robotLastFiredTime = robotsLastFiredTime[robotIndex];
        const allowedToFireNow = now - robotLastFiredTime > BASE_PROJECTILE_INTERVAL_DELAY_SECONDS;
        return allowedToFireNow;
    };
    
    const robotFiringManager = {
        onRobotAdded: function(robotIndex) {
            robotsLastFiredTime[robotIndex] = -BASE_PROJECTILE_INTERVAL_DELAY_SECONDS;
        },
        update: function() {
            // TODO: Can we simplify this for loop here to not check for hasOwnProperty?
            // Update all the currently active robot firing projectiles muzzle flash animations to stay attached to the turret tip
            for (let muzzleFlashAnimationSpriteIndex in robotMuzzleFlashAnimationSpriteIndex_to_robotIndex) {
                if (!robotMuzzleFlashAnimationSpriteIndex_to_robotIndex.hasOwnProperty(muzzleFlashAnimationSpriteIndex)) {
                    continue;
                }

                const robotIndex = robotMuzzleFlashAnimationSpriteIndex_to_robotIndex[muzzleFlashAnimationSpriteIndex];
                //Logger.log(
                //    'fireShotAnimationSpriteIndex',
                //    fireShotAnimationSpriteIndex,
                //    'robotIndex',
                //    robotIndex);

                const turretImage = RobotsData_PhysicsBodies_robotTurretGameObjects[robotIndex];
                // const turretTipPosition = RobotsBoundsHelpers.getTurretTipPosition(robotIndex);
                const turretTipPosition = RobotsBoundsHelpers.getTurretTipPosition(turretImage);
                const turretTipPositionX = turretTipPosition.x;
                const turretTipPositionY = turretTipPosition.y;
                const turretAngle_degrees = turretImage.angle;

                AnimationManager.setSpritePositionAndAngle(
                    muzzleFlashAnimationSpriteIndex,
                    turretTipPositionX,
                    turretTipPositionY,
                    turretAngle_degrees);
            }
        },
        /**
         * Fires a projectile from the robot's turret.
         * Returns true if the shot was fired.
         * @param {number} robotIndex
         * @param {ProjectileTypes} projectileType
         * @returns {boolean}
         */
        fireRobotProjectile: function(robotIndex, projectileType) {
            const allowedToFireNow = robotAllowedToFireNow(robotIndex);
            if (!allowedToFireNow) {
                return false;
            }
            
            // Spawn and fire the projectile
            ProjectileManager.spawnRobotProjectile(robotIndex, projectileType);

            const turretImage = RobotsData_PhysicsBodies_robotTurretGameObjects[robotIndex];
            const turretAngle_degrees = turretImage.angle;
            const turretTipPosition = RobotsBoundsHelpers.getTurretTipPosition(turretImage);
            const turretTipPositionX = turretTipPosition.x;
            const turretTipPositionY = turretTipPosition.y;
            
            // Play the muzzle flash animation
            const muzzleFlashAnimationSpriteIndex = AnimationManager.playNewAnimation(
                AnimationEffects.TankAnimationEffects.Fire_Shots_A,
                turretTipPositionX,
                turretTipPositionY,
                turretAngle_degrees,
                GameObjectDepths.ImpactAnimation,
                ROBOT_SCALE);

            robotMuzzleFlashAnimationSpriteIndex_to_robotIndex[muzzleFlashAnimationSpriteIndex] = robotIndex;

            //AnimationManager.sprites[fireShotAnimationIndex].setScale(ROBOT_SCALE);
            
            robotsLastFiredTime[robotIndex] = GameContextHolder.gameTime;
        },
        system_unloadLevel: function() {
            // Stop all currently active animations
            const spritesIndexes = Object.getOwnPropertyNames(robotMuzzleFlashAnimationSpriteIndex_to_robotIndex);
            for (let i = 0; i < spritesIndexes.length; i++) {
                const spriteIndex = +spritesIndexes[i]; // The + here is to convert the string to a number
                AnimationManager.destroySpriteAnimation(spriteIndex); 
                handleRobotFiringProjectileAnimationComplete(spriteIndex)
            }
            
            // Asserts to make sure everything is cleaned up
            Logger.assert(Object.getOwnPropertyNames(robotMuzzleFlashAnimationSpriteIndex_to_robotIndex).length === 0, "robotFiringProjectilesActiveAnimationSprites.length should be 0: " + Object.getOwnPropertyNames(robotMuzzleFlashAnimationSpriteIndex_to_robotIndex).length);
            
            robotsLastFiredTime.length = 0;
        }
    };
    
    return robotFiringManager;
}());