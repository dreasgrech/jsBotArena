"use strict";

const AnimationManager = (function() {
    /*
     * animationcomplete parameters:https://newdocs.phaser.io/docs/3.52.0/Phaser.Animations.Events.ANIMATION_COMPLETE
     */

    // TODO: Create a pool for the sprites
    // TODO: Create a json database for the animations

    let lastSpriteIDCreated = -1;

    let spritesPoolIndex;

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
                Logger.log(spriteDefinition);

                const spritesheetTextureKey = spriteDefinition.Key;
                const spritesheetTextureFilename = spriteDefinition.SpritesheetTextureFilename;

                const animationsDefinitions = spriteDefinition.Animations;
                for (let j = 0; j < animationsDefinitions.length; j++) {
                    const animationDefinition = animationsDefinitions[j];

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

                    const animation = gameContext.anims.create(animationOptions);
                    Logger.log(animation);
                }

                //    // Construct the ProjectileTypes enum
                //    const enumKey = projectileDefinition.EnumKey;
                //    ProjectileTypes[enumKey] = i; // Ex: ProjectileTypes.Heavy = 3
            }

            // Clear the loaded databases array so that the contents get released
            AnimationSpritesDatabase.clearDatabases();

            // GameObjectPoolsManager.createGameObjectPool({poolName:''})

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
        }
    };

    return animationManager;
}());