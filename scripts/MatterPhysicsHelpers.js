"use strict";

var MatterPhysicsHelpers = (function() {

    var loadImage = function({ x, y, id, shapes }) {
        var options = {};
        if (shapes) {
            options.vertices = shapes;
            //console.log(shapes);
        }

        var image = GameContextHolder.gameContext.matter.add.image(x, y, id, null, options);
        return image;
    }

    return {
        loadImage: loadImage
    };
}());
