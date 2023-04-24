"use strict";

const Logger = (function() {
    const formatMessage = function(text) {
        return `<${FrameCounter.current}> ${text}`;
    };

    const obj = {
        log: function(text) {
            console.log(formatMessage(text));
        },
        warn: function(text) {
            console.warn(formatMessage(text));
        },
        error: function(text) {
            console.error(formatMessage(text));
        }
    };

    return obj;
}());
