"use strict";

const UIManager = (function() {
    const obj = {
        system_create: function() {
            UIRobotInfoPanel.create();
        },
        update: function() {
            UIRobotInfoPanel.update();
        }
    };

    return obj;
}());
