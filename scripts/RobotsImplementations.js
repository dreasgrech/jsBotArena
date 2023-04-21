"use strict";

var shredder = (function() {

    var timeElapsed = 0;
    var interval = 3000; // Move for one second, then stop for two seconds
    var rotateTimer = 0;
    var rotateInterval = 1000; // Rotate every one second

    var update = function(api, time, delta) {
        timeElapsed += delta;
        rotateTimer += delta;

        if (rotateTimer >= rotateInterval)
        {
            if (Math.random() > 0.5) {
                api.rotateLeft();
            } else {
                api.rotateRight();
            }
            rotateTimer = 0;
        }

        if (timeElapsed < 1000) { // move
            api.move();
        } else if (timeElapsed < interval) { // stop
            // Do nothing
            api.reverse();
        } else { // Move for one second
            timeElapsed = 0;
        }
        //api.move();
    };

    return {
        name: 'shredder',
        update: update
    };
}());

var circleBot = (function() {

    var forwardSpeed = 1; // Adjust this value to change the forward speed
    var rotationSpeed = 30; // Adjust this value to change the rotation speed

    var update = function(api, time, delta) {
        // Constantly move forward with a custom forward speed
        for (let i = 0; i < forwardSpeed; i++) {
            api.move();
        }

        // Constantly rotate with a custom rotation speed
        for (let i = 0; i < rotationSpeed; i++) {
            api.rotateLeft();
        }
    };

    return {
        name: 'circles',
        update: update
    };
}());

var doNothingBot = (function() {
    return {
        name: 'doNothing',
        update: function() {}
    };
}());
