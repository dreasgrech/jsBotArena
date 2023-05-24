"use strict";

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
        Track_1: 0,
        Track_2: 0,
        Track_3: 0,
        Track_4: 0,
    }
};


const AnimationManager = (function() {
    /*
     * animationcomplete parameters:https://newdocs.phaser.io/docs/3.52.0/Phaser.Animations.Events.ANIMATION_COMPLETE
     */

    let lastSpriteIndexCreated = -1;
    let lastAnimationIndexCreated = -1;

    const animationKeyToSpritePoolIndex = {};

    const animations = [];

    const spritesAnchorageIndex = [];
    const spriteIndex_to_spriteIndexPool = [];

    const fetchSpriteFromPool = function(poolIndex) {
        // Fetch a sprite from the pool
        const sprite = GameObjectPoolsManager.fetchGameObjectFromPool(poolIndex);

        // Save the sprite in our collection so that other functions can use it
        const spriteIndex = ++lastSpriteIndexCreated;
        animationManager.sprites[spriteIndex] = sprite;

        // Save a reference from the spriteIndex to the pool index which it came from
        spriteIndex_to_spriteIndexPool[spriteIndex] = poolIndex;

        return spriteIndex;
    };

    const animationManager = {
        sprites: [],
        system_preload: function() {},
        system_create: function() {
            const gameContext = GameContextHolder.gameContext;

            const loadedDatabasesFromJSON = AnimationSpritesDatabase.loadedDatabasesFromJSON;
            for (let i = 0; i < loadedDatabasesFromJSON.length; i++) {
                const spriteDefinition = loadedDatabasesFromJSON[i];
                // Logger.log(spriteDefinition);

                //const spritesheetTextureKey = spriteDefinition.Key;
                //const spritesheetTextureFilename = spriteDefinition.SpritesheetTextureFilename;
                const spritesheetEnumType = spriteDefinition.EnumType;
                const spritesheetKey = spriteDefinition.SpritesheetKey;

                // Create the pool of the sprites that will use this spritesheet
                const spritesheetSpritesPoolIndex = GameObjectPoolsManager.createGameObjectPool({
                    poolName: spritesheetKey,
                    createElement: () => {
                        const sprite = gameContext.add.sprite(0, 0, spritesheetKey, null);
                        sprite.on('animationcomplete',
                            function(animationThatCompleted, currentFrame, gameObject, frameKey) {
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
                        frames: gameContext.anims.generateFrameNames(spritesheetKey,
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
            console.log(animations);
        },
        fetchSpriteForAnimation: function(animationType) {
            //console.log(animationType, animations);
            const animation = animations[animationType];
            const animationKey = animation.key;
            const spritesheetPoolIndex = animationKeyToSpritePoolIndex[animationKey];

            // Fetch a sprite from the pool
            // const spriteIndex = animationManager.fetchSpriteFromPool(spritesheetPoolIndex);
            const spriteIndex = fetchSpriteFromPool(spritesheetPoolIndex);
            return spriteIndex;
        },
        setSpriteDetails: function(spriteIndex, gameObjectDepth, scale = 1) {
            const sprite = animationManager.sprites[spriteIndex];
            sprite.depth = gameObjectDepth;
            sprite.setScale(scale);
        },
        setSpritePosition: function(spriteIndex, x, y) {
            const sprite = animationManager.sprites[spriteIndex];
            sprite.x = x;
            sprite.y = y;
        },
        setSpriteAngle_degrees: function(spriteIndex, angle_degrees) {
            const sprite = animationManager.sprites[spriteIndex];
            sprite.angle = angle_degrees;
        },
        playAnimationOnSprite: function(spriteIndex, animationType) {
            const animation = animations[animationType];
            const sprite = animationManager.sprites[spriteIndex];

            // Play the animation on the sprite
            sprite.anims.play(animation);
        },
        playNewAnimation: function(animationType, x, y, angle_degrees, gameObjectDepth, scale = 1) {
            // Fetch a sprite for the animation from the pool
            const spriteIndex = animationManager.fetchSpriteForAnimation(animationType);

            animationManager.setSpritePosition(spriteIndex, x, y);
            animationManager.setSpriteAngle_degrees(spriteIndex, angle_degrees);
            animationManager.setSpriteDetails(spriteIndex, gameObjectDepth, scale);

            // Play the animation on the sprite
            animationManager.playAnimationOnSprite(spriteIndex, animationType);

            return spriteIndex;
        },
        anchorAnimationTo: (spriteIndex, gameObjectAnchor, originOffsetX, originOffsetY, copyRotation) => {
            const sprite = animationManager.sprites[spriteIndex];
            const anchorageIndex = ObjectAnchorManager.anchorToGameObject(
                sprite,
                gameObjectAnchor,
                originOffsetX,
                originOffsetY,
                copyRotation);

            spritesAnchorageIndex[spriteIndex] = anchorageIndex;
        },
        removeAnchor: (spriteIndex) => {
            const anchorageIndex = spritesAnchorageIndex[spriteIndex];
            if (anchorageIndex == null) {
                return;
            }

            // Remove the anchor
            ObjectAnchorManager.removeAnchor(anchorageIndex);

            spritesAnchorageIndex[spriteIndex] = null;
        },
        // Called when you don't need the sprite anymore
        destroySpriteAnimation: (spriteIndex) => {
            // Return the sprite back to the pool
            const poolIndex = spriteIndex_to_spriteIndexPool[spriteIndex];
            const sprite = animationManager.sprites[spriteIndex];
            GameObjectPoolsManager.returnGameObjectToPool(poolIndex, sprite);

            spriteIndex_to_spriteIndexPool[spriteIndex] = null;

            // Remove any anchors this sprite might have
            animationManager.removeAnchor(spriteIndex);

        },
        // Allows you to vary the speed of the animations
        setTimescale: (spriteIndex, timeScale) => {
            const sprite = animationManager.sprites[spriteIndex];
            sprite.anims.timeScale = timeScale;
        },
        // This function is only used for debugging-purposes
        resolveSprite: (spriteIndex) => animationManager.sprites[spriteIndex]
    };

    return animationManager;
}());