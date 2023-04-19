"use strict";

var MatterPhysicsHelpers = (function() {

    var loadImage = function({ x, y, id }) {
        var image = GameContextHolder.gameContext.matter.add.image(x, y, id);
        return image;
    }

    return {
        loadImage: loadImage
    };
}());
