"use strict";

var UIManager = (function() {
    var obj = {
        initialCreate: function() {
            UIRobotInfoPanel.create();
        },
        update: function(time, delta) {
            UIRobotInfoPanel.update(time, delta);
        }
    };

    return obj;
}());
