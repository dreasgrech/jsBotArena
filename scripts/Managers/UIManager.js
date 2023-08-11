"use strict";

const UIManager = (function() {
    const obj = {
        system_create: function() {
            UIRobotInfoPanel.create();
        },
        update: function() {
            UIRobotInfoPanel.update();
        },
        system_newRoundReset: function() {
            Logger.log("Resetting UIManager. TODO: Needs more work here");
        },
    };

    return obj;
}());
