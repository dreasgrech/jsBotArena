"use strict";

var PhysicsBodies = (function() {
    var arenaBodies = [];
    // var arenaBodiesBounds = [];
    const matterBodyToObjectType = {};

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

    var isBodyOverlappingWithArenaBodies = function(body) {
        //var bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(body);
        //console.log(bodyBounds);
        //return false;
        // const tankAABB = computeAABB(body.vertices);
        // console.log(tankAABB);
        //console.log(body.parts);
        // var bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(body);
        // var bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(body);
        // console.log(bodyBounds.body.vertices);
        // var bodyBounds = body.getCenter();

        // var bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds();
        var bodyBounds = body.getBounds();

// Phaser.Physics.Matter.Matter.Bounds.overlaps(tankBody.bounds, existingTankBody.bounds)
        //if (Phaser.Physics.Matter.Matter.Bounds.overlaps(tankBody.bounds, existingTankBody.bounds))


        for (var i = 0; i < arenaBodies.length; i++) {
            var arenaBody = arenaBodies[i];
            // var arenaBodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(arenaBody);
            var arenaBodyBounds = arenaBody.getBounds();

            var collides = Phaser.Physics.Matter.Matter.Bounds.overlaps(bodyBounds, arenaBodyBounds);
            if (collides) {
                return true;
            }
        }

        return false;
    };

    const obj = {
        addArenaPhysicsBodies: function(physicsObjectType, bodies) {
            var arenaBodiesTotalBeforeAdd = arenaBodies.length;
            arenaBodies = arenaBodies.concat(bodies);
            //for (var i = 0; i < bodies.length; i++) {
            //    //arenaBodiesBounds.push(bodies[i].getBounds());
            //    var body = bodies[i];
            //    //    var tankAABB = new Phaser.Geom.Rectangle(
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
                console.log(body);
                matterBodyToObjectType[body.id] =
                {
                    type: physicsObjectType
                };

                // console.log(i, matterBodies[i]);
            }
        },
        matterBodyToObjectType: matterBodyToObjectType,
        isBodyOverlappingWithArenaBodies: isBodyOverlappingWithArenaBodies
    };

    return obj;
}());
