"use strict";

var PhysicsHelperFunctions = (function() {
    var setCollisionProperties = function({ physicsObject, group, category, collidesWithCategories }) {
        physicsObject.collisionFilter.group = group;
        physicsObject.collisionFilter.category = category;
        physicsObject.collisionFilter.mask = collidesWithCategories;
    };

    return {
        // Andreas: Matter physics does not support tilemap collisions (which is what the arena is made up of).
        // So I created this method with the help of ChatGPT4 which converts the tiles into matter bodies.
        createMatterBodiesFromTilemapLayer: function({ layer, collisionCategory, collidesWith }) {
            const matterBodies = [];
            layer.forEachTile(tile => {
                if (tile.properties.collides) {
                    const x = tile.getCenterX();
                    const y = tile.getCenterY();
                    const w = tile.width;
                    const h = tile.height;
                    const body = GameContextHolder.gameContext.matter.add.rectangle(x, y, w, h, { isStatic: true });
                    setCollisionProperties({
                        physicsObject: body,
                        group: 0,
                        category: collisionCategory,
                        collidesWithCategories: collidesWith
                    });
                    matterBodies.push(body);
                }
            });

            return matterBodies;
        },
        setCollisionProperties: setCollisionProperties
    };
}());
