"use strict";

const UIManager = (function() {
    const obj = {
        initialCreate: function() {
            UIRobotInfoPanel.create();
        },
        update: function(time) {
            UIRobotInfoPanel.update(time);
        }
    };

    return obj;
}());
