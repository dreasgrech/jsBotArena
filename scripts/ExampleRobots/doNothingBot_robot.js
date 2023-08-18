"use strict";

const doNothingBot = function() {
    return {
        //name: 'doNothing',
        create: function() {},
        onSpawned: function(api, time_seconds) {
            api.radar.radarEnabled = false;
        },
        update: function(api, time_seconds, delta_seconds) {
            api.rotateTowardsAngle_degrees(45);
        }
    };
};

RobotLoader.loadMyRobot(doNothingBot);