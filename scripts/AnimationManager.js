"use strict";

const AnimationManager = (function() {
    /*
     * animationcomplete parameters:https://newdocs.phaser.io/docs/3.52.0/Phaser.Animations.Events.ANIMATION_COMPLETE
     *
     */

    let lastSpriteIDCreated = -1;

    const SPRITESHEETS_KEY = 'tankeffects';
    const SPRITESHEETS_DIRECTORY = "./images/Effects/Spritesheets";
    const animationManager = {
        system_preload: function() {
            const gameContext = GameContextHolder.gameContext;
            gameContext.load.multiatlas(SPRITESHEETS_KEY, `${SPRITESHEETS_DIRECTORY}/TankEffects.json`, `${SPRITESHEETS_DIRECTORY}`);
        },
        system_create: function() {
            const gameContext = GameContextHolder.gameContext;

            const animation = gameContext.anims.create({
                key: 'explosion',
                frames: gameContext.anims.generateFrameNames(SPRITESHEETS_KEY,
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

            const explosionSprite = gameContext.add.sprite(200, 200, SPRITESHEETS_KEY);//, 'Sprite_Effects_Explosion_000.png');
            explosionSprite.setName(42);
            explosionSprite.on('animationcomplete',
                function(animationThatCompleted, currentFrame, gameObject, frameKey) {
                    console.log('anim complete!', animationThatCompleted, currentFrame, gameObject, frameKey);
                });
            explosionSprite.anims.play('explosion');
        }
    };
    return animationManager;
}());