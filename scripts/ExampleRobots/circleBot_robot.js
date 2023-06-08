"use strict";

const circleBot = function() {

    const forwardSpeed = 1; // Adjust this value to change the forward speed
    const rotationSpeed = 30; // Adjust this value to change the rotation speed

    const update = function(api, time_seconds, delta_seconds) {
        // Constantly move forward with a custom forward speed
        for (let i = 0; i < forwardSpeed; i++) {
            api.move();
        }

        // Constantly rotate with a custom rotation speed
        //for (let i = 0; i < rotationSpeed; i++) {
            api.rotateLeft();
        //}

        const turret = api.turret;
        turret.rotateLeft();

        const radar = api.radar;
        radar.radarFollowTurret = true;
        if (radar.scannedAliveRobots.length > 0) {
            api.fire(ProjectileTypes.Medium);
        }
    };

    return {
        name: 'circles',
        create: function() {},
        update: update
    };
};
