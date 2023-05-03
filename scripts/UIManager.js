"use strict";

const UIManager = (function() {
    const obj = {
        initialCreate: function() {
            UIRobotInfoPanel.create();
        },
        update: function() {
            UIRobotInfoPanel.update();
        }
    };

    return obj;
}());
