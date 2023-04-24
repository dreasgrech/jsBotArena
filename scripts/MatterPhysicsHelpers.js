"use strict";

const MatterPhysicsHelpers = (function() {

    const loadImage = function({ x, y, id, shapes }) {
        const options = {};
        if (shapes) {
            options.vertices = shapes;
            //console.log(shapes);
        }

        const image = GameContextHolder.gameContext.matter.add.image(x, y, id, null, options);
        return image;
    }

    return {
        loadImage: loadImage
    };
}());
