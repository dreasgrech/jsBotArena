"use strict";

const GameContextHolder = (function() {
    const holder = {
        game: null,
        gameContext: null,
        gameTime: 0,
        deltaTime: 0
    };

    return holder;
}());
