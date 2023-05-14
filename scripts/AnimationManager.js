"use strict";

//var TankAnimationEffects = {
//    Explosion: 0,
//    Exhaust_01: 0
//};

const AnimationEffects = {
    TankAnimationEffects: {
        Explosion: 0,
        Exhaust_01: 0
    }
};

const AnimationManager = (function() {
    /*
     * animationcomplete parameters:https://newdocs.phaser.io/docs/3.52.0/Phaser.Animations.Events.ANIMATION_COMPLETE
     */

    // TODO: Create a pool for the sprites
    // TODO: Create a json database for the animations

    let lastAnimationIndexCreated = -1;

    const animationKeyToSpritePoolIndex = {};

    const animations = [];

    //const TANKEFFECTS_SPRITESHEETS_KEY = 'tankeffects';
    //const TANKEFFECTS_SPRITESHEETS_DIRECTORY = "./images/Effects/Spritesheets";
    const animationManager = {
        system_preload: function() {
            const gameContext = GameContextHolder.gameContext;
            //    gameContext.load.multiatlas(
            //        TANKEFFECTS_SPRITESHEETS_KEY,
            //        `${TANKEFFECTS_SPRITESHEETS_DIRECTORY}/TankEffects.json`,
            //        `${TANKEFFECTS_SPRITESHEETS_DIRECTORY}`);
        },
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

                    // animationManager.animationEffects[spritesheetEnumType][animationKey] = animation;
                    // animationManager.animationEffects[spritesheetEnumType][animationKey] = animationIndex;
                    AnimationEffects[spritesheetEnumType][animationKey] = animationIndex;

                    // Map the animation key to the spritesheet pool index that can play it
                    // so that later we can resolve the pool index from the animation key
                    animationKeyToSpritePoolIndex[animationKey] = spritesheetSpritesPoolIndex;
                }

                //    // Construct the ProjectileTypes enum
                //    const enumKey = projectileDefinition.EnumKey;
                //    ProjectileTypes[enumKey] = i; // Ex: ProjectileTypes.Heavy = 3
            }

            // Clear the loaded databases array so that the contents get released because we don't need them anymore
            AnimationSpritesDatabase.clearDatabases();

            /*
            const animation = gameContext.anims.create({
                key: 'explosion',
                frames: gameContext.anims.generateFrameNames(TANKEFFECTS_SPRITESHEETS_KEY,
                    {
                        start: 0,
                        end: 8,
                        zeroPad: 3,
                        prefix: 'Sprite_Effects_Explosion_',
                        suffix: '.png'
                    }),
                frameRate: 10,
                repeat: 0
            });

            console.log(animation);

            const explosionSprite = gameContext.add.sprite(200, 200, TANKEFFECTS_SPRITESHEETS_KEY);//, 'Sprite_Effects_Explosion_000.png');
            explosionSprite.setName(42);
            explosionSprite.on('animationcomplete',
                function(animationThatCompleted, currentFrame, gameObject, frameKey) {
                    console.log('anim complete!', animationThatCompleted, currentFrame, gameObject, frameKey);
                     // explosionSprite.anims.play('5');
                     explosionSprite.setVisible(false);
                });
             // explosionSprite.anims.play('explosion');
            explosionSprite.anims.play(animation);
            */
        },
        //animationEffects: {
        //    TankAnimationEffects: {
        //        Explosion: 0,
        //        Exhaust_01: 0
        //    }
        //},
        playAnimation: function(animationType, x, y) {
            const animation = animations[animationType];
            const animationKey = animation.key;
            const spritesheetPoolIndex = animationKeyToSpritePoolIndex[animationKey];

            const sprite = GameObjectPoolsManager.fetchGameObjectFromPool(spritesheetPoolIndex);
            sprite.x = x;
            sprite.y = y;

            sprite.anims.play(animation);
            console.log(animation, spritesheetPoolIndex);

            // TODO: continue here, spawn the sprite
        }
    };

    return animationManager;
}());