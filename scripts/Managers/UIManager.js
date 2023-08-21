"use strict";

const UIManager = (function() {
    const obj = {
        system_afterPreloadOnce: function() {
            UIRobotInfoPanel.create();
        },
        update: function() {
            UIRobotInfoPanel.update();
        },
        system_unloadLevel: function() {
            Logger.log("Resetting UIManager. TODO: Needs more work here");
            UIRobotInfoPanel.clearPanel();
        },
    };

    return obj;
}());
