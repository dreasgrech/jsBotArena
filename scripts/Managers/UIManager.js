"use strict";

const UIManager = (function() {
    const obj = {
        onArenaLoaded: function() {
            UIRobotInfoPanel.create();
        },
        update: function() {
            UIRobotInfoPanel.update();
        },
        system_unloadLevel: function() {
            UIRobotInfoPanel.clearPanel();
        },
    };

    return obj;
}());
