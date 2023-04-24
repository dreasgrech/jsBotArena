"use strict";

const Logger = (function() {
    const getFrameCount = function(text) {
        return `<${FrameCounter.current}>`;
    };

    const getTimestamp = function () {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
        return `[${hours}:${minutes}:${seconds}.${milliseconds}]`;
    };

    const callConsole = function(operation) {
        // Skip the operation arg so that we just have the logging arguments
        var logArgs = arguments[1];

        // Add the frame-count and the timestamp
        Array.prototype.unshift.call(logArgs, getFrameCount());
        Array.prototype.unshift.call(logArgs, getTimestamp());

        console[operation].apply(console, logArgs);
        // console.trace();
    }

    const obj = {
        log: function() {
            callConsole('log', arguments);
        },
        warn: function() {
            callConsole('warn', arguments);
        },
        error: function() {
            callConsole('error', arguments);
        }
    };

    return obj;
}());
