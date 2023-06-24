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
        // TODO: Might be best to extract the gameTime and deltaTime from here because they're accessed per-frame
        gameTime: 0,
        deltaTime: 0
    };
}());
