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

    /** The index of the last sprite that was fetched from the pool*/
    let lastSpriteIndexCreated = -1;

    /** Contains a mapping from the animation key to its corresponding sprite pool index */
    const animationKeyToSpritePoolIndex = {};

    /** An array of all the loaded and available animations, indexed by the animation index */
    const animations = [];

    /** An array of the anchorage indexes that are currently active */
    const spritesAnchorageIndex = [];

    /** An array of all the registered callbacks */
    const animationCompleteCallbacks = [];

    /** An array of all the spawned sprites from the pool right now */
    const spriteIndex_to_spriteIndexPool = [];

    const animationManager = {
        sprites: [],
        system_afterPreloadOnce: function() {
            const gameContext = GameContextHolder.scene;

            let lastAnimationIndexCreated = -1;

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
                    createElement: function() {
                        const sprite = gameContext.add.sprite(0, 0, spritesheetKey, null);
                        sprite.on('animationcomplete',
                            function(animationThatCompleted, currentFrame, gameObject, frameKey) {
                                const spriteIndex = sprite.spriteIndex;
                                //Logger.log('anim complete!', 'sprite-index:', spriteIndex, animationThatCompleted, currentFrame, gameObject, frameKey);
                                GameObjectPoolsManager.returnGameObjectToPool(spritesheetSpritesPoolIndex, sprite);

                                // Run animationcomplete callbacks
                                const animationCompleteCallbacksLength = animationCompleteCallbacks.length;
                                for (let j = 0; j < animationCompleteCallbacksLength; j++) {
                                    const animationCompleteCallback = animationCompleteCallbacks[j];
                                    animationCompleteCallback(spriteIndex);
                                }
                            });
                        return sprite;
                    }
                });
                GameObjectPoolsManager.prePopulateGameObjectsPool(spritesheetSpritesPoolIndex, PoolsPrepopulateValues.Animations);
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
        },
        /**
         * Registers a callback function that's called whenever an animation finishes
         * @param {function} callback
         */
        registerAnimationCompleteCallback: function(callback) {
            animationCompleteCallbacks.push(callback);
        },
        /**
         * Fetches a new sprite that's ready to be used for animations.
         * Returns the sprite index of the newly fetched sprite
         * @param {AnimationEffects} animationType
         * @returns {number}
         */
        fetchSpriteForAnimation: function(animationType) {
            //console.log(animationType, animations);
            const animation = animations[animationType];
            const animationKey = animation.key;
            const spritesheetPoolIndex = animationKeyToSpritePoolIndex[animationKey];

            // Fetch a sprite from the pool
            // const spriteIndex = animationManager.fetchSpriteFromPool(spritesheetPoolIndex);
            const spriteIndex = fetchSpriteFromPool(spritesheetPoolIndex);

            // Make sure the sprite is ready for animations
            const sprite = animationManager.sprites[spriteIndex];
            sprite.anims.timeScale = 1;

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
        setSpritePositionAndAngle: function(spriteIndex, x, y, angle_degrees) {
            const sprite = animationManager.sprites[spriteIndex];
            sprite.x = x;
            sprite.y = y;
            sprite.angle = angle_degrees;
        },
        /**
         * Plays an animation on the specified sprite
         * @param {number} spriteIndex
         * @param {AnimationEffects} animationType
         */
        playAnimationOnSprite: function(spriteIndex, animationType) {
            const animation = animations[animationType];
            const sprite = animationManager.sprites[spriteIndex];

            // Play the animation on the sprite
            sprite.anims.play(animation);
        },
        /**
         * Plays an animation.
         * Returns the sprite index of the animation
         * @param {AnimationEffects} animationType
         * @param {number} x
         * @param {number} y
         * @param {number} angle_degrees
         * @param {number} gameObjectDepth
         * @param {number} scale
         * @returns {number}
         */
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
        /**
         * Anchors an animation to a GameObject
         * @param {number} spriteIndex
         * @param {Phaser.GameObjects.GameObject} gameObjectAnchor
         * @param {number} originOffsetX
         * @param {number} originOffsetY
         * @param {boolean} copyRotation
         */
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
        /**
         * Removes a previously created anchor
         * @param {number} spriteIndex
         */
        removeAnchor: (spriteIndex) => {
            const anchorageIndex = spritesAnchorageIndex[spriteIndex];
            if (anchorageIndex == null) {
                return;
            }

            // Remove the anchor
            ObjectAnchorManager.removeAnchor(anchorageIndex);

            spritesAnchorageIndex[spriteIndex] = null;
        },
        /**
         * Called when you don't need the sprite anymore
         * @param {number} spriteIndex
         */
        destroySpriteAnimation: (spriteIndex) => {
            // Return the sprite back to the pool
            const poolIndex = spriteIndex_to_spriteIndexPool[spriteIndex];
            const sprite = animationManager.sprites[spriteIndex];
            GameObjectPoolsManager.returnGameObjectToPool(poolIndex, sprite);

            spriteIndex_to_spriteIndexPool[spriteIndex] = null;

            // Remove any anchors this sprite might have
            animationManager.removeAnchor(spriteIndex);

        },
        /**
         * Allows you to vary the speed of the animations
         * @param {number} spriteIndex
         * @param {number} timeScale
         */
        setTimescale: (spriteIndex, timeScale) => {
            const sprite = animationManager.sprites[spriteIndex];
            sprite.anims.timeScale = timeScale;
        },
        // This function is only used for debugging-purposes
        resolveSprite: (spriteIndex) => animationManager.sprites[spriteIndex],
        system_unloadLevel: function() {
            lastSpriteIndexCreated = -1;
        }
    };

    /**
     * Fetches a new Phaser.Physics.Matter.Sprite from the pool.
     * Returns the newly fetched sprite's index
     * @param {number} poolIndex
     * @returns {number}
     */
    const fetchSpriteFromPool = function(poolIndex) {
        // Fetch a sprite from the pool
        const sprite = GameObjectPoolsManager.fetchGameObjectFromPool(poolIndex);

        // Save the sprite in our collection so that other functions can use it
        const spriteIndex = ++lastSpriteIndexCreated;
        animationManager.sprites[spriteIndex] = sprite;

        // Save a reference from the spriteIndex to the pool index which it came from
        spriteIndex_to_spriteIndexPool[spriteIndex] = poolIndex;

        // Save the sprite index with the sprite object for later use
        sprite.spriteIndex = spriteIndex;

        return spriteIndex;
    };

    return animationManager;
}());