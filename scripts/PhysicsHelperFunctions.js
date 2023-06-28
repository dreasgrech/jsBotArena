"use strict";

const PhysicsHelperFunctions = (function() {
    const physicsHelperFunctions = {
        setCollisionProperties : function({ physicsObject, group, category, collidesWithCategories }) {
            const collisionFilter = physicsObject.collisionFilter;
            collisionFilter.group = group;
            collisionFilter.category = category;
            collisionFilter.mask = collidesWithCategories;
        },
        /**
         * Andreas: Matter physics does not support tilemap collisions (which is what the arena is made up of).
         * So I created this method with the help of ChatGPT4 which converts the tiles into matter bodies.
         * It creates a matter collider on each tile on the layer that has the "collides" property set to true.
         * @param layer
         * @param collisionCategory
         * @param collidesWith
         * @return {MatterJS.BodyType[]}
         */
        createMatterBodiesFromTilemapLayer: function({ layer, collisionCategory, collidesWith }) {
            const scene = GameContextHolder.scene;
            /** @type {MatterJS.BodyType[]} */const matterBodies = [];
            layer.forEachTile(tile => {
                if (!tile.properties.collides) {
                    return;
                }
                
                const x = tile.getCenterX();
                const y = tile.getCenterY();
                const w = tile.width;
                const h = tile.height;
                const body = scene.matter.add.rectangle(x, y, w, h, { isStatic: true });
                physicsHelperFunctions.setCollisionProperties({
                    physicsObject: body,
                    group: 0,
                    category: collisionCategory,
                    collidesWithCategories: collidesWith
                });
                matterBodies.push(body);
            });

            return matterBodies;
        },
        /**
         * Shows collision on a layer with a different color for debugging.
         * @param layer
         */
        showDebugLayerCollisions: function(layer) {
            const debugGraphics = GameContextHolder.scene.add.graphics().setAlpha(0.75);
            layer.renderDebug(debugGraphics,
                {
                    tileColor: null, // Color of non-colliding tiles
                    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                });
        },
    };
    
    return physicsHelperFunctions;
}());
