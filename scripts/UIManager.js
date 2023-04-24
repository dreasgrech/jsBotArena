"use strict";

const UIManager = (function() {
    const obj = {
        initialCreate: function() {
            UIRobotInfoPanel.create();
        },
        update: function(time, delta) {
            UIRobotInfoPanel.update(time, delta);
        }
    };

    return obj;
}());
