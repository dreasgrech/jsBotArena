"use strict";

//var TankAnimationEffects = {
//    Explosion: 0,
//    Exhaust_01: 0
//};

const AnimationEffects = {
    TankAnimationEffects: {
        Exhaust_01: 0,
        Exhaust_02: 0,
        Explosion: 0,
        Fire_Shots_Flame: 0,
        Fire_Shots_Impact_A: 0,
        Fire_Shots_Impact_B: 0,
        Fire_Shots_A: 0,
        Fire_Shots_B: 0,
    }
};

const AnimationManager = (function() {
    /*
     * animationcomplete parameters:https://newdocs.phaser.io/docs/3.52.0/Phaser.Animations.Events.ANIMATION_COMPLETE
     */

    let lastAnimationIndexCreated = -1;

    const animationKeyToSpritePoolIndex = {};

    const animations = [];

    const animationManager = {
        system_preload: function() { },
        system_create: function() {
            const gameContext = GameContextHolder.gameContext;

            const loadedDatabasesFromJSON = AnimationSpritesDatabase.loadedDatabasesFromJSON;
            for (let i = 0; i < loadedDatabasesFromJSON.length; i++) {
                const spriteDefinition = loadedDatabasesFromJSON[i];
                // Logger.log(spriteDefinition);

                const spritesheetTextureKey = spriteDefinition.Key;
                const spritesheetTextureFilename = spriteDefinition.SpritesheetTextureFilename;
                const spritesheetEnumType = spriteDefinition.EnumType;

                // Create the pool of the sprites that will use this spritesheet
                const spritesheetSpritesPoolIndex = GameObjectPoolsManager.createGameObjectPool({
                    poolName: spritesheetTextureKey,
                    createElement: () => {
                        const sprite = gameContext.add.sprite(0, 0, spritesheetTextureKey);
                        sprite.on('animationcomplete', function(animationThatCompleted, currentFrame, gameObject, frameKey) {
                                //console.log('anim complete!', animationThatCompleted, currentFrame, gameObject, frameKey);
                                GameObjectPoolsManager.returnGameObjectToPool(spritesheetSpritesPoolIndex, sprite);
                        });
                        return sprite;
                    }
                });
                GameObjectPoolsManager.prePopulateGameObjectsPool(spritesheetSpritesPoolIndex, 10);
                // Logger.log("spritesheetSpritesPoolIndex", spritesheetSpritesPoolIndex);

                const animationsDefinitions = spriteDefinition.Animations;
                for (let j = 0; j < animationsDefinitions.length; j++) {
                    const animationDefinition = animationsDefinitions[j];

                    const animationKey = animationDefinition.Key;

                    const animationOptions = {
                        key: animationDefinition.Key,
                        frames: gameContext.anims.generateFrameNames(spritesheetTextureKey,
                            {
                                start: animationDefinition.StartFrameNumber,
                                end: animationDefinition.EndFrameNumber,
                                zeroPad: animationDefinition.FrameZeroPadding,
                                prefix: animationDefinition.FramePrefix,
                                suffix: animationDefinition.FrameSuffix
                            }),
                        frameRate: animationDefinition.FrameRate,
                        repeat: animationDefinition.Repeat
                    };

                    // Create the animation
                    const animation = gameContext.anims.create(animationOptions);
                    // Logger.log(animation);

                    const animationIndex = ++lastAnimationIndexCreated;

                    animations[animationIndex] = animation;

                    AnimationEffects[spritesheetEnumType][animationKey] = animationIndex;

                    // Map the animation key to the spritesheet pool index that can play it
                    // so that later we can resolve the pool index from the animation key
                    animationKeyToSpritePoolIndex[animationKey] = spritesheetSpritesPoolIndex;
                }
            }

            // Clear the loaded databases array so that the contents get released because we don't need them anymore
            AnimationSpritesDatabase.clearDatabases();
        },
        playAnimation: function(animationType, x, y, angle_degrees = 0) {
            const animation = animations[animationType];
            const animationKey = animation.key;
            const spritesheetPoolIndex = animationKeyToSpritePoolIndex[animationKey];

            // Fetch a sprite from the pool
            const sprite = GameObjectPoolsManager.fetchGameObjectFromPool(spritesheetPoolIndex);
            sprite.x = x;
            sprite.y = y;

            // Play the animation on the sprite
            sprite.anims.play(animation);

            // console.log(animation, spritesheetPoolIndex);
        }
    };

    return animationManager;
}());