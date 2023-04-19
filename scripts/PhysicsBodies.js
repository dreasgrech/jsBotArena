"use strict";

var PhysicsBodies = (function() {
    var arenaBodies = [];
    var arenaBodiesBounds = [];

    var addArenaBodies = function(bodies) {
        var arenaBodiesTotalBeforeAdd = arenaBodies.length;
        arenaBodies = arenaBodies.concat(bodies);
        for (var i = 0; i < bodies.length; i++) {
            //arenaBodiesBounds.push(bodies[i].getBounds());
            var body = bodies[i];
            //    var tankAABB = new Phaser.Geom.Rectangle(
            //        body.bounds.min.x,
            //        body.bounds.min.y,
            //        body.bounds.max.x - body.bounds.min.x,
            //        body.bounds.max.y - body.bounds.min.y
            //    );
        }
        console.assert(arenaBodies.length === arenaBodiesTotalBeforeAdd + bodies.length,
            "Make sure that all the elements were added");
    };

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
        var bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(body);
        console.log(bodyBounds);
        return false;
        /*
        // const tankAABB = computeAABB(body.vertices);
        // console.log(tankAABB);
        //console.log(body.parts);
        var bodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(body);
        console.log(bodyBounds.body.vertices);

// Phaser.Physics.Matter.Matter.Bounds.overlaps(tankBody.bounds, existingTankBody.bounds)
        //if (Phaser.Physics.Matter.Matter.Bounds.overlaps(tankBody.bounds, existingTankBody.bounds))


        for (var i = 0; i < arenaBodies.length; i++) {
            var arenaBody = arenaBodies[i];
            var arenaBodyBounds = Phaser.GameObjects.Components.GetBounds.getBounds(arenaBody);

            var collides = Phaser.Physics.Matter.Matter.Bounds.overlaps(bodyBounds, arenaBodyBounds);
            if (collides) {
                return true;
            }
        }

        return false;
        */
    };

    return {
        arenaBodies: arenaBodies,
        addArenaBodies: addArenaBodies,
        isBodyOverlappingWithArenaBodies: isBodyOverlappingWithArenaBodies
    };
}());
