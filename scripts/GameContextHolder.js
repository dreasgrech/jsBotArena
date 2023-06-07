"use strict";

const GameContextHolder = (function() {
    return {
        /**
         * @type {Phaser.Game}
         */
        game: null,
        /**
         * @type {Phaser.Scene}
         */
        scene: null,
        gameTime: 0,
        deltaTime: 0
    };
}());
