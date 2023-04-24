"use strict";

const PhysicsBodies = (function() {
    let arenaBodies = [];
    // const arenaBodiesBounds = [];
    const matterBodyToObjectType = {};
    const matterObjectIDToRobotIndex = {};

    function computeAABB(vertices) {
        let minX = vertices[0].x;
        let maxX = vertices[0].x;
        let minY = vertices[0].y;
        let maxY = vertices[0].y;

        for (let i = 1; i < vertices.length; i++) {
            minX = Math.min(minX, vertices[i].x);
            maxX = Math.max(maxX, vertices[i].x);
            minY = Math.min(minY, vertices[i].y);
            maxY = Math.max(maxY, vertices[i].y);
        }

        return new Phaser.Geom.Rectangle(minX, minY, maxX - minX, maxY - minY);
    }

    const isBodyOverlappingWithArenaBodies = function(body) {
        //const bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(body);
        //console.log(bodyBounds);
        //return false;
        // const robotAABB = computeAABB(body.vertices);
        // console.log(robotAABB);
        //console.log(body.parts);
        // const bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(body);
        // const bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(body);
        // console.log(bodyBounds.body.vertices);
        // const bodyBounds = body.getCenter();

        // const bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds();
        const bodyBounds = body.getBounds();

// Phaser.Physics.Matter.Matter.Bounds.overlaps(robotBody.bounds, existingRobotBody.bounds)
        //if (Phaser.Physics.Matter.Matter.Bounds.overlaps(robotBody.bounds, existingRobotBody.bounds))


        for (var i = 0; i < arenaBodies.length; i++) {
            const arenaBody = arenaBodies[i];
            // const arenaBodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(arenaBody);
            const arenaBodyBounds = arenaBody.getBounds();

            const collides = Phaser.Physics.Matter.Matter.Bounds.overlaps(bodyBounds, arenaBodyBounds);
            if (collides) {
                return true;
            }
        }

        return false;
    };

    const obj = {
        addArenaPhysicsBodies: function(physicsObjectType, bodies) {
            const arenaBodiesTotalBeforeAdd = arenaBodies.length;
            arenaBodies = arenaBodies.concat(bodies);
            //for (var i = 0; i < bodies.length; i++) {
            //    //arenaBodiesBounds.push(bodies[i].getBounds());
            //    const body = bodies[i];
            //    //    const robotAABB = new Phaser.Geom.Rectangle(
            //    //        body.bounds.min.x,
            //    //        body.bounds.min.y,
            //    //        body.bounds.max.x - body.bounds.min.x,
            //    //        body.bounds.max.y - body.bounds.min.y
            //    //    );
            //}
            console.assert(arenaBodies.length === arenaBodiesTotalBeforeAdd + bodies.length,
                "Make sure that all the elements were added");

            for (let i = 0; i < bodies.length; i++) {
                let body = bodies[i];
                // console.log(body);
                matterBodyToObjectType[body.id] =
                {
                    type: physicsObjectType
                };

                // console.log(i, matterBodies[i]);
            }
        },
        matterBodyToObjectType: matterBodyToObjectType,
        matterObjectIDToEntityIndex: matterObjectIDToRobotIndex,
        isBodyOverlappingWithArenaBodies: isBodyOverlappingWithArenaBodies
    };

    return obj;
}());
